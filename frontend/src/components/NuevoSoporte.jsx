import { useState } from "react";
import { Modal, Campo } from "./ui";
import { PRIORIDADES } from "../utils";

export function NuevoSoporte({ tecnicos, simple, onClose, onSave }) {
  const [f, setF] = useState({ titulo: "", descripcion: "", prioridad: "Media", tecnico: "" });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setBusy(true);
    if (!(await onSave(f))) setBusy(false);
  };

  return (
    <Modal titulo="Registrar soporte" onClose={onClose}>
      <form onSubmit={enviar}>
        <Campo label="Título del soporte" placeholder="Ej. Equipo de sala 204 no enciende" maxLength={80} value={f.titulo} onChange={set("titulo")} required />
        <Campo as="textarea" label="Descripción detallada" rows={4} placeholder="Describe el problema y el equipo afectado" value={f.descripcion} onChange={set("descripcion")} required />
        {!simple && <div className="row">
          <div className="col-sm-6">
            <Campo as="select" label="Prioridad" value={f.prioridad} onChange={set("prioridad")}>
              {PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
            </Campo>
          </div>
          <div className="col-sm-6">
            <Campo as="select" label="Técnico (opcional)" value={f.tecnico} onChange={set("tecnico")}>
              <option value="">Sin asignar</option>
              {tecnicos.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
            </Campo>
          </div>
        </div>}
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" disabled={busy}>Registrar soporte</button>
        </div>
      </form>
    </Modal>
  );
}
