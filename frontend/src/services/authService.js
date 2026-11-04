import { supabase } from "../api/supabaseClient";

export const authService = {
  // Registrar usuario
  async registrarUsuario(userData) {
    const { data, error } = await supabase
      .from("usuarios")
      .insert([userData])
      .select("id, documento, nombre, email, rol, created_at")
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  // Iniciar sesión
  async login(email, password) {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, documento, nombre, email, rol, created_at")
      .eq("email", email)
      .single();

    if (error || !data) {
      throw new Error("Credenciales inválidas");
    }

    // La autenticación debe realizarse con Supabase Auth.
    // No compares contraseñas directamente desde la tabla usuarios.

    return data;
  },

  // Obtener técnicos
  async obtenerTecnicos() {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nombre")
      .eq("rol", "Tecnico");

    if (error) throw new Error(error.message);

    return data || [];
  },
};
