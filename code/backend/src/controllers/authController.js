import { supabase } from "../supabaseClient.js";

export const register = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });
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