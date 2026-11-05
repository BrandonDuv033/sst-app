import { useState } from "react";
import { SENA_LOGO } from "../config/branding";

const P = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  clipboard: <><path d="M9 3h6a2 2 0 0 1 2 2v1h2v15H5V6h2V5a2 2 0 0 1 2-2Z" /><path d="M9 13h6M9 17h4" /></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  shield: <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  inbox: <><path d="M4 5h16l2 9v5H2v-5l2-9Z" /><path d="M2 14h6l2 3h4l2-3h6" /></>,
  arrow: <path d="m15 18-6-6 6-6" />,
  ticket: <><path d="M4 4h16v5a3 3 0 0 0 0 6v5H4v-5a3 3 0 0 0 0-6V4Z" /><path d="M12 7v2M12 13v2M12 19v1" /></>,
};

export const Icon = ({ name, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {P[name]}
  </svg>
);

export const SstLogo = () => (
  <div className="d-flex align-items-center gap-2 text-white">
    <span className="sst-mark">S</span>
    <div className="lh-sm">
      <strong className="d-block">SST</strong>
      <small className="opacity-75">Gestión de Soportes TIC</small>
    </div>
  </div>
);

// Si todavía no existe public/img/sena-logo.png muestra un recuadro con el texto SENA.
export function SenaLogo({ size = SENA_LOGO.size }) {
  const [falla, setFalla] = useState(false);
  return (
    <div className="sena-logo" style={{ width: size, height: size }}>
      {falla ? <span>SENA</span> : (
        <img src={SENA_LOGO.src} alt="Logo del SENA" width={size} height={size}
          onError={() => setFalla(true)} />
      )}
    </div>
  );
}

export const Prioridad = ({ v }) => <span className={`badge-p p-${v.toLowerCase()}`}>{v}</span>;
export const Estado = ({ v }) => (
  <span className={`badge-e s-${v.toLowerCase().replace(" ", "-")}`}>{v}</span>
);

export const Campo = ({ label, as: T = "input", children, ...p }) => (
  <label className="d-block mb-3">
    <span className="form-label fw-semibold small">{label}</span>
    <T className={T === "select" ? "form-select" : "form-control"} {...p}>{children}</T>
  </label>
);

export const Modal = ({ titulo, onClose, children }) => (
  <>
    <div className="modal d-block" role="dialog" aria-modal="true" tabIndex="-1"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title h5">{titulo}</h2>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
    <div className="modal-backdrop show" />
  </>
);

export const Vacio = ({ icono, titulo, texto }) => (
  <div className="vacio">
    <span><Icon name={icono} size={26} /></span>
    <h3>{titulo}</h3>
    <p className="mb-0">{texto}</p>
  </div>
);
