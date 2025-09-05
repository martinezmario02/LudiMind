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

// Get lines with stations (including transfers)
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
  const { sequence } = req.body;

  if (!Array.isArray(sequence) || sequence.length === 0) {
    return res.status(400).json({ error: "Invalid sequence format" });
  }

  try {
    const { data: task, error: taskError } = await supabase
      .from("metro_tasks")
      .select("path")
      .eq("level_id", id)
      .single();

    if (taskError || !task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const isCorrect = JSON.stringify(sequence) === JSON.stringify(task.path);
    return res.json({
      message: isCorrect
        ? "¡Secuencia correcta! Bien hecho."
        : "Secuencia incorrecta. Inténtalo de nuevo."
    });
  } catch (error) {
    console.error("Error checking sequence:", error);
    return res.status(500).json({ error: "Error checking sequence" });
  }
};
