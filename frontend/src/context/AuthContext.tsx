import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthResponse, User } from '../features/auth/types';
import { getCurrentUser, logoutApi } from '../features/auth/api/authApi';
import { clearSession, getSession, saveSession } from '../services/authStorage';

interface AuthContextType {
  user: User | null;
  ready: boolean;
  isAuthenticated: boolean;
  login: (session: AuthResponse, remember: boolean) => void;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    const restore = async () => {
      const session = getSession();
      if (!session) { setUser(null); setExpiresAt(null); setReady(true); return; }
      try {
        const current = await getCurrentUser();
        if (active && getSession()?.token === session.token) { setUser(current); setExpiresAt(session.expiresAt); }
      } catch { if (active && getSession()?.token === session.token) { clearSession(); setUser(null); setExpiresAt(null); } }
      finally { if (active) setReady(true); }
    };
    const expired = () => { setUser(null); setExpiresAt(null); };
    void restore();
    window.addEventListener('storage', restore);
    window.addEventListener('cinema:session-expired', expired);
    return () => { active = false; window.removeEventListener('storage', restore); window.removeEventListener('cinema:session-expired', expired); };
  }, []);
  useEffect(() => {
    if (!expiresAt) return;
    const timer = window.setTimeout(() => { clearSession(); setUser(null); setExpiresAt(null); }, Math.max(0, Date.parse(expiresAt) - Date.now()));
    return () => window.clearTimeout(timer);
  }, [expiresAt]);
  const login = (session: AuthResponse, remember: boolean) => {
    saveSession(session, remember); setUser(session.user); setExpiresAt(session.expiresAt); setReady(true);
  };
  const logout = async () => {
    try { await logoutApi(); }
    finally { clearSession(); setUser(null); setExpiresAt(null); }
  };
  return <AuthContext.Provider value={{ user, ready, isAuthenticated: !!user, login, logout }}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
