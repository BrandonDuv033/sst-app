import { useEffect, useState } from "react";
import { Icon, Vacio } from "../components/ui";
import { authService } from "../services/authService";
import { rolLabel } from "../utils";

export function Usuarios({ yo, avisar }) {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    Promise.all([authService.obtenerUsuarios(), authService.obtenerRoles()])
      .then(([u, r]) => { setUsuarios(u); setRoles(r); })
      .catch((e) => setError(e.message));
  }, []);

  const cambiar = async (u, rolId) => {
    try {
      await authService.cambiarRol(u.id, Number(rolId));
      setUsuarios((prev) => prev.map((x) => (x.id === u.id ? { ...x, rol_id: Number(rolId) } : x)));
      avisar("Rol actualizado");
    } catch (e) {
      avisar(e.message);
    }
  };

  const lista = usuarios.filter((u) => `${u.nombre} ${u.email} ${u.documento}`.toLowerCase().includes(q.toLowerCase()));
  if (error) return <div className="alert alert-danger" role="alert">{error}</div>;

  return (
    <section className="panel">
      <div className="p-3 border-bottom">
        <label className="buscar">
          <Icon name="search" size={18} />
          <input className="form-control" placeholder="Buscar por nombre, correo o documento" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
      </div>
      {lista.length ? (
        <div className="table-responsive">
          <table className="table tabla align-middle mb-0">
            <thead><tr><th>Persona</th><th>Documento</th><th style={{ minWidth: 190 }}>Rol</th></tr></thead>
            <tbody>
              {lista.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.nombre}</strong><small className="d-block text-secondary">{u.email}</small></td>
                  <td className="text-nowrap">{u.documento}</td>
                  <td>
                    <select className="form-select form-select-sm" aria-label={`Rol de ${u.nombre}`} value={u.rol_id}
                      disabled={u.id === yo} title={u.id === yo ? "No puedes cambiar tu propio rol" : ""}
                      onChange={(e) => cambiar(u, e.target.value)}>
                      {roles.map((r) => <option key={r.id} value={r.id}>{rolLabel(r.nombre)}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <Vacio icono="search" titulo="No encontramos personas" texto="Prueba con otro nombre, correo o documento." />}
    </section>
  );
}
