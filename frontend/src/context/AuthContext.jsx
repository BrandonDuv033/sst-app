import { createContext, useState, useContext } from "react";

import { authService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const loggedUser = await authService.login(email, password);

    setUser(loggedUser);
  };

  const register = async (userData) => {
    const newUser = await authService.registrarUsuario(userData);

    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
