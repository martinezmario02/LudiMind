import { supabase } from "../supabaseClient.js";
import jwt from "jsonwebtoken";

// Register function
export const register = async (req, res) => {
  const { name, birthdate, email, password, confirmPassword } = req.body;

  // Check password confirmation
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Las contraseñas no coinciden" });
  }

  // Create user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error){
    if (error.message === "User already registered") {
      return res.status(409).json({ error: "El usuario ya está registrado" });
    } else if (error.message === "Password should be at least 6 characters.") {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }
    return res.status(400).json({ error: error.message });
  }

  // Add extra user information to the profiles table
  if (data.user) {
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: data.user.id,
        name,
        birthdate,
      });
    if (profileError) return res.status(400).json({ error: profileError.message });
  }
  res.json({ message: "Revisa tu correo para confirmar tu cuenta", data });
};

// Login function
export const login = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message === "Invalid login credentials") {
      return res.status(401).json({ error: "Correo o contraseña incorrectos" });
    }
    return res.status(400).json({ error: error.message });
  }
  res.json({ session: data.session });
};

// Reset password function
export const resetPassword = async (req, res) => {
  const { email } = req.body;
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "http://localhost:3000/set-password"
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }
  res.json({ message: "Se ha enviado un enlace de restablecimiento de contraseña a tu correo electrónico." });
};

// Set password function
export const setPassword = async (req, res) => {
  const { password, passwordConfirmation, accessToken, refreshToken } = req.body;

  if (!password || !passwordConfirmation)
    return res.status(400).json({ error: "Faltan datos necesarios" });

  if (password !== passwordConfirmation)
    return res.status(400).json({ error: "Las contraseñas no coinciden" });

  try {
    if (accessToken && refreshToken) {
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (sessionError) return res.status(400).json({ error: sessionError.message });

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) return res.status(400).json({ error: updateError.message });
      return res.json({ message: "Contraseña cambiada correctamente 1" });
    }

    return res.status(400).json({ error: "Faltan credenciales del enlace" });
  } catch (err) {
    console.error("Error en setPassword:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Get current user function
export const getCurrentUser = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    // Get user
    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData.user) return res.status(401).json({ error: "No autorizado" });

    const userId = authData.user.id;

    // Get name
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", userId)
      .single();

    if (profileError) return res.status(400).json({ error: profileError.message });

    const name = profileData?.name || authData.user.email; 
    res.json({ name });
  } catch (err) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Get current student function
export const getCurrentStudent = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    // Get and verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.studentId) {
      return res.status(401).json({ error: "Token inválido o incompleto" });
    }

    // Get student data
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id, name, username, birthdate")
      .eq("id", decoded.studentId)
      .single();

    if (studentError || !student) {
      return res.status(404).json({ error: "Estudiante no encontrado" });
    }

    return res.json({
      id: student.id,
      name: student.name,
      username: student.username,
      birthdate: student.birthdate,
      loginType: "visual",
    });
  } catch (err) {
    console.error("Error en getCurrentStudent:", err);
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Token no válido" });
    }
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Login with images
export const visualLogin = async (req, res) => {
  const { username, selectedSequence } = req.body;

  if (!username || !Array.isArray(selectedSequence) || selectedSequence.length === 0) {
    return res.status(400).json({ success: false, error: "Faltan datos o formato incorrecto" });
  }

  try {
    // Get student by username
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id, name")
      .eq("username", username)
      .single();

    if (studentError || !student) {
      return res.status(404).json({ success: false, error: "Usuario no encontrado" });
    }

    // Get stored sequence
    const { data: storedSequence, error: seqError } = await supabase
      .from("visual_login_sequences")
      .select("image_url")
      .eq("user_id", student.id)
      .order("order_index", { ascending: true });

    if (seqError || !storedSequence?.length) {
      return res.status(400).json({ success: false, error: "Secuencia no encontrada" });
    }

    // Compare sequences
    const isMatch =
      storedSequence.length === selectedSequence.length &&
      storedSequence.every((item, index) => item.image_url === selectedSequence[index]);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Secuencia incorrecta" });
    }

    // Create session object
    const token = jwt.sign(
      { studentId: student.id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      message: "Inicio de sesión exitoso",
      token, 
    });
  } catch (err) {
    console.error("Error en visualLogin:", err);
    return res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};

// Register with images
export const visualRegister = async (req, res) => {
  const { username, name, birthdate, sequence } = req.body;

  if (!username || !name || !birthdate || !Array.isArray(sequence) || sequence.length === 0) {
    return res.status(400).json({ error: "Faltan datos o formato incorrecto" });
  }

  try {
    // Check if username already exists
    const { data: existing, error: existingError } = await supabase
      .from("students")
      .select("id")
      .eq("username", username)
      .maybeSingle();

    if (existingError) throw existingError;
    if (existing) return res.status(409).json({ error: "El nombre de usuario ya existe" });

    // Create student
    const { data: student, error: studentError } = await supabase
      .from("students")
      .insert([{ username, name, birthdate }])
      .select()
      .single();

    if (studentError) throw studentError;

    // Insert visual sequence
    const sequenceData = sequence.map((imageUrl, index) => ({
      user_id: student.id,
      order_index: index,
      image_url: imageUrl,
    }));

    const { error: sequenceError } = await supabase
      .from("visual_login_sequences")
      .insert(sequenceData);

    if (sequenceError) throw sequenceError;

    res.json({ message: "Estudiante registrado correctamente", studentId: student.id });
  } catch (err) {
    console.error("Error en registerStudent:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Change name function
export const changeName = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { name } = req.body;

  if (!token) return res.status(401).json({ error: "No autorizado" });
  if (!name) return res.status(400).json({ error: "Falta el nuevo nombre" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.studentId) {
      return res.status(401).json({ error: "Token inválido o incompleto" });
    }

    // Change name
    const { error: updateError } = await supabase
      .from("students")
      .update({ name })
      .eq("id", decoded.studentId);

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    return res.json({ message: "Nombre actualizado correctamente" });
  } catch (err) {
    console.error("Error en changeName:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Delete account function
export const deleteAccount = async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    // Get user identifiers
    let studentId = null;
    let authUserId = null;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded?.studentId) studentId = decoded.studentId;
    } catch {}

    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (!authError && authData?.user) {
      authUserId = authData.user.id;
    }
    if (!studentId && !authUserId) {
      return res.status(401).json({ error: "Token inválido" });
    }

    // Delete data
    if (studentId) {
      await supabase.from("visual_login_sequences").delete().eq("user_id", studentId);
      await supabase.from("students").delete().eq("id", studentId);
    }
    if (authUserId) {
      await supabase.from("profiles").delete().eq("id", authUserId);
      await supabase.auth.admin.deleteUser(authUserId);
    }
    return res.json({ message: "Cuenta y datos eliminados correctamente" });
  } catch (err) {
    console.error("Error en deleteAccount:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};