import { useCallback, useEffect, useState } from "react";
import { soporteService } from "../services/soporteService";
import { authService } from "../services/authService";
import { isJefe } from "../utils";

export function useSoportes(user) {
  const [soportes, setSoportes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const recargar = useCallback(async () => {
    try {
      const [s, t] = await Promise.all([
        soporteService.obtenerSoportes(user),
        isJefe(user) ? authService.obtenerTecnicos() : [],
      ]);
      setSoportes(s);
      setTecnicos(t);
      setError("");
    } catch (e) {
      setError(e.message || "No se pudieron cargar los soportes");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { soportes, tecnicos, loading, error, recargar };
}
