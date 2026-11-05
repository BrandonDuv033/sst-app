import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    authService.sesionActual().then(setUser).catch(() => setUser(null)).finally(() => setCargando(false));
  }, []);

  const login = async (email, password) => setUser(await authService.login(email, password));

  const register = async (datos) => {
    const nuevo = await authService.registrarUsuario(datos);
    setUser(nuevo);
    return nuevo;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, cargando, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
