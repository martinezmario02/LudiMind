import { supabase } from "../supabaseClient.js";
import jwt from "jsonwebtoken";

// Get student ID from token function
const getStudentIdFromToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.studentId || null;
  } catch (err) {
    return null;
  }
};

// Get level info function
export const getInfoLevel = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  try {
    const { data, error } = await supabase
      .from("magic_drawer_solutions")
      .select("*")
      .eq("level_id", id);
    if (error) throw error;

    return res.json(data);
  } catch (err) {
    console.error("Error fetching tasks info:", err);
    return res.status(500).json({ error: "Error fetching tasks info" });
  }
};

// Get drawers info function
export const getDrawersInfo = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  try {
    const { data: drawers, error: drawersError } = await supabase
      .from("magic_drawers")
      .select("*")
      .eq("level_id", id);
    if (drawersError) throw drawersError;
    if (!drawers || drawers.length === 0) return res.status(404).json({ error: "No drawers found" });

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
  } catch (err) {
    console.error("Error fetching drawers info:", err);
    return res.status(500).json({ error: "Error fetching drawers info" });
  }
};

// Get only a drawer info function
export const getDrawerInfo = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  try {
    const { data, error } = await supabase
      .from("magic_drawers")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    if (!data) return res.status(404).json({ error: "Drawer not found" });

    return res.json(data);
  } catch (err) {
    console.error("Error fetching drawer info:", err);
    return res.status(500).json({ error: "Error fetching drawer info" });
  }
};

// Get objects info function
export const getObjectsInfo = async (req, res) => {
  const { ids } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

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
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  if (!drawerId || !objectId || !levelId) {
    return res.status(400).json({ error: "drawerId, objectId y levelId son requeridos" });
  }

  try {
    const { data, error } = await supabase
      .from("magic_drawer_contents")
      .insert([{ drawer_id: drawerId, object_id: objectId, level_id: levelId, user_id: studentId }])
      .select();
    if (error) throw error;

    return res.json(data[0]);
  } catch (err) {
    console.error("Error adding object to drawer:", err);
    return res.status(500).json({ error: "Error adding object to drawer" });
  }
};

// Get only a drawer content function
export const getDrawerContents = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  try {
    const { data: contents, error: contentsError } = await supabase
      .from("magic_drawer_contents")
      .select("object_id")
      .eq("drawer_id", id);
    if (contentsError) throw contentsError;
    if (!contents || contents.length === 0) return res.json([]);

    const objectIds = contents.map(c => c.object_id);
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
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  try {
    const { error } = await supabase
      .from("magic_drawer_contents")
      .delete()
      .eq("drawer_id", drawerId)
      .eq("object_id", objectId)
      .eq("user_id", studentId);
    if (error) throw error;

    return res.json({ success: true });
  } catch (err) {
    console.error("Error removing object from drawer:", err);
    return res.status(500).json({ error: "Error removing object from drawer" });
  }
};

// Get unassigned objects function
export const getUnassignedObjects = async (req, res) => {
  const levelId = req.params.id;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  try {
    const { data: assigned, error: assignedError } = await supabase
      .from("magic_drawer_contents")
      .select("object_id")
      .eq("user_id", studentId)
      .eq("level_id", levelId);
    if (assignedError) throw assignedError;

    const assignedIds = assigned.map(a => a.object_id);
    const { data: allObjects, error: allError } = await supabase.from("magic_objects").select("*");
    if (allError) throw allError;

    const unassignedObjects = allObjects.filter(obj => !assignedIds.includes(obj.id));
    return res.json(unassignedObjects);
  } catch (err) {
    console.error("Error fetching unassigned objects:", err);
    return res.status(500).json({ error: "Error fetching unassigned objects" });
  }
};

// Solve drawer level function
export const solveDrawerLevel = async (req, res) => {
  const { levelId } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });
  if (!levelId) return res.status(400).json({ error: "levelId requerido" });

  try {
    const { data: userContents, error: userError } = await supabase
      .from("magic_drawer_contents")
      .select("drawer_id, object_id")
      .eq("user_id", studentId)
      .eq("level_id", levelId);
    if (userError) throw userError;

    const { data: solutions, error: solutionError } = await supabase
      .from("magic_drawer_solutions")
      .select("drawer_id, object_ids, category")
      .eq("level_id", levelId);
    if (solutionError) throw solutionError;

    let totalFailures = 0;
    solutions.forEach(solution => {
      const userObjects = userContents.filter(uc => uc.drawer_id === solution.drawer_id).map(uc => uc.object_id);
      const incorrect = userObjects.filter(id => !solution.object_ids.includes(id)).length;
      const missing = solution.object_ids.filter(id => !userObjects.includes(id)).length;
      totalFailures += incorrect + missing;
    });

    let score = totalFailures === 0 ? 3 : totalFailures <= 3 ? 2 : totalFailures <= 5 ? 1 : 0;

    const { data: existing } = await supabase
      .from("game_sessions")
      .select("id, score")
      .eq("user_id", studentId)
      .eq("game_id", "db0bdeed-cad8-41e7-8bc1-79edc7b3ca0b")
      .eq("level_id", levelId)
      .maybeSingle();

    if (existing) {
      const { error: updateError } = await supabase
        .from("game_sessions")
        .update({ score })
        .eq("id", existing.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("game_sessions")
        .insert([{ user_id: studentId, game_id: "db0bdeed-cad8-41e7-8bc1-79edc7b3ca0b", level_id: levelId, score }]);
      if (insertError) throw insertError;
    }

    return res.json({ score, totalFailures, message: "Nivel resuelto" });
  } catch (err) {
    console.error("Error resolviendo el nivel:", err);
    return res.status(500).json({ error: "Error resolviendo el nivel" });
  }
};

// Reset level function
export const resetLevel = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });
  if (!id) return res.status(400).json({ error: "levelId requerido" });

  try {
    const { error: deleteError } = await supabase
      .from("magic_drawer_contents")
      .delete()
      .eq("user_id", studentId)
      .eq("level_id", id);
    if (deleteError) throw deleteError;

    return res.json({ success: true });
  } catch (err) {
    console.error("Error resetting level:", err);
    return res.status(500).json({ error: "Error resetting level" });
  }
};