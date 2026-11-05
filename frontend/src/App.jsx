import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Login, Register } from "./components/Auth";
import { Layout } from "./components/Layout";
import { NuevoSoporte } from "./components/NuevoSoporte";
import { Icon } from "./components/ui";
import { Dashboard, Asignacion, Tecnicos } from "./pages/Jefe";
import { MisSoportes } from "./pages/Tecnico";
import { Usuarios } from "./pages/Usuarios";
import { useSoportes } from "./hooks/useSoportes";
import { soporteService } from "./services/soporteService";
import { isJefe } from "./utils";

const TITULOS = {
  usuarios: ["Usuarios y roles", "Asigna el rol de cada persona"],
  dashboard: ["Dashboard", "Resumen general de soportes TIC"],
  asignacion: ["Asignación de soportes", "Ordenados por prioridad y antigüedad"],
  tecnicos: ["Técnicos", "Disponibilidad y carga de trabajo del equipo"],
  mis: ["Mis soportes", "Gestiona las solicitudes que tienes asignadas"],
};

function Panel({ user, logout }) {
  const jefe = isJefe(user);
  const aprendiz = user.rol === "Aprendiz";
  const [view, setView] = useState(user.vistaInicial in TITULOS ? user.vistaInicial : jefe ? "dashboard" : "mis");
  const [nuevo, setNuevo] = useState(false);
  const [aviso, setAviso] = useState("");
  const { soportes, tecnicos, loading, error, recargar } = useSoportes(user);

  const avisar = (m) => {
    setAviso(m);
    setTimeout(() => setAviso(""), 3500);
  };

  // Ejecuta una operación, recarga los datos y avisa el resultado.
  const ejecutar = async (fn, ok) => {
    try {
      await fn();
      await recargar();
      setAviso(ok);
    } catch (e) {
      setAviso(e.message || "Ocurrió un error, intenta de nuevo");
      return false;
    } finally {
      setTimeout(() => setAviso(""), 3500);
    }
    return true;
  };

  const crear = async (f) => {
    const ok = await ejecutar(() => soporteService.crearSoporte({
      titulo: f.titulo, descripcion: f.descripcion, prioridad: aprendiz ? "Media" : f.prioridad,
      tecnico_id: aprendiz ? null : f.tecnico || null, creado_por: user.id,
    }), "Soporte registrado");
    if (ok) setNuevo(false);
    return ok;
  };
  const asignar = (id, tecnicoId, prioridad) =>
    ejecutar(() => soporteService.asignar(id, tecnicoId, prioridad), "Soporte asignado");
  const cambiarEstado = (id, estado) =>
    ejecutar(() => soporteService.actualizarEstado(id, estado), "Estado actualizado");

  const [titulo, sub] = aprendiz ? ["Mis solicitudes", "Reporta fallos y consulta su avance"] : TITULOS[view];
  const accion = (aprendiz || (jefe && view !== "tecnicos" && view !== "usuarios")) && (
    <button className="btn btn-primary" onClick={() => setNuevo(true)}><Icon name="plus" size={18} />Registrar soporte</button>
  );

  let cuerpo;
  if (loading) cuerpo = <p className="text-secondary">Cargando soportes...</p>;
  else if (error) cuerpo = <div className="alert alert-danger" role="alert">{error}</div>;
  else if (view === "dashboard") cuerpo = <Dashboard soportes={soportes} tecnicos={tecnicos} irAsignacion={() => setView("asignacion")} />;
  else if (view === "asignacion") cuerpo = <Asignacion soportes={soportes} tecnicos={tecnicos} asignar={asignar} />;
  else if (view === "usuarios") cuerpo = <Usuarios yo={user.id} avisar={avisar} />;
  else if (view === "tecnicos") cuerpo = <Tecnicos soportes={soportes} tecnicos={tecnicos} />;
  else cuerpo = <MisSoportes soportes={soportes} cambiarEstado={cambiarEstado} soloLectura={aprendiz} />;

  return (
    <Layout user={user} view={view} setView={setView} logout={logout} titulo={titulo} sub={sub} accion={accion}>
      {cuerpo}
      {nuevo && <NuevoSoporte tecnicos={tecnicos} simple={aprendiz} onClose={() => setNuevo(false)} onSave={crear} />}
      {aviso && <div className="aviso" role="status">{aviso}</div>}
    </Layout>
  );
}

function Main() {
  const { user, cargando, logout } = useAuth();
  const [registro, setRegistro] = useState(false);
  if (cargando) return null;
  if (user) return <Panel key={user.id} user={user} logout={logout} />;
  return registro
    ? <Register onSwitchToLogin={() => setRegistro(false)} />
    : <Login onSwitchToRegister={() => setRegistro(true)} />;
}

export default function App() {
  return (
    <AuthProvider>
      <Main />
    </AuthProvider>
  );
}
