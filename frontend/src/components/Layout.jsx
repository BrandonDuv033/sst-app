import { Icon, SstLogo } from "./ui";
import { isJefe, iniciales, rolLabel } from "../utils";

const NAV_JEFE = [["dashboard", "grid", "Dashboard"], ["asignacion", "clipboard", "Asignación"], ["tecnicos", "users", "Técnicos"]];

export function Layout({ user, view, setView, logout, titulo, sub, accion, children }) {
  return (
    <div className="shell">
      <aside className="side">
        <SstLogo />
        <nav className="side-nav" aria-label="Navegación principal">
          {(isJefe(user) ? (user.rol === "Administrador" ? [...NAV_JEFE, ["usuarios", "shield", "Usuarios y roles"]] : NAV_JEFE) : [["mis", "ticket", user.rol === "Aprendiz" ? "Mis solicitudes" : "Mis soportes"]]).map(([k, i, t]) => (
            <button key={k} className={view === k ? "on" : ""} onClick={() => setView(k)}>
              <Icon name={i} size={18} />{t}
            </button>
          ))}
        </nav>
        <div className="side-user">
          <span className="avatar">{iniciales(user.nombre)}</span>
          <div>
            <strong className="d-block text-truncate">{user.nombre}</strong>
            <small className="opacity-75">{rolLabel(user.rol)}</small>
          </div>
          <button onClick={logout} aria-label="Cerrar sesión"><Icon name="logout" size={18} /></button>
        </div>
      </aside>
      <main className="main">
        <header className="page-head">
          <div><h1>{titulo}</h1><p>{sub}</p></div>
          {accion}
        </header>
        <div className="p-3 p-lg-4">{children}</div>
      </main>
    </div>
  );
}
