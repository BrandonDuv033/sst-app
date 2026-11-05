export const PRIORIDADES = ["Baja", "Media", "Alta", "Urgente"];
export const ESTADOS = ["Pendiente", "En Proceso", "Resuelto"];

// Solo Administrador y Coordinador ven el panel de jefatura.
export const isJefe = (u) => ["Administrador", "Coordinador"].includes(u.rol);
export const rolLabel = (r) =>
  ({ Tecnico: "Técnico", Coordinador: "Jefe TIC" })[r] || r;

export const iniciales = (n = "") =>
  n.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

export const nro = (id) =>
  "#" + (typeof id === "number" ? String(id).padStart(4, "0") : String(id).slice(0, 6));

export const hace = (iso) => {
  const m = Math.round((Date.now() - new Date(iso)) / 6e4);
  if (m < 1) return "Ahora";
  if (m < 60) return `Hace ${m} min`;
  const h = Math.round(m / 60);
  if (h < 24) return `Hace ${h} h`;
  const d = Math.round(h / 24);
  return d === 1 ? "Ayer" : `Hace ${d} días`;
};

export const fechaLarga = (iso) =>
  new Date(iso).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" });
