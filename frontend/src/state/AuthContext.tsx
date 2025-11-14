import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_BASE = (import.meta as any)?.env?.VITE_API_BASE ?? "/api";

type User = {
  id: number | string;
  displayName: string;
  email: string;
  createdAt?: string;
  geo?: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (displayName: string, email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  logout: () => void;
  authedJsonFetch: <T,>(path: string, opts?: RequestInit) => Promise<T>;
  refreshMe: () => Promise<void>;
};

async function jsonFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(opts.headers ?? {}) },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `${res.status} ${res.statusText}`);
  }

  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

type AuthResponse = { token: string; user: User };

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // ⭐ Stable headers — NOT a function anymore
  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  // ⭐ Stable authed fetch — no re-renders unless token changes
  const authedJsonFetch = useCallback(
    async <T,>(path: string, opts: RequestInit = {}) => {
      const finalOpts: RequestInit = {
        ...opts,
        headers: {
          "Content-Type": "application/json",
          ...(opts.headers ?? {}),
          ...authHeaders,
        },
        body: opts.body
          ? typeof opts.body === "string"
            ? opts.body
            : JSON.stringify(opts.body)
          : undefined,
      };

      return jsonFetch<T>(path, finalOpts);
    },
    [authHeaders]
  );

  // ⭐ refreshMe stable
  const refreshMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const me = await authedJsonFetch<User>("/auth/me", { method: "GET" });
      setUser(me);
    } catch {
      setToken(null);
      setUser(null);
    }
  }, [token, authedJsonFetch]);

  // ⭐ Initial load — runs ONLY when token changes
  useEffect(() => {
    let alive = true;

    (async () => {
      setIsLoading(true);
      await refreshMe();
      if (alive) setIsLoading(false);
    })();

    return () => {
      alive = false;
    };
  }, [token, refreshMe]);

  // AUTH ACTIONS
  const login = useCallback(async (email: string, password: string) => {
    const res = await jsonFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    setToken(res.token);
    setUser(res.user);
  }, []);

  const signup = useCallback(
    async (displayName: string, email: string, password: string) => {
      const res = await jsonFetch<AuthResponse>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ displayName, email, password }),
      });

      setToken(res.token);
      setUser(res.user);
    },
    []
  );

  const forgotPassword = useCallback(async (email: string) => {
    await jsonFetch<void>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  }, []);

  const resetPassword = useCallback(
    async (resetToken: string, newPassword: string) => {
      await jsonFetch<void>("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token: resetToken, password: newPassword }),
      });
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isLoading,
      login,
      signup,
      forgotPassword,
      resetPassword,
      logout,
      authedJsonFetch,
      refreshMe,
    }),
    [
      user,
      token,
      isLoading,
      login,
      signup,
      forgotPassword,
      resetPassword,
      logout,
      authedJsonFetch,
      refreshMe,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
