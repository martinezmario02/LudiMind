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
      .select("id, name, emoji")
      .eq("id", id)
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error("Error fetching station:", error);
    return res.status(500).json({ error: "Error fetching station" });
  }
};
