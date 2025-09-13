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

// Get objects info function
export const getObjectsInfo = async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "Array of object IDs is required" });
  }

  try {
    const { data, error } = await supabase
      .from("magic_objects")
      .select("id, name, type, size, utility, image_url")
      .in("id", ids);

    if (error) throw error;

    return res.json(data);
  } catch (err) {
    console.error("Error fetching objects info:", err);
    return res.status(500).json({ error: "Error fetching objects info" });
  }
};

// Add object to drawer function
export const addObjectToDrawer = async (req, res) => {
  const { drawerId, objectId } = req.body;

  if (!drawerId || !objectId) {
    return res.status(400).json({ error: "drawerId and objectId are required" });
  }

  try {
    const { data, error } = await supabase
      .from("magic_drawer_contents")
      .insert([{ drawer_id: drawerId, object_id: objectId }])
      .select();

    if (error) throw error;

    return res.json(data[0]);
  } catch (err) {
    console.error("Error adding object to drawer:", err);
    return res.status(500).json({ error: "Error adding object to drawer" });
  }
};

// Gtet drawer contents function
export const getDrawerContents = async (req, res) => {
  const { drawerId } = req.params;

  try {
    const { data, error } = await supabase
      .from("magic_drawer_contents")
      .select(`
        id,
        object: magic_objects (id, name, image_url, type, size, utility)
      `)
      .eq("drawer_id", drawerId);

    if (error) throw error;

    return res.json(data);
  } catch (err) {
    console.error("Error fetching drawer contents:", err);
    return res.status(500).json({ error: "Error fetching drawer contents" });
  }
};