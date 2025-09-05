import { supabase } from "../supabaseClient.js";

// Get tasks function
export const getTasksInfo = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("metro_tasks")
      .select("*")
      .eq("level_id", id)
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error("Error fetching tasks info:", error);
    return res.status(500).json({ error: "Error fetching tasks info" });
  }
};

// Get station function
export const getStation = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("metro_stations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error("Error fetching station:", error);
    return res.status(500).json({ error: "Error fetching station" });
  }
};

// Get all stations function
export const getAllStations = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("metro_stations")
      .select("*");

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error("Error fetching stations:", error);
    return res.status(500).json({ error: "Error fetching stations" });
  }
};

// Get lines with stations function
export const getLinesWithStations = async (req, res) => {
  try {
    // Get lines
    const { data: lines, error: errLines } = await supabase
      .from("metro_lines")
      .select("*")
      .order("order_index", { ascending: true });

    if (errLines) throw errLines;

    // Get stations
    const { data: stations, error: errStations } = await supabase
      .from("metro_stations")
      .select("*");

    if (errStations) throw errStations;

    // Get line-station relationships
    const { data: lineStations, error: errLineStations } = await supabase
      .from("metro_line_stations")
      .select("*");

    if (errLineStations) throw errLineStations;

    // Map stations to each line
    const linesWithStations = lines.map((line) => ({
      ...line,
      stations: lineStations
        .filter((ls) => ls.line_id === line.id)
        .sort((a, b) => a.order_index - b.order_index)
        .map((ls) => stations.find((s) => s.id === ls.station_id)),
    }));

    return res.json(linesWithStations);
  } catch (err) {
    console.error("Error fetching lines with stations:", err);
    return res.status(500).json({ error: "Error fetching lines with stations" });
  }
};

// Check sequence function
export const checkSequence = async (req, res) => {
  const { id } = req.params;
  const { sequence, game_id, attempt } = req.body; 
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token requerido" });

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) return res.status(401).json({ error: "No autorizado" });
  const userId = authData.user.id;

  if (!Array.isArray(sequence) || sequence.length === 0) {
    return res.status(400).json({ error: "Invalid sequence format" });
  }

  try {
    // Take the task
    const { data: task, error: taskError } = await supabase
      .from("metro_tasks")
      .select("path")
      .eq("level_id", id)
      .single();

    if (taskError || !task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check sequence
    const isCorrect = JSON.stringify(sequence) === JSON.stringify(task.path);

    // Calculate score based on attempt
    let score = 0;
    if (isCorrect) {
      if (attempt === 1) score = 3;
      else if (attempt === 2) score = 2;
      else if (attempt === 3) score = 1;
    } else if (attempt >= 3) {
      score = 0;
    }

    // Set or update game session
    const { data: existing } = await supabase
      .from("game_sessions")
      .select("id, score")
      .eq("user_id", userId)
      .eq("game_id", game_id)
      .eq("level_id", id)
      .maybeSingle();

    if (existing) {
      const { error: updateError } = await supabase
        .from("game_sessions")
        .update({ score })
        .eq("id", existing.id);

      if (updateError) {
        console.error("Error updating session:", updateError.message);
        return res.status(500).json({ error: "Error updating game session" });
      }
    } else {
      const { error: insertError } = await supabase
        .from("game_sessions")
        .insert([
          { user_id: userId, game_id, level_id: id, score }
        ]);

      if (insertError) {
        console.error("Error inserting session:", insertError.message);
        return res.status(500).json({ error: "Error saving game session" });
      }
    }

    return res.json({ isCorrect, score, finished: isCorrect || attempt >= 3 });
  } catch (error) {
    console.error("Error checking sequence:", error);
    return res.status(500).json({ error: "Error checking sequence" });
  }
};
