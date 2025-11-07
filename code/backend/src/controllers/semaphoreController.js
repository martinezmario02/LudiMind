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

// Get info level function
export const getInfoLevel = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  try {
    const { data, error } = await supabase
      .from("semaphore_scenarios")
      .select(`*, game_levels!inner(level_number)`)
      .eq("level_id", id)
      .limit(1);

    if (error) throw error;
    if (!data || data.length === 0)
      return res.status(404).json({ error: "Nivel no encontrado" });

    const scenario = data[0];
    const level_number = scenario.game_levels?.level_number || null;
    const response = {
      ...scenario,
      level_number,
    };

    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
      "Surrogate-Control": "no-store",
    });

    return res.json(response);
  } catch (err) {
    console.error("Error fetching level info:", err);
    return res.status(500).json({ error: "Error fetching level info" });
  }
};

// Get feelings function
export const getFeelings = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  try {
    // Get scenario
    const { data: scenarios, error: scenarioError } = await supabase
      .from("semaphore_scenarios")
      .select("*")
      .eq("level_id", id)
      .limit(1);

    if (scenarioError) throw scenarioError;
    if (!scenarios || scenarios.length === 0) return res.status(404).json({ error: "Nivel no encontrado" });
    const scenario = scenarios[0];

    // Get feelings for the scenario
    const { data: feelings, error: feelingsError } = await supabase
      .from("semaphore_feelings")
      .select("*")
      .eq("scenario_id", scenario.id);

    if (feelingsError) throw feelingsError;
    const response = { ...scenario, feelings };
    return res.json(response);
  } catch (err) {
    console.error("Error fetching level info:", err);
    return res.status(500).json({ error: "Error fetching level info" });
  }
};

// Check feeling function
export const checkFeeling = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  const { level_id, scenario_id, chosen_feeling_id } = req.body;

  try {
    // Check if the chosen feeling is correct
    const { data: feelingData, error: feelingError } = await supabase
      .from("semaphore_feelings")
      .select("is_correct")
      .eq("id", chosen_feeling_id)
      .single();

    if (feelingError) throw feelingError;
    const is_correct = feelingData?.is_correct || false;

    // Save the attempt
    const { data: existing, error: existingError } = await supabase
      .from("semaphore_attempts")
      .select("id")
      .eq("user_id", studentId)
      .eq("scenario_id", scenario_id)
      .maybeSingle();
    if (existingError) throw existingError;

    if (existing) {
      const { error: updateError } = await supabase
        .from("semaphore_attempts")
        .update({ chosen_feeling_id, is_feeling_correct: is_correct })
        .eq("id", existing.id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("semaphore_attempts")
        .insert([
          {
            user_id: studentId,
            scenario_id,
            chosen_feeling_id,
            is_feeling_correct: is_correct,
          },
        ]);

      if (insertError) throw insertError;
    }

    // Return result
    return res.json({ is_correct });
  } catch (err) {
    console.error("Error checking feeling:", err);
    return res.status(500).json({ error: "Error comprobando sentimiento" });
  }
};

// Get feeling result function
export const getFeelingResult = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  try {
    // Get scenario
    const { data: scenarios, error: scenarioError } = await supabase
      .from("semaphore_scenarios")
      .select(`*, game_levels!inner(level_number)`)
      .eq("level_id", id)
      .limit(1);

    if (scenarioError) throw scenarioError;
    if (!scenarios || scenarios.length === 0) return res.status(404).json({ error: "Nivel no encontrado" });
    const scenario = scenarios[0];
    const level_number = scenario.game_levels?.level_number || null;

    // Get attempt info
    const { data: attempts, error } = await supabase
      .from("semaphore_attempts")
      .select("chosen_feeling_id")
      .eq("scenario_id", scenario.id)
      .eq("user_id", studentId)
      .limit(1);

    if (error) throw error;
    if (!attempts || attempts.length === 0) return res.status(404).json({ error: "Intento no encontrado" });
    
    // Get feeling text
    const { data: feelings, error: feelingsError } = await supabase
      .from("semaphore_feelings")
      .select("support_phrase")
      .eq("id", attempts[0].chosen_feeling_id)
      .single();

    if (feelingsError) throw feelingsError;
    const response = {
      ...feelings,
      level_number,
    };
    return res.json(response);
  } catch (err) {
    console.error("Error fetching level info:", err);
    return res.status(500).json({ error: "Error fetching level info" });
  }
};

// Get actions function
export const getActions = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  try {
    // Get scenario
    const { data: scenarios, error: scenarioError } = await supabase
      .from("semaphore_scenarios")
      .select("*")
      .eq("level_id", id)
      .limit(1);

    if (scenarioError) throw scenarioError;
    if (!scenarios || scenarios.length === 0) return res.status(404).json({ error: "Nivel no encontrado" });
    const scenario = scenarios[0];

    // Get actions for the scenario
    const { data: actions, error: actionsError } = await supabase
      .from("semaphore_actions")
      .select("*")
      .eq("scenario_id", scenario.id);

    if (actionsError) throw actionsError;
    const response = { ...scenario, actions };
    return res.json(response);
  } catch (err) {
    console.error("Error fetching level info:", err);
    return res.status(500).json({ error: "Error fetching level info" });
  }
};

// Check action function
export const checkAction = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  const { level_id, scenario_id, chosen_action_id } = req.body;

  try {
    // Check if the chosen action is correct
    const { data: actionData, error: actionError } = await supabase
      .from("semaphore_actions")
      .select("is_correct")
      .eq("id", chosen_action_id)
      .single();

    if (actionError) throw actionError;
    const is_correct = actionData?.is_correct || false;

    // Save the attempt
    const { data: existing, error: existingError } = await supabase
      .from("semaphore_attempts")
      .select("id")
      .eq("user_id", studentId)
      .eq("scenario_id", scenario_id)
      .maybeSingle();
    if (existingError) throw existingError;

    if (existing) {
      const { error: updateError } = await supabase
        .from("semaphore_attempts")
        .update({ chosen_action_id, is_action_correct: is_correct })
        .eq("id", existing.id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("semaphore_attempts")
        .insert([
          {
            user_id: studentId,
            scenario_id,
            chosen_action_id,
            is_action_correct: is_correct,
          },
        ]);

      if (insertError) throw insertError;
    }

    // Return result
    return res.json({ is_correct });
  } catch (err) {
    console.error("Error checking feeling:", err);
    return res.status(500).json({ error: "Error comprobando sentimiento" });
  }
};

// Get action result function
export const getActionResult = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  try {
    // Get scenario
    const { data: scenarios, error: scenarioError } = await supabase
      .from("semaphore_scenarios")
      .select(`*, game_levels!inner(level_number)`)
      .eq("level_id", id)
      .limit(1);

    if (scenarioError) throw scenarioError;
    if (!scenarios || scenarios.length === 0) return res.status(404).json({ error: "Nivel no encontrado" });
    const scenario = scenarios[0];
    const level_number = scenario.game_levels?.level_number || null;

    // Get attempt info
    const { data: attempts, error } = await supabase
      .from("semaphore_attempts")
      .select("chosen_action_id")
      .eq("scenario_id", scenario.id)
      .eq("user_id", studentId)
      .limit(1);

    if (error) throw error;
    if (!attempts || attempts.length === 0) return res.status(404).json({ error: "Intento no encontrado" });
    
    // Get action text
    const { data: actions, error: actionsError } = await supabase
      .from("semaphore_actions")
      .select("support_phrase")
      .eq("id", attempts[0].chosen_action_id)
      .single();

    if (actionsError) throw actionsError;
    const response = {
      ...actions,
      level_number,
    };
    return res.json(response);
  } catch (err) {
    console.error("Error fetching level info:", err);
    return res.status(500).json({ error: "Error fetching level info" });
  }
};

export const saveScore = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization?.replace("Bearer ", "");
  const studentId = await getStudentIdFromToken(token);
  if (!studentId) return res.status(401).json({ error: "No autorizado" });

  try {
    // Get scenario
    const { data: scenarios, error: scenarioError } = await supabase
      .from("semaphore_scenarios")
      .select(`*, game_levels!inner(level_number)`)
      .eq("level_id", id)
      .limit(1);

    if (scenarioError) throw scenarioError;
    if (!scenarios || scenarios.length === 0) return res.status(404).json({ error: "Nivel no encontrado" });
    const scenario = scenarios[0];
    const level_number = scenario.game_levels?.level_number || null;

    // Get attempt info
    const { data: attempts, error } = await supabase
      .from("semaphore_attempts")
      .select("*")
      .eq("scenario_id", scenario.id)
      .eq("user_id", studentId)
      .limit(1);

    if (error) throw error;
    if (!attempts || attempts.length === 0) return res.status(404).json({ error: "Intento no encontrado" });

    // Calculate total score
    let totalScore = 0;
    const attempt = attempts[0];
    if (attempt.is_feeling_correct) totalScore += 1;
    if (attempt.is_action_correct) totalScore += 2;

    // Save score in game_sessions
    const { data: existing, error: existingError } = await supabase
      .from("game_sessions")
      .select("id")
      .eq("user_id", studentId)
      .eq("level_id", id)
      .maybeSingle();
    if (existingError) throw existingError;

    if (existing) {
      const { error: updateError } = await supabase
        .from("game_sessions")
        .update({ score: totalScore })
        .eq("id", existing.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("game_sessions")
        .insert([
          {
            user_id: studentId,
            level_id: id,
            game_id: "dc6ae750-52b3-454a-9ef3-a64d9c8379d6",
            score: totalScore,
          },
        ]);
      if (insertError) throw insertError;
    }
    const response = { totalScore, level_number };
    return res.json(response);
  } catch (err) {
    console.error("Error saving score:", err);
    return res.status(500).json({ error: "Error saving score" });
  }
};