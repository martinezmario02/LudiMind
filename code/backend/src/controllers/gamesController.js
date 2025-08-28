import { supabase } from "../supabaseClient.js";

// Used games function
export const usedGames = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ error: "Token requerido" });

  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError || !user) return res.status(401).json({ error: "Token inválido" });

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .in(
      "id",
      supabase
        .from("game_sessions")
        .select("game_id")
        .eq("user_id", user.id)
    );

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
};

// New games function
export const newGames = async (req, res) => {
  try {
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
    const playedIds = played.map(p => p.game_id);

    // Get unplayed games
    let query = supabase.from("games").select("*");
    if (playedIds.length > 0) {
      query = query.not("id", "in", playedIds);
    }

    const { data: unplayed, error } = await query;
    if (error) return res.status(400).json({ error: error.message });
    res.json(unplayed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
