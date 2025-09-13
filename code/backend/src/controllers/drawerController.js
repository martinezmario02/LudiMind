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
  const { drawerId, objectId, levelId } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!drawerId || !objectId || !levelId) {
    return res.status(400).json({ error: "drawerId, objectId y levelId son requeridos" });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData.user) return res.status(401).json({ error: "No autorizado" });
    const userId = authData.user.id;

    const { data, error } = await supabase
      .from("magic_drawer_contents")
      .insert([{ drawer_id: drawerId, object_id: objectId, level_id: levelId, user_id: userId }])
      .select();

    if (error) throw error;

    return res.json(data[0]);
  } catch (err) {
    console.error("Error adding object to drawer:", err);
    return res.status(500).json({ error: "Error adding object to drawer" });
  }
};

// Get drawer contents function
export const getDrawerContents = async (req, res) => {
  const { id } = req.params;

  try {
    // Get objects
    const { data: contents, error: contentsError } = await supabase
      .from("magic_drawer_contents")
      .select("object_id")
      .eq("drawer_id", id);

    if (contentsError) throw contentsError;
    if (!contents || contents.length === 0) {
      return res.json([]);
    }

    const objectIds = contents.map((c) => c.object_id);

    // Get objects info
    const { data: objects, error: objectsError } = await supabase
      .from("magic_objects")
      .select("id, name, image_url")
      .in("id", objectIds);

    if (objectsError) throw objectsError;

    return res.json(objects);
  } catch (err) {
    console.error("Error fetching drawer contents:", err);
    return res.status(500).json({ error: "Error fetching drawer contents" });
  }
};

// Remove object from drawer function
export const removeObjectFromDrawer = async (req, res) => {
  const { drawerId, objectId } = req.body;

  try {
    const { error } = await supabase
      .from("magic_drawer_contents")
      .delete()
      .eq("drawer_id", drawerId)
      .eq("object_id", objectId);

    if (error) throw error;

    return res.json({ success: true });
  } catch (err) {
    console.error("Error removing object from drawer:", err);
    return res.status(500).json({ error: "Error removing object from drawer" });
  }
};

export const getUnassignedObjects = async (req, res) => {
  const levelId = req.params.id;
  const token = req.headers.authorization?.replace("Bearer ", "");

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData.user) return res.status(401).json({ error: "No autorizado" });
    const userId = authData.user.id;
    if (!userId) return res.status(400).json({ error: "userId no encontrado" });

    const { data: assigned, error: assignedError } = await supabase
      .from("magic_drawer_contents")
      .select("object_id")
      .eq("user_id", userId)
      .eq("level_id", levelId);
    if (assignedError) throw assignedError;

    const assignedIds = assigned.map(a => a.object_id);

    const { data: allObjects, error: allError } = await supabase
      .from("magic_objects")
      .select("*");
    if (allError) throw allError;

    const unassignedObjects = allObjects.filter(obj => !assignedIds.includes(obj.id));
    return res.json(unassignedObjects);

  } catch (err) {
    console.error("Error fetching unassigned objects:", err);
    return res.status(500).json({ error: "Error fetching unassigned objects" });
  }
};
