import { supabase } from "../supabaseClient.js";

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

// Login with images
export const visualLogin = async (req, res) => {
  const { name, selectedSequence } = req.body;

  if (!name || !selectedSequence || !Array.isArray(selectedSequence)) {
    return res.status(400).json({ error: "Faltan datos o formato incorrecto" });
  }

  try {
    // 1️⃣ Obtener el usuario por nombre
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("name", name)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const userId = profile.id;

    // 2️⃣ Obtener la secuencia real desde la BD
    const { data: visualLogin, error: visualError } = await supabase
      .from("visual_logins")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (visualError || !visualLogin) {
      return res.status(400).json({ error: "El usuario no tiene login por imágenes" });
    }

    const { data: storedSequence, error: sequenceError } = await supabase
      .from("visual_login_sequences")
      .select("image_url, order_index")
      .eq("visual_login_id", visualLogin.id)
      .order("order_index", { ascending: true });

    if (sequenceError || !storedSequence || storedSequence.length === 0) {
      return res.status(400).json({ error: "Secuencia no encontrada" });
    }

    // 3️⃣ Verificar coincidencia exacta de orden
    const isMatch = storedSequence.every(
      (item, index) => item.image_url === selectedSequence[index]
    );

    if (!isMatch) {
      return res.status(401).json({ error: "Secuencia incorrecta" });
    }

    // 4️⃣ Crear sesión manualmente (igual que login normal)
    // Para esto, pedimos un token a Supabase para el usuario
    const { data: tokenData, error: tokenError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: `${userId}@visual-login.local`, // correo virtual si el niño no tiene email
      options: {
        redirectTo: "https://tuweb.com/dashboard",
      },
    });

    if (tokenError) return res.status(400).json({ error: tokenError.message });

    res.json({
      message: "Inicio de sesión exitoso",
      session: tokenData,
      userId,
    });
  } catch (err) {
    console.error("Error en loginWithImages:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
