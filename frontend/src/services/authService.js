import { supabase } from "../api/supabaseClient";

const COLUMNAS = "id, documento, nombre, email, created_at, rol_id, roles(nombre, vista_inicial)";

// El resto de la app usa user.rol (nombre) y user.vistaInicial (viene de la tabla roles).
const cargarPerfil = async (id) => {
  const { data, error } = await supabase.from("usuarios").select(COLUMNAS).eq("id", id).single();
  if (error || !data) throw new Error("No se encontró el perfil del usuario");
  const { roles, ...u } = data;
  return { ...u, rol: roles.nombre, vistaInicial: roles.vista_inicial };
};

export const authService = {
  // El rol NO se envía: la base de datos lo asigna.
  async registrarUsuario({ documento, nombre, email, password }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { documento, nombre } },
    });
    if (error) throw new Error(error.message);
    if (!data.session) return null; // confirmación de correo activada
    return cargarPerfil(data.user.id);
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error("Credenciales inválidas");
    return cargarPerfil(data.user.id);
  },

  async sesionActual() {
    const { data } = await supabase.auth.getSession();
    return data.session ? cargarPerfil(data.session.user.id) : null;
  },

  async logout() {
    await supabase.auth.signOut();
  },

  async obtenerTecnicos() {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nombre, email, documento, roles!inner(nombre)")
      .eq("roles.nombre", "Tecnico");
    if (error) throw new Error(error.message);
    return data || [];
  },

  async obtenerUsuarios() {
    const { data, error } = await supabase
      .from("usuarios")
      .select("id, nombre, email, documento, rol_id")
      .order("nombre");
    if (error) throw new Error(error.message);
    return data || [];
  },

  async obtenerRoles() {
    const { data, error } = await supabase.from("roles").select("id, nombre").order("id");
    if (error) throw new Error(error.message);
    return data || [];
  },

  async cambiarRol(id, rolId) {
    const { data, error } = await supabase.from("usuarios").update({ rol_id: rolId }).eq("id", id).select("id");
    if (error) throw new Error(error.message);
    if (!data?.length) throw new Error("No tienes permiso para cambiar roles");
  },
};
