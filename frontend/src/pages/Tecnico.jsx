import { useState } from "react";
import { Icon, Prioridad, Estado, Vacio } from "../components/ui";
import { ESTADOS, nro, hace, fechaLarga, iniciales } from "../utils";

function Detalle({ s, volver, guardar, soloLectura }) {
  const [e, setE] = useState(s.estado);
  const [busy, setBusy] = useState(false);
  const persona = soloLectura ? s.tecnico : s.creador;
  const enviar = async () => {
    setBusy(true);
    await guardar(s.id, e);
    setBusy(false);
  };
  return (
    <div className="detalle">
      <button className="btn btn-link px-0 mb-3" onClick={volver}><Icon name="arrow" size={17} />Volver a mis soportes</button>
      <div className="d-flex gap-2 mb-2"><Prioridad v={s.prioridad} /><Estado v={s.estado} /></div>
      <h2 className="h4">{s.titulo}</h2>
      <p className="text-secondary small">{nro(s.id)}, registrado el {fechaLarga(s.created_at)}</p>
      <section className="panel p-3 mb-3"><h3 className="h6">Descripción</h3><p className="mb-0">{s.descripcion}</p></section>
      <section className="panel p-3 mb-3 d-flex align-items-center gap-3">
        <span className="avatar">{persona ? iniciales(persona.nombre) : "-"}</span>
        <div className="min-w-0">
          <small className="text-secondary d-block">{soloLectura ? "Técnico asignado" : "Solicitado por"}</small>
          <strong>{persona?.nombre || "Sin asignar"}</strong>
          {persona && <small className="d-block text-secondary text-truncate">{persona.email}</small>}
        </div>
      </section>
      {!soloLectura && (
        <section className="panel p-3">
          <h3 className="h6">Actualizar estado</h3>
          <p className="small text-secondary">Selecciona el avance actual de esta solicitud.</p>
          <div className="btn-group w-100 mb-3" role="group" aria-label="Estado">
            {ESTADOS.map((x) => (
              <button key={x} type="button" className={`btn ${e === x ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => setE(x)}>{x}</button>
            ))}
          </div>
          <button className="btn btn-success" disabled={e === s.estado || busy} onClick={enviar}>{busy ? "Guardando..." : "Guardar estado"}</button>
        </section>
      )}
    </div>
  );
}

export function MisSoportes({ soportes, cambiarEstado, soloLectura }) {
  const [tab, setTab] = useState("Pendiente");
  const [sel, setSel] = useState(null);
  const actual = soportes.find((s) => s.id === sel);
  if (actual) return <Detalle s={actual} volver={() => setSel(null)} guardar={cambiarEstado} soloLectura={soloLectura} />;
  const visibles = soportes.filter((s) => s.estado === tab);

  return (
    <>
      <div className="tabs" role="tablist">
        {ESTADOS.map((x) => (
          <button key={x} role="tab" aria-selected={tab === x} className={tab === x ? "on" : ""} onClick={() => setTab(x)}>
            {x}<span>{soportes.filter((s) => s.estado === x).length}</span>
          </button>
        ))}
      </div>
      {visibles.length ? (
        <div className="row g-3">
          {visibles.map((s) => (
            <div className="col-12 col-md-6 col-xl-4" key={s.id}>
              <button className={`card-s h-100 ${s.prioridad === "Urgente" ? "urgente" : ""}`} onClick={() => setSel(s.id)}>
                <div className="d-flex gap-2 mb-2"><Prioridad v={s.prioridad} /><Estado v={s.estado} /></div>
                <h3>{s.titulo}</h3>
                <p className="clamp small text-secondary">{s.descripcion}</p>
                <div className="d-flex justify-content-between small text-secondary">
                  <span className="text-truncate">{soloLectura ? s.tecnico?.nombre || "Sin técnico asignado" : s.creador?.nombre}</span>
                  <span className="text-nowrap ms-2">{hace(s.created_at)}</span>
                </div>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <Vacio icono="inbox" titulo={`No tienes soportes en estado ${tab.toLowerCase()}`} texto={soloLectura ? "Las solicitudes que registres aparecerán aquí." : "Cuando recibas una solicitud en este estado, aparecerá aquí."} />
      )}
    </>
  );
}
