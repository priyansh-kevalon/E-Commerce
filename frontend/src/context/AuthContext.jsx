import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  AUTH_TOKEN_KEY,
  fetchCurrentUser,
  loginUser,
  registerUser,
} from '../services/authService.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY));
  const [initializing, setInitializing] = useState(true);

  // Restore the session from a stored token on first load.
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
      if (!storedToken) {
        setInitializing(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
        setToken(storedToken);
      } catch (err) {
        // Only discard the token when the server rejects it (401). On a
        // transient network failure keep it so the session can recover later.
        if (err?.status === 401) {
          localStorage.removeItem(AUTH_TOKEN_KEY);
          setToken(null);
        }
        setUser(null);
      } finally {
        setInitializing(false);
      }
    };

    restoreSession();
  }, []);

  // The API layer emits this when an authenticated request is rejected.
  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      setToken(null);
      setUser(null);
    };

    window.addEventListener('velmora:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('velmora:unauthorized', handleUnauthorized);
  }, []);

  const applyAuth = useCallback((payload) => {
    localStorage.setItem(AUTH_TOKEN_KEY, payload.token);
    setToken(payload.token);
    setUser(payload.user);
    return payload.user;
  }, []);

  const login = useCallback(
    async (credentials) => applyAuth(await loginUser(credentials)),
    [applyAuth]
  );

  const register = useCallback(
    async (payload) => applyAuth(await registerUser(payload)),
    [applyAuth]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Keep the cached user in sync after a profile update.
  const updateUser = useCallback((nextUser) => {
    setUser((prev) => ({ ...prev, ...nextUser }));
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
      updateUser,
    }),
    [user, token, initializing, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
