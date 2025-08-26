import { supabase } from "../supabaseClient.js";

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

export const setPassword = async (req, res) => {
  const { password, passwordConfirmation, accessToken, refreshToken } = req.body;

  if (!password || !passwordConfirmation || !accessToken || !refreshToken) {
    return res.status(400).json({ error: "Faltan datos necesarios" });
  }

  if (password !== passwordConfirmation) {
    return res.status(400).json({ error: "Las contraseñas no coinciden" });
  }

  try {
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    if (sessionError) {
      return res.status(400).json({ error: sessionError.message });
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.json({ message: "Contraseña cambiada correctamente" });
  } catch (err) {
    console.error("Error en setPassword:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
