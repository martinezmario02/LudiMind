import { supabase } from "../supabaseClient.js";

// All games function
export const allGames = async (req, res) => {
    const { data, error } = await supabase
      .from("games")
      .select("*");

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
};

// Used games function
export const usedGames = async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Token requerido" });
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData.user) return res.status(401).json({ error: "No autorizado" });
    const userId = authData.user.id;

    const { data: played, error: errorPlayed } = await supabase
      .from("game_sessions")
      .select("game_id")
      .eq("user_id", userId);

    if (errorPlayed) return res.status(400).json({ error: errorPlayed.message });

    // Filter null values
    const playedIds = played
      .map(p => p.game_id)
      .filter(id => id !== null && id !== undefined);
    
    if (playedIds.length === 0) return res.json([]);

    const { data, error } = await supabase
      .from("games")
      .select("*")
      .in("id", playedIds);

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
};

// New games function
export const newGames = async (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ error: "Token requerido" });
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData.user) return res.status(401).json({ error: "No autorizado" });
    const userId = authData.user.id;

    // Get played games
    const { data: played, error: errorPlayed } = await supabase
        .from("game_sessions")
        .select("game_id")
        .eq("user_id", userId);

    if (errorPlayed) return res.status(400).json({ error: errorPlayed.message });
    
    // Filter null values
    const playedIds = played
      .map(p => p.game_id)
      .filter(id => id !== null && id !== undefined);

    // Get unplayed games
    let query = supabase.from("games").select("*");
    if (playedIds.length > 0) {
        query = query.not("id", "in", `(${playedIds.join(",")})`);
    }

    const { data: unplayed, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    return res.json(unplayed);
};

// Game information function
export const infoGame = async (req, res) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("id", id)
        .single();

    if (error) return res.status(400).json({ error: error.message });
    return res.json(data);
};

// Completed levels function
export const completedLevels = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Token requerido" });

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) return res.status(401).json({ error: "No autorizado" });

  const userId = authData.user.id;

  const { count, error } = await supabase
    .from("game_sessions")
    .select("*", { count: "exact", head: true })
    .eq("game_id", id)
    .eq("user_id", userId)
    .eq("score", 3);

  if (error) return res.status(400).json({ error: error.message });

  return res.json({ completedLevels: count });
};

// Total score function
export const totalScore = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Token requerido" });

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) return res.status(401).json({ error: "No autorizado" });

  const userId = authData.user.id;

  const { data, error } = await supabase
    .from("game_sessions")
    .select("score")
    .eq("game_id", id)
    .eq("user_id", userId);

  if (error) return res.status(400).json({ error: error.message });

  const totalScore = data.reduce((acc, session) => acc + (session.score || 0), 0);

  return res.json({ totalScore });
};

// Game levels function
export const getLevels = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Token requerido" });

  const { data: authData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !authData.user) return res.status(401).json({ error: "No autorizado" });

  const userId = authData.user.id;

  // Get levels (ordenados por número de nivel)
  const { data: levels, error: errorLevels } = await supabase
    .from("game_levels")
    .select("*")
    .eq("game_id", id)
    .order("level_number", { ascending: true });

  if (errorLevels) {
    console.error("Error al obtener niveles:", errorLevels.message);
    return res.status(400).json({ error: errorLevels.message });
  }

  // Get user progress
  const { data: sessions, error: errorSessions } = await supabase
    .from("game_sessions")
    .select("level_id, score")
    .eq("user_id", userId)
    .eq("game_id", id);

  if (errorSessions) {
    console.error("Error al obtener progreso:", errorSessions.message);
    return res.status(400).json({ error: errorSessions.message });
  }

  // Map levels with score
  const levelsWithProgress = levels.map(level => {
    const session = sessions.find(s => s.level_id === level.id);
    return {
      ...level,
      score: session ? session.score : 0
    };
  });

  return res.json(levelsWithProgress);
};

// Get result level function
export const resultLevel = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Token requerido" });
  if (!id) return res.status(400).json({ error: "levelId requerido" });

  try {
    // Get user
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData.user) return res.status(401).json({ error: "No autorizado" });
    const userId = authData.user.id;

    const { data, error } = await supabase
      .from("game_sessions")
      .select("score")
      .eq("level_id", id)
      .eq("user_id", userId)
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (err) {
    console.error("Error fetching info:", err);
    return res.status(500).json({ error: "Error fetching info" });
  }
};