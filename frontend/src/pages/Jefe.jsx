import { useState } from "react";
import { Icon, Prioridad, Estado, Modal, Campo, Vacio } from "../components/ui";
import { PRIORIDADES, nro, hace, iniciales } from "../utils";

const activo = (s) => s.estado !== "Resuelto";
const carga = (t, soportes) => soportes.filter((s) => s.tecnico_id === t.id && activo(s)).length;
const LIMITE = 5; // a partir de aquí se muestra "Carga alta"

function Lista({ items, asignar }) {
  return (
    <>
      <div className="table-responsive d-none d-md-block">
        <table className="table tabla align-middle mb-0">
          <thead>
            <tr>
              <th>Soporte</th><th>Prioridad</th>
              {asignar ? <th>Creado por</th> : <><th>Estado</th><th>Técnico</th></>}
              <th>Fecha</th>{asignar && <th />}
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className={s.prioridad === "Urgente" ? "urgente" : ""}>
                <td><strong>{s.titulo}</strong><small className="d-block text-secondary">{nro(s.id)}</small></td>
                <td><Prioridad v={s.prioridad} /></td>
                {asignar ? <td>{s.creador?.nombre}</td> : (
                  <>
                    <td><Estado v={s.estado} /></td>
                    <td className={s.tecnico ? "" : "text-secondary fst-italic"}>{s.tecnico?.nombre || "Sin asignar"}</td>
                  </>
                )}
                <td className="text-nowrap">{hace(s.created_at)}</td>
                {asignar && <td className="text-end"><button className="btn btn-sm btn-outline-primary" onClick={() => asignar(s)}>Asignar</button></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-md-none vstack gap-2 p-3">
        {items.map((s) => (
          <article key={s.id} className={`card-s ${s.prioridad === "Urgente" ? "urgente" : ""}`}>
            <div className="d-flex gap-2 mb-2"><Prioridad v={s.prioridad} />{!asignar && <Estado v={s.estado} />}</div>
            <h3>{s.titulo}</h3>
            <div className="d-flex justify-content-between align-items-center gap-2 small text-secondary">
              <span>{asignar ? s.creador?.nombre : s.tecnico?.nombre || "Sin asignar"}</span>
              <span>{hace(s.created_at)}</span>
              {asignar && <button className="btn btn-sm btn-outline-primary" onClick={() => asignar(s)}>Asignar</button>}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

const Metrica = ({ icono, tono, titulo, valor, nota }) => (
  <div className="col-12 col-md-4">
    <div className="metrica d-flex align-items-center gap-3">
      <span className={`metrica-ico t-${tono}`}><Icon name={icono} /></span>
      <div className="flex-grow-1"><div className="fw-semibold small">{titulo}</div><small className="text-secondary">{nota}</small></div>
      <strong className="metrica-n">{valor}</strong>
    </div>
  </div>
);

export function Dashboard({ soportes, tecnicos, irAsignacion }) {
  const [prio, setPrio] = useState("");
  const [est, setEst] = useState("");
  const abiertos = soportes.filter(activo);
  const porP = [...PRIORIDADES].reverse().map((p) => [p, abiertos.filter((s) => s.prioridad === p).length]);
  const max = Math.max(1, ...porP.map((x) => x[1]));
  const lista = soportes.filter((s) => (!prio || s.prioridad === prio) && (!est || s.estado === est)).slice(0, 6);

  return (
    <>
      <div className="row g-3 mb-3">
        <Metrica icono="inbox" tono="amber" titulo="Nuevos" valor={abiertos.filter((s) => !s.tecnico_id).length} nota="Sin técnico asignado" />
        <Metrica icono="clipboard" tono="blue" titulo="En atención" valor={abiertos.filter((s) => s.tecnico_id).length} nota="Asignados y sin resolver" />
        <Metrica icono="check" tono="green" titulo="Finalizados" valor={soportes.length - abiertos.length} nota="Soportes resueltos" />
      </div>
      <div className="row g-3 mb-3">
        <div className="col-lg-7">
          <section className="panel p-3 h-100">
            <h2>Soportes por prioridad</h2>
            <p className="sub mb-0">Solicitudes sin resolver</p>
            {porP.map(([p, n]) => (
              <div className="barra" key={p}>
                <span>{p}</span>
                <div><i className={`b-${p.toLowerCase()}`} style={{ width: `${(n / max) * 100}%` }} /></div>
                <b>{n}</b>
              </div>
            ))}
          </section>
        </div>
        <div className="col-lg-5">
          <section className="panel p-3 h-100">
            <h2>Carga del equipo</h2>
            <p className="sub mb-0">Soportes activos por técnico</p>
            {tecnicos.length === 0 && <p className="sub mt-3 mb-0">Aún no hay técnicos registrados.</p>}
            {tecnicos.slice(0, 4).map((t) => {
              const n = carga(t, soportes);
              return (
                <div className="d-flex align-items-center gap-3 mt-3" key={t.id}>
                  <span className="avatar">{iniciales(t.nombre)}</span>
                  <div className="flex-grow-1 min-w-0"><strong className="d-block small text-truncate">{t.nombre}</strong><small className="text-secondary">{n} activos</small></div>
                  <small className={n >= LIMITE ? "text-danger fw-semibold" : "text-secondary"}>{n >= LIMITE ? "Alta" : "Normal"}</small>
                </div>
              );
            })}
          </section>
        </div>
      </div>
      <section className="panel">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 p-3 border-bottom">
          <div><h2>Soportes recientes</h2><p className="sub mb-0">Últimas solicitudes registradas</p></div>
          <div className="d-flex flex-wrap gap-2">
            <select className="form-select form-select-sm w-auto" aria-label="Filtrar por prioridad" value={prio} onChange={(e) => setPrio(e.target.value)}>
              <option value="">Todas las prioridades</option>{PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
            </select>
            <select className="form-select form-select-sm w-auto" aria-label="Filtrar por estado" value={est} onChange={(e) => setEst(e.target.value)}>
              <option value="">Todos los estados</option><option>Pendiente</option><option>En Proceso</option><option>Resuelto</option>
            </select>
            <button className="btn btn-sm btn-outline-primary" onClick={irAsignacion}>Ver por asignar</button>
          </div>
        </div>
        {lista.length ? <Lista items={lista} /> : <Vacio icono="inbox" titulo="Sin soportes" texto="No hay solicitudes con los filtros elegidos." />}
      </section>
    </>
  );
}

function AsignarModal({ s, tecnicos, soportes, onClose, onOk }) {
  const [t, setT] = useState("");
  const [p, setP] = useState(s.prioridad);
  const [busy, setBusy] = useState(false);
  const confirmar = async (e) => {
    e.preventDefault();
    setBusy(true);
    if (!(await onOk(s.id, t, p))) setBusy(false);
  };
  return (
    <Modal titulo="Asignar soporte" onClose={onClose}>
      <form onSubmit={confirmar}>
        <div className="resumen mb-3">
          <div className="d-flex align-items-center gap-2 mb-1"><Prioridad v={s.prioridad} /><small className="text-secondary">{nro(s.id)}</small></div>
          <h3 className="h6">{s.titulo}</h3>
          <p className="small mb-1">{s.descripcion}</p>
          <small className="text-secondary">Solicitado por {s.creador?.nombre}</small>
        </div>
        <Campo as="select" label="Técnico responsable" value={t} onChange={(e) => setT(e.target.value)} required>
          <option value="">Selecciona un técnico</option>
          {tecnicos.map((x) => <option key={x.id} value={x.id}>{x.nombre} ({carga(x, soportes)} activos)</option>)}
        </Campo>
        <Campo as="select" label="Prioridad" value={p} onChange={(e) => setP(e.target.value)}>
          {PRIORIDADES.map((x) => <option key={x}>{x}</option>)}
        </Campo>
        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" disabled={!t || busy}>Confirmar asignación</button>
        </div>
      </form>
    </Modal>
  );
}

export function Asignacion({ soportes, tecnicos, asignar }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState("");
  const [sel, setSel] = useState(null);
  const items = soportes
    .filter((s) => !s.tecnico_id && activo(s) && (!f || s.prioridad === f) &&
      `${s.titulo} ${s.creador?.nombre || ""}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => PRIORIDADES.indexOf(b.prioridad) - PRIORIDADES.indexOf(a.prioridad) || new Date(a.created_at) - new Date(b.created_at));

  return (
    <section className="panel">
      <div className="d-flex flex-wrap gap-2 p-3 border-bottom">
        <label className="buscar flex-grow-1">
          <Icon name="search" size={18} />
          <input className="form-control" placeholder="Buscar por título o solicitante" value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <select className="form-select w-auto" aria-label="Filtrar por prioridad" value={f} onChange={(e) => setF(e.target.value)}>
          <option value="">Todas las prioridades</option>{PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
        </select>
      </div>
      {items.length ? <Lista items={items} asignar={setSel} /> : (
        <Vacio icono="inbox" titulo="No hay soportes por asignar" texto="Todos los soportes abiertos ya tienen un técnico responsable." />
      )}
      {sel && (
        <AsignarModal s={sel} tecnicos={tecnicos} soportes={soportes} onClose={() => setSel(null)}
          onOk={async (...a) => { const ok = await asignar(...a); if (ok) setSel(null); return ok; }} />
      )}
    </section>
  );
}

export function Tecnicos({ soportes, tecnicos }) {
  const [q, setQ] = useState("");
  const lista = tecnicos.filter((t) => `${t.nombre} ${t.email} ${t.documento}`.toLowerCase().includes(q.toLowerCase()));
  const libres = tecnicos.filter((t) => carga(t, soportes) < LIMITE).length;

  return (
    <>
      <p className="text-secondary">{tecnicos.length} técnicos registrados, {libres} disponibles para asignación.</p>
      <label className="buscar mb-3">
        <Icon name="search" size={18} />
        <input className="form-control" placeholder="Buscar por nombre, correo o documento" value={q} onChange={(e) => setQ(e.target.value)} />
      </label>
      {lista.length ? (
        <div className="row g-3">
          {lista.map((t) => {
            const n = carga(t, soportes);
            const alta = n >= LIMITE;
            return (
              <div className="col-12 col-md-6 col-xl-4" key={t.id}>
                <article className="panel p-3 h-100">
                  <div className="d-flex align-items-center gap-3 mb-3">
                    <span className="avatar">{iniciales(t.nombre)}</span>
                    <div className="min-w-0"><strong className="d-block text-truncate">{t.nombre}</strong><small className="text-secondary d-block text-truncate">{t.email}</small></div>
                  </div>
                  <dl className="datos">
                    <dt>Documento</dt><dd>{t.documento}</dd>
                    <dt>Resueltos</dt><dd>{soportes.filter((s) => s.tecnico_id === t.id && !activo(s)).length}</dd>
                  </dl>
                  <div className="d-flex justify-content-between small mb-1">
                    <span>{n} activos</span>
                    <span className={alta ? "text-danger fw-semibold" : "text-success"}>{alta ? "Carga alta" : "Disponible"}</span>
                  </div>
                  <div className="progress" style={{ height: 6 }}>
                    <div className={`progress-bar ${alta ? "bg-danger" : ""}`} style={{ width: `${Math.min(100, n * 20)}%` }} />
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      ) : <Vacio icono="search" titulo="No encontramos técnicos" texto="Prueba con otro nombre, correo o documento." />}
    </>
  );
}
