import { supabase } from "../supabaseClient.js";
import jwt from "jsonwebtoken";

// Get student ID from token function
const getStudentIdFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.studentId || null;
  } catch (err) {
    return null;
  }
};

// Get map based on level function
const getMapIdByLevel = (level) => {
  if (level <= 3) return 1;
  if (level === 4 || level === 5) return 2;
  return null;
};

// Get tasks info function
export const getTasksInfo = async (req, res) => {
  const levelId = req.params.id; 

  try {
    // Get level number
    const { data: levelData, error: levelErr } = await supabase
      .from("game_levels")
      .select("level_number, game_id")
      .eq("id", levelId)
      .single();

    if (levelErr || !levelData)
      return res.status(404).json({ error: "Nivel no encontrado" });

    // Get map associated with that level
    const { data: mapData, error: mapErr } = await supabase
      .from("metro_maps")
      .select("*")
      .eq("number", levelData.level_number <= 3 ? 1 : levelData.level_number === 4 ? 2 : 3)
      .single();

    if (mapErr || !mapData)
      return res.status(404).json({ error: "Mapa no encontrado" });

    // Get task for that level
    const { data: task, error: taskErr } = await supabase
      .from("metro_tasks")
      .select("*")
      .eq("level_id", levelId)
      .single();

    if (taskErr || !task)
      return res.status(404).json({ error: "Tarea no encontrada" });

    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "Surrogate-Control": "no-store",
    });

    return res.json({
      ...task,
      level_number: levelData.level_number,
    });
  } catch (error) {
    console.error("Error fetching tasks info:", error);
    return res.status(500).json({ error: "Error fetching tasks info" });
  }
};

// Get station by ID function
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
export const getAllStations = async (_req, res) => {
  try {
    const { data, error } = await supabase.from("metro_stations").select("*");
    if (error) throw error;
    return res.json(data);
  } catch (error) {
    console.error("Error fetching stations:", error);
    return res.status(500).json({ error: "Error fetching stations" });
  }
};

// Get lines with stations function
export const getLinesWithStations = async (req, res) => {
  const levelId = req.query.levelId;

  try {
    // Get level number
    const { data: levelData, error: levelErr } = await supabase
      .from("game_levels")
      .select("level_number")
      .eq("id", levelId)
      .single();

    if (levelErr || !levelData)
      return res.status(404).json({ error: "Nivel no encontrado" });

    // Get map based on level number
    const { data: mapData, error: mapErr } = await supabase
      .from("metro_maps")
      .select("*")
      .eq("number", levelData.level_number <= 3 ? 1 : levelData.level_number === 4 ? 2 : 3)
      .single();

    if (mapErr || !mapData)
      return res.status(404).json({ error: "Mapa no encontrado" });

    // Get lines and their stations
    const { data: lines, error: errLines } = await supabase
      .from("metro_lines")
      .select("*")
      .eq("map_id", mapData.id)
      .order("order_index", { ascending: true });

    if (errLines) throw errLines;

    const { data: stations, error: errStations } = await supabase
      .from("metro_stations")
      .select("*");
    if (errStations) throw errStations;

    const { data: lineStations, error: errLineStations } = await supabase
      .from("metro_line_stations")
      .select("*");
    if (errLineStations) throw errLineStations;

    const linesWithStations = lines.map((line) => ({
      ...line,
      stations: lineStations
        .filter(ls => ls.line_id === line.id)
        .sort((a, b) => a.order_index - b.order_index)
        .map(ls => stations.find(s => s.id === ls.station_id))
        .filter(Boolean)
    }));

    return res.json(linesWithStations);
  } catch (err) {
    console.error("Error fetching lines with stations:", err);
    return res
      .status(500)
      .json({ error: "Error fetching lines with stations" });
  }
};

// Check sequence function
export const checkSequence = async (req, res) => {
  const levelId = req.params.id; 
  const { sequence, game_id, attempt } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Token requerido" });

  const studentId = getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  if (!Array.isArray(sequence) || sequence.length === 0) {
    return res.status(400).json({ error: "Formato de secuencia inválido" });
  }

  try {
    // Get level number
    const { data: levelData, error: levelErr } = await supabase
      .from("game_levels")
      .select("level_number")
      .eq("id", levelId)
      .single();

    if (levelErr || !levelData)
      return res.status(404).json({ error: "Nivel no encontrado" });

    // Get task for that level
    const { data: task, error: taskError } = await supabase
      .from("metro_tasks")
      .select("path")
      .eq("level_id", levelId)
      .single();

    if (taskError || !task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    // Check if the sequence is correct
    const normalizedSequence = sequence.map(Number);
    const normalizedPath = task.path.map(Number);
    const isCorrect =
      JSON.stringify(normalizedSequence) === JSON.stringify(normalizedPath);

    let score = 0;
    if (isCorrect) {
      if (attempt === 1) score = 3;
      else if (attempt === 2) score = 2;
      else if (attempt === 3) score = 1;
    } else if (attempt >= 3) score = 0;

    // Store or update game session
    const { data: existing } = await supabase
      .from("game_sessions")
      .select("id, score")
      .eq("user_id", studentId)
      .eq("game_id", game_id)
      .eq("level_id", levelId)
      .maybeSingle();

    if (existing) {
      const { error: updateError } = await supabase
        .from("game_sessions")
        .update({ score })
        .eq("id", existing.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("game_sessions")
        .insert([{ user_id: studentId, game_id, level_id: levelId, score }]);
      if (insertError) throw insertError;
    }

    return res.json({ isCorrect, score, finished: isCorrect || attempt >= 3 });
  } catch (error) {
    console.error("Error checking sequence:", error);
    return res.status(500).json({ error: "Error comprobando secuencia" });
  }
};