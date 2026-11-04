import { useState, useEffect } from "react";

import { soporteService } from "../services/soporteService";
import { authService } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export const SoporteForm = ({ onCancel, onSuccess }) => {
  const { user } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [prioridad, setPrioridad] = useState("Media");
  const [tecnicoId, setTecnicoId] = useState("");
  const [tecnicos, setTecnicos] = useState([]);

  useEffect(() => {
    const cargarTecnicos = async () => {
      try {
        const data = await authService.obtenerTecnicos();
        setTecnicos(data);
      } catch (err) {
        console.error("Error al cargar técnicos");
      }
    };

    cargarTecnicos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await soporteService.crearSoporte({
        titulo,
        descripcion,
        prioridad,
        tecnico_id: tecnicoId || null,
        creado_por: user.id,
      });

      onSuccess();
    } catch (err) {
      alert("Error al registrar el soporte");
    }
  };

  return (
    <div className="form-modal-overlay">
      <div className="form-container">
        <h3>Registrar Nuevo Soporte Técnico</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título del Problema:</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción detallada:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Prioridad:</label>
            <select
              value={prioridad}
              onChange={(e) => setPrioridad(e.target.value)}
            >
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
              <option value="Urgente">Urgente</option>
            </select>
          </div>

          <div className="form-group">
            <label>Asignar a Técnico:</label>
            <select
              value={tecnicoId}
              onChange={(e) => setTecnicoId(e.target.value)}
            >
              <option value="">-- Seleccione un técnico --</option>

              {tecnicos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-success">
              Guardar Soporte
            </button>

            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
