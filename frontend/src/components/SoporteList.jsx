import { useCallback, useEffect, useState } from "react";

import { soporteService } from "../services/soporteService";
import { useAuth } from "../context/AuthContext";
import { SoporteForm } from "./SoporteForm";

export const SoporteList = () => {
  const { user, logout } = useAuth();

  const [soportes, setSoportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [soporteSeleccionado, setSoporteSeleccionado] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [actualizandoEstado, setActualizandoEstado] = useState(false);

  const obtenerSoportes = useCallback(
    () => soporteService.obtenerSoportes(user),
    [user],
  );

  const cargarSoportes = async () => {
    try {
      setLoading(true);
      const data = await obtenerSoportes();
      setSoportes(data);
    } catch (err) {
      alert(err.message || "Error al cargar soportes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let componenteActivo = true;

    const cargarInicial = async () => {
      try {
        const data = await obtenerSoportes();
        if (componenteActivo) setSoportes(data);
      } catch (err) {
        if (componenteActivo) {
          alert(err.message || "Error al cargar soportes");
        }
      } finally {
        if (componenteActivo) setLoading(false);
      }
    };

    cargarInicial();

    return () => {
      componenteActivo = false;
    };
  }, [obtenerSoportes]);

  const abrirModalEstado = (soporte) => {
    setSoporteSeleccionado(soporte);
    setNuevoEstado(soporte.estado);
  };

  const cambiarEstado = async (event) => {
    event.preventDefault();
    if (!soporteSeleccionado) return;

    setActualizandoEstado(true);
    try {
      const soporteActualizado = await soporteService.actualizarEstado(
        soporteSeleccionado.id,
        nuevoEstado,
      );
      setSoportes((soportesActuales) =>
        soportesActuales.map((soporte) =>
          soporte.id === soporteActualizado.id
            ? { ...soporte, estado: soporteActualizado.estado }
            : soporte,
        ),
      );
      setSoporteSeleccionado(null);
    } catch (err) {
      alert(err.message || "Error al actualizar estado");
    } finally {
      setActualizandoEstado(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="dash-header">
        <div>
          <h2>Panel de Gestión - Soportes TIC</h2>

          <p>
            Usuario: <strong>{user.nombre}</strong> | Rol:{" "}
            <span className="role-badge">{user.rol}</span>
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          {(user.rol === "Administrador" || user.rol === "Coordinador") && (
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + Registrar Soporte
            </button>
          )}

          <button className="btn-cancel" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      {showForm && (
        <SoporteForm
          onCancel={() => setShowForm(false)}
          onSuccess={() => {
            setShowForm(false);
            cargarSoportes();
          }}
        />
      )}

      {soporteSeleccionado && (
        <div
          className="form-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget && !actualizandoEstado) {
              setSoporteSeleccionado(null);
            }
          }}
        >
          <div
            className="form-container"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cambiar-estado-titulo"
          >
            <h3 id="cambiar-estado-titulo">Cambiar estado del soporte</h3>
            <p>{soporteSeleccionado.titulo}</p>

            <form onSubmit={cambiarEstado}>
              <div className="form-group">
                <label htmlFor="nuevo-estado">Selecciona el nuevo estado:</label>
                <select
                  id="nuevo-estado"
                  value={nuevoEstado}
                  onChange={(event) => setNuevoEstado(event.target.value)}
                  disabled={actualizandoEstado}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Resuelto">Resuelto</option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-success"
                  disabled={actualizandoEstado}
                >
                  {actualizandoEstado ? "Guardando..." : "Guardar estado"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setSoporteSeleccionado(null)}
                  disabled={actualizandoEstado}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="status-message">
          Cargando actividades acordes a tu perfil...
        </p>
      ) : (
        <div className="cards-grid">
          {soportes.length === 0 ? (
            <p>
              No hay actividades de soporte asignadas o registradas para tu
              perfil.
            </p>
          ) : (
            soportes.map((s) => (
              <div key={s.id} className="persona-card">
                <h3>{s.titulo}</h3>

                <p>
                  <strong>Descripción:</strong> {s.descripcion}
                </p>

                <p>
                  <strong>Prioridad:</strong>{" "}
                  <span className={`badge ${s.prioridad.toLowerCase()}`}>
                    {s.prioridad}
                  </span>
                </p>

                <p>
                  <strong>Estado:</strong> {s.estado}
                </p>

                {user.rol !== "Tecnico" && (
                  <p>
                    <strong>Técnico Asignado:</strong>{" "}
                    {s.tecnico?.nombre || "Sin asignar"}
                  </p>
                )}

                <div style={{ marginTop: "15px" }}>
                  <button
                    className="btn-edit"
                    onClick={() => abrirModalEstado(s)}
                  >
                    Cambiar Estado
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
