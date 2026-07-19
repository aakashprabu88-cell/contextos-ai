"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { api } from "@/lib/api";
import type { User } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null, token: null, isLoading: true,
  login: async () => {}, register: async () => {}, logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = typeof window !== "undefined" ? localStorage.getItem("contextos_token") : null;
    const savedUser = typeof window !== "undefined" ? localStorage.getItem("contextos_user") : null;
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("contextos_token");
        localStorage.removeItem("contextos_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.login(email, password) as { access_token: string; user: User };
    setToken(response.access_token);
    setUser(response.user);
    localStorage.setItem("contextos_token", response.access_token);
    localStorage.setItem("contextos_user", JSON.stringify(response.user));
  }, []);

  const register = useCallback(async (email: string, name: string, password: string) => {
    const response = await api.register(email, name, password) as { access_token: string; user: User };
    setToken(response.access_token);
    setUser(response.user);
    localStorage.setItem("contextos_token", response.access_token);
    localStorage.setItem("contextos_user", JSON.stringify(response.user));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("contextos_token");
    localStorage.removeItem("contextos_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
