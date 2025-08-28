import { supabase } from "../supabaseClient.js";

// Used games function
export const usedGames = async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("games")
    .select("*")
    .in(
      "id",
      supabase
        .from("game_sessions")
        .select("game_id")
        .eq("user_id", userId)
    );

  if (error) return res.status(400).json({ error: error.message });

  res.json(data);
};

// New games function
export const newGames = async (req, res) => {
  const { userId } = req.params;

  // Get played games
  const { data: played, error: errorPlayed } = await supabase
    .from("game_sessions")
    .select("game_id")
    .eq("user_id", userId);

  if (errorPlayed) return res.status(400).json({ error: errorPlayed.message });

  const playedIds = played.map((p) => p.game_id);

  // Get unplayed games
  let query = supabase.from("games").select("*");
  if (playedIds.length > 0) {
    query = query.not("id", "in", `(${playedIds.join(",")})`);
  }

  const { data: unplayed, error } = await query;
  if (error) return res.status(400).json({ error: error.message });

  res.json(unplayed);
};