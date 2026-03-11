import { createContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMe().then((res) => {
      if (res.success) {
        setUser(res.data);
      }
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success) {
      setUser(res.data);
    }
    return res;
  };

  const register = async (email, password) => {
    const res = await api.register(email, password);
    return res;
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
