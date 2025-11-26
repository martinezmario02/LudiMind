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

// All games function
export const allGames = async (req, res) => {
  const { data, error } = await supabase.from("games").select("*");
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
};

// Used games function
export const usedGames = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token requerido" });

  const studentId = getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  const { data: played, error: errorPlayed } = await supabase
    .from("game_sessions")
    .select("game_id")
    .eq("user_id", studentId);

  if (errorPlayed) return res.status(400).json({ error: errorPlayed.message });

  const playedIds = played.map(p => p.game_id).filter(Boolean);
  if (playedIds.length === 0) return res.json([]);

  const { data, error } = await supabase.from("games").select("*").in("id", playedIds);
  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
};

// New games function
export const newGames = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token requerido" });

  const studentId = getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  const { data: played, error: errorPlayed } = await supabase
    .from("game_sessions")
    .select("game_id")
    .eq("user_id", studentId);

  if (errorPlayed) return res.status(400).json({ error: errorPlayed.message });

  const playedIds = played.map(p => p.game_id).filter(Boolean);

  let query = supabase.from("games").select("*");
  if (playedIds.length > 0) query = query.not("id", "in", `(${playedIds.join(",")})`);

  const { data: unplayed, error } = await query;
  if (error) return res.status(400).json({ error: error.message });
  return res.json(unplayed);
};

// Game information function
export const infoGame = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from("games").select("*").eq("id", id).single();

  if (error) return res.status(400).json({ error: error.message });
  return res.json(data);
};

// Completed levels function
export const completedLevels = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token requerido" });

  const studentId = getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  const { count, error } = await supabase
    .from("game_sessions")
    .select("*", { count: "exact", head: true })
    .eq("game_id", id)
    .eq("user_id", studentId)
    .eq("score", 3);

  if (error) return res.status(400).json({ error: error.message });
  return res.json({ completedLevels: count });
};

// Total score function
export const totalScore = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token requerido" });

  const studentId = getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  const { data, error } = await supabase
    .from("game_sessions")
    .select("score")
    .eq("game_id", id)
    .eq("user_id", studentId);

  if (error) return res.status(400).json({ error: error.message });

  const totalScore = data.reduce((acc, session) => acc + (session.score || 0), 0);
  return res.json({ totalScore });
};

// Game levels function
export const getLevels = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token requerido" });

  const studentId = getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  const { data: levels, error: errorLevels } = await supabase
    .from("game_levels")
    .select("*")
    .eq("game_id", id)
    .order("level_number", { ascending: true });

  if (errorLevels) return res.status(400).json({ error: errorLevels.message });

  const { data: sessions, error: errorSessions } = await supabase
    .from("game_sessions")
    .select("level_id, score")
    .eq("user_id", studentId)
    .eq("game_id", id);

  if (errorSessions) return res.status(400).json({ error: errorSessions.message });

  const levelsWithProgress = levels.map(level => {
    const session = sessions.find(s => s.level_id === level.id);
    return { ...level, score: session ? session.score : 0 };
  });

  return res.json(levelsWithProgress);
};

// Get result level function
export const resultLevel = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token requerido" });

  const studentId = getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  try {
    const { data, error } = await supabase
      .from("game_sessions")
      .select("score, help_used, game_levels!inner(level_number)")
      .eq("level_id", id)
      .eq("user_id", studentId)
      .maybeSingle();

    if (error) throw error;

    if (data && data.help_used) {
      data.score = Math.max(data.score - 1, 0);
    }
    
    await supabase
      .from("game_sessions")
      .update({ score: data.score, help_used: false })
      .eq("level_id", id)
      .eq("user_id", studentId);
    
    return res.json(data);
  } catch (err) {
    console.error("Error fetching info:", err);
    return res.status(500).json({ error: "Error fetching info" });
  }
};

// Set help used function
export const helpUsed = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "Token requerido" });

  const studentId = getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  try {
    const { data, error } = await supabase
      .from("game_sessions")
      .update({ help_used: true })
      .eq("level_id", id)
      .eq("user_id", studentId);

    if (error) throw error;
    return res.json({ message: "Help usage recorded" });
  } catch (err) {
    console.error("Error updating help usage:", err);
    return res.status(500).json({ error: "Error updating help usage" });
  }
};