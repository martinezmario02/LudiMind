import { supabase } from "../supabaseClient.js";

// Get info level function
export const getInfoLevel = async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("magic_drawer_solutions")
      .select("*")
      .eq("level_id", id);

    if (error) throw error;

    return res.json(data);
  } catch (error) {
    console.error("Error fetching tasks info:", error);
    return res.status(500).json({ error: "Error fetching tasks info" });
  }
};

// Get drawers info function
export const getDrawersInfo = async (req, res) => {
  const { id } = req.params; // level_id

  try {
    // Take drawers ids
    const { data: drawers, error: drawersError } = await supabase
      .from("magic_drawers")
      .select("*")
      .eq("level_id", id);

    if (drawersError) throw drawersError;

    if (!drawers || drawers.length === 0) {
      return res.status(404).json({ error: "No drawers found for this level" });
    }

    // Take drawers info
    const drawerIds = drawers.map(d => d.id);

    const { data: solutions, error: solutionsError } = await supabase
      .from("magic_drawer_solutions")
      .select("id, drawer_id, object_ids, category")
      .in("drawer_id", drawerIds);

    if (solutionsError) throw solutionsError;

    const result = drawers.map(drawer => ({
      ...drawer,
      solutions: solutions.filter(s => s.drawer_id === drawer.id)
    }));

    return res.json(result);
  } catch (error) {
    console.error("Error fetching drawers info:", error);
    return res.status(500).json({ error: "Error fetching drawers info" });
  }
};