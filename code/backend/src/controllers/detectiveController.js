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

// Check user emotion selection
export const checkEmotionSolution = async (req, res) => {
  const { id } = req.params;
  const { selectedEmotion, intensity, attempt } = req.body;

  try {
    // Get token and student ID
    const token = req.headers.authorization?.replace("Bearer ", "");
    const studentId = await getStudentIdFromToken(token);
    if (!studentId) return res.status(401).json({ error: "No autorizado" });

    // Get the scenario for the level
    const { data: scenario, error: scenarioError } = await supabase
      .from("emotion_scenarios")
      .select("id")
      .eq("level_id", id)
      .single();

    if (scenarioError || !scenario)
      return res.status(404).json({ error: "Scenario not found" });

    // Get the solution for the scenario
    const { data: solution, error: solutionError } = await supabase
      .from("emotion_solutions")
      .select("joy, sadness, anger, fear, disgust")
      .eq("scenario_id", scenario.id)
      .single();

    if (solutionError || !solution)
      return res.status(404).json({ error: "Solution not found" });

    // Get correct emotion and intensity
    const correctEmotion = Object.keys(solution).reduce((a, b) =>
      solution[a] > solution[b] ? a : b
    );

    const correctIntensity = solution[correctEmotion];
    const isCorrectEmotion = selectedEmotion === correctEmotion;
    const isCorrectIntensity = parseInt(intensity) === parseInt(correctIntensity);
    const isCorrect = isCorrectEmotion && isCorrectIntensity;
    const emotionAttemptValue = isCorrect ? attempt : null;

    // Save progress
    const { data: existing, error: existingError } = await supabase
      .from("emotion_progress")
      .select("id")
      .eq("user_id", studentId)
      .eq("level_id", id)
      .maybeSingle();
    if (existingError) throw existingError;

    if (existing) {
      const { error: updateError } = await supabase
        .from("emotion_progress")
        .update({ emotion_attempt: emotionAttemptValue })
        .eq("id", existing.id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("emotion_progress")
        .insert([
          {
            user_id: studentId,
            level_id: id,
            emotion_attempt: emotionAttemptValue,
          },
        ]);

      if (insertError) throw insertError;
    }

    // Answer
    const finished = isCorrect || attempt >= 3;
    return res.json({
      isCorrect,
      finished,
      correctEmotion,
      correctIntensity,
      attempt,
      message: isCorrect
        ? "✅ ¡Muy bien! Has identificado correctamente la emoción."
        : "❌ Intenta de nuevo. Observa la situación con atención.",
    });
  } catch (error) {
    console.error("Error checking emotion solution:", error);
    return res.status(500).json({ error: "Error checking emotion solution" });
  }
};

// Get emotion choices for a level
export const getEmotionChoices = async (req, res) => {
  const { id } = req.params;

  try {
    // Get the scenario for the level
    const { data: scenario, error: scenarioError } = await supabase
      .from("emotion_scenarios")
      .select("id")
      .eq("level_id", id)
      .single();

    if (scenarioError || !scenario)
      return res.status(404).json({ error: "Scenario not found" });

    // Get the options associated with that scenario
    const { data: choices, error: choicesError } = await supabase
      .from("emotion_choices")
      .select("id, text, is_recommended")
      .eq("scenario_id", scenario.id);

    if (choicesError || !choices)
      return res.status(404).json({ error: "Choices not found" });

    return res.json(choices);
  } catch (error) {
    console.error("Error fetching emotion choices:", error);
    return res.status(500).json({ error: "Error fetching emotion choices" });
  }
};

// Check user reaction choice
export const checkReactionChoice = async (req, res) => {
  const { choiceId } = req.params;

  try {
    // Get token and student ID
    const token = req.headers.authorization?.replace("Bearer ", "");
    const studentId = await getStudentIdFromToken(token);
    if (!studentId) return res.status(401).json({ error: "No autorizado" });

    // Get choice info
    const { data: choice, error: choiceError } = await supabase
      .from("emotion_choices")
      .select("is_recommended, scenario_id")
      .eq("id", choiceId)
      .single();

    if (choiceError || !choice)
      return res.status(404).json({ error: "Choice not found" });

    // Get the level associated with the scenario
    const { data: scenario, error: scenarioError } = await supabase
      .from("emotion_scenarios")
      .select("level_id")
      .eq("id", choice.scenario_id)
      .single();

    if (scenarioError || !scenario)
      return res.status(404).json({ error: "Scenario not found" });

    const levelId = scenario.level_id;

    // Save progress
    const { data: existingProgress, error: existingProgressError } = await supabase
      .from("emotion_progress")
      .select("id, emotion_attempt")
      .eq("user_id", studentId)
      .eq("level_id", levelId)
      .maybeSingle();

    if (existingProgressError) throw existingProgressError;

    if (existingProgress) {
      const { error: updateError } = await supabase
        .from("emotion_progress")
        .update({ reaction_correct: choice.is_recommended })
        .eq("id", existingProgress.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("emotion_progress")
        .insert([
          {
            user_id: studentId,
            level_id: levelId,
            reaction_correct: choice.is_recommended,
          },
        ]);
      if (insertError) throw insertError;
    }

    // Calculate score
    let score = 0;
    if (choice.is_recommended) score += 1;
    if (existingProgress && existingProgress.emotion_attempt) {
      if (existingProgress.emotion_attempt === 1) score += 2;
      else if (
        existingProgress.emotion_attempt === 2 ||
        existingProgress.emotion_attempt === 3
      )
        score += 1;
    }

    // Save or update in game_sessions
    const { data: existingSession, error: existingSessionError } = await supabase
      .from("game_sessions")
      .select("id, score")
      .eq("user_id", studentId)
      .eq("game_id", "871083d4-5b39-4ec4-8dbf-2377701d9670")
      .eq("level_id", levelId)
      .maybeSingle();

    if (existingSessionError) throw existingSessionError;

    if (existingSession) {
      const { error: updateError } = await supabase
        .from("game_sessions")
        .update({ score })
        .eq("id", existingSession.id);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabase
        .from("game_sessions")
        .insert([
          {
            user_id: studentId,
            game_id: "871083d4-5b39-4ec4-8dbf-2377701d9670",
            level_id: levelId,
            score,
          },
        ]);
      if (insertError) throw insertError;
    }
    return res.json({ correct: choice.is_recommended });
  } catch (error) {
    console.error("Error checking reaction choice:", error);
    return res.status(500).json({ error: "Error checking reaction choice" });
  }
};