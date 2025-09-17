import { supabase } from "../supabaseClient.js";

// Get info level function
export const getInfoLevel = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("emotion_scenarios")
      .select("*")
      .eq("level_id", id)
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error("Error fetching level info:", error);
    return res.status(500).json({ error: "Error fetching level info" });
  }
};