import { supabase } from "../api/supabaseClient.js";

export const soporteService = {
  async obtenerSoportes(user) {
    let query = supabase.from("soportes").select(`
      *,
      tecnico:usuarios!soportes_tecnico_id_fkey (
        id,
        nombre,
        email
      ),
      creador:usuarios!soportes_creado_por_fkey (
        id,
        nombre,
        email
      )
    `);

    if (user.rol === "Tecnico") {
      query = query.eq("tecnico_id", user.id);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  async crearSoporte(soporteData) {
    const { data, error } = await supabase
      .from("soportes")
      .insert([soporteData])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  async actualizarEstado(id, nuevoEstado) {
    const { data, error } = await supabase
      .from("soportes")
      .update({ estado: nuevoEstado })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  async asignar(id, tecnicoId, prioridad) {
    const { error } = await supabase
      .from("soportes")
      .update({ tecnico_id: tecnicoId, prioridad })
      .eq("id", id);

    if (error) throw new Error(error.message);
  },
};
