import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { SenaLogo, Campo } from "./ui";

function AuthLayout({ titulo, mensaje, ancho, children }) {
  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <section className="col-lg-5 auth-brand d-none d-lg-flex">
          <SenaLogo />
          <div>
            <h1>{titulo}</h1>
            <p>{mensaje}</p>
          </div>
          <small>Servicio Nacional de Aprendizaje - SENA</small>
        </section>
        <section className="col-lg-7 d-flex align-items-center justify-content-center py-5 px-3">
          <div className={`auth-card w-100 ${ancho ? "ancho" : ""}`}>
            <div className="d-lg-none mb-4">
              <SenaLogo size={56} />
            </div>
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}

const Enlace = ({ texto, accion, onClick }) => (
  <p className="text-center small text-secondary mt-4 mb-0">
    {texto}{" "}
    <button
      type="button"
      className="btn btn-link btn-sm p-0 align-baseline fw-semibold"
      onClick={onClick}
    >
      {accion}
    </button>
  </p>
);

export function Login({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [f, setF] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(f.email, f.password);
    } catch {
      setError("Correo o contraseña incorrectos.");
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      titulo="Gestión clara para mantener todo funcionando."
      mensaje="Registra, asigna y haz seguimiento a las solicitudes técnicas de tu centro de formación."
    >
      <p>BIENVENIDO</p>
      <h2>Inicia sesión</h2>
      <p className="text-secondary mb-4">
        Ingresa con tu cuenta institucional para continuar.
      </p>
      {error && (
        <div className="alert alert-danger py-2 small" role="alert">
          {error}
        </div>
      )}
      <form onSubmit={enviar}>
        <Campo
          label="Correo electrónico"
          type="email"
          placeholder="nombre@sena.edu.co"
          value={f.email}
          onChange={set("email")}
          required
        />
        <Campo
          label="Contraseña"
          type="password"
          placeholder="Tu contraseña"
          value={f.password}
          onChange={set("password")}
          required
        />
        <button className="btn btn-primary w-100 mt-2" disabled={busy}>
          {busy ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <Enlace
        texto="¿Aún no tienes cuenta?"
        accion="Regístrate aquí"
        onClick={onSwitchToRegister}
      />
    </AuthLayout>
  );
}

export function Register({ onSwitchToLogin }) {
  const { register } = useAuth();
  const [f, setF] = useState({
    documento: "",
    nombre: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const enviar = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const nuevo = await register(f);
      if (!nuevo) {
        setInfo("Cuenta creada. Confirma tu correo y luego inicia sesión.");
        setBusy(false);
      }
    } catch (err) {
      setError(
        err.message ||
          "No se pudo crear la cuenta. Revisa los datos e intenta de nuevo.",
      );
      setBusy(false);
    }
  };

  return (
    <AuthLayout
      ancho
      titulo="Un solo lugar para gestionar el soporte técnico."
      mensaje="Crea tu cuenta institucional y empieza a reportar solicitudes."
    >
      <h2>Crea tu cuenta</h2>
      <p className="text-secondary mb-4">
        Tu cuenta se crea como aprendiz. Si necesitas otro rol, un administrador
        te lo asigna.
      </p>
      {error && (
        <div className="alert alert-danger py-2 small" role="alert">
          {error}
        </div>
      )}
      {info && (
        <div className="alert alert-success py-2 small" role="status">
          {info}
        </div>
      )}
      <form onSubmit={enviar}>
        <div className="row">
          <div className="col-sm-6">
            <Campo
              label="Documento"
              placeholder="Número de documento"
              value={f.documento}
              onChange={set("documento")}
              required
            />
          </div>
          <div className="col-sm-6">
            <Campo
              label="Nombre completo"
              placeholder="Nombres y apellidos"
              value={f.nombre}
              onChange={set("nombre")}
              required
            />
          </div>
        </div>
        <Campo
          label="Correo electrónico"
          type="email"
          placeholder="nombre@sena.edu.co"
          value={f.email}
          onChange={set("email")}
          required
        />
        <Campo
          label="Contraseña"
          type="password"
          placeholder="Mínimo 8 caracteres"
          minLength={8}
          value={f.password}
          onChange={set("password")}
          required
        />
        <button className="btn btn-primary w-100 mt-2" disabled={busy}>
          {busy ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>
      <Enlace
        texto="¿Ya tienes una cuenta?"
        accion="Inicia sesión"
        onClick={onSwitchToLogin}
      />
    </AuthLayout>
  );
}
