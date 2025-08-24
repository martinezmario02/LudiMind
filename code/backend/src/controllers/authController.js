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