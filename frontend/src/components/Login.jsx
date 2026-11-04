import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const Login = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      await login(email, password);
    } catch (err) {
      setError("Correo o contraseña incorrectos");
    }
  };

  return (
    <div className="auth-card">
      <h2>Iniciar Sesión - Soportes TIC</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Correo Electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Entrar
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "15px" }}>
        ¿No tienes cuenta?{" "}
        <button type="button" className="link-btn" onClick={onSwitchToRegister}>
          Regístrate aquí
        </button>
      </p>
    </div>
  );
};
