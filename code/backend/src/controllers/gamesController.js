import { supabase } from "../supabaseClient.js";

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