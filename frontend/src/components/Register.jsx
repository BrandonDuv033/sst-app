import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export const Register = ({ onSwitchToLogin }) => {
  const [documento, setDocumento] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("Tecnico");
  const [error, setError] = useState("");

  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await register({
        documento,
        nombre,
        email,
        password,
        rol,
      });
    } catch (err) {
      setError("Error al registrar usuario. Verifique los datos.");
    }
  };

  return (
    <div className="auth-card">
      <h2>Registro de Usuario</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Documento:</label>
          <input
            type="text"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Nombre Completo:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

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

        <div className="form-group">
          <label>Rol en el Sistema:</label>
          <select value={rol} onChange={(e) => setRol(e.target.value)}>
            <option value="Tecnico">Técnico de Soporte</option>
            <option value="Coordinador">Coordinador</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">
          Registrarse
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "15px" }}>
        ¿Ya tienes cuenta?{" "}
        <button type="button" className="link-btn" onClick={onSwitchToLogin}>
          Inicia sesión
        </button>
      </p>
    </div>
  );
};
