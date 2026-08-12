'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase/client';

type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  authState: AuthState;
  authError: string | null;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  authState: 'loading',
  authError: null,
  signOut: async () => {},
  refreshSession: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [authState, setAuthState] = useState<AuthState>('loading');
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const finishAuth = (nextSession: Session | null, error?: unknown) => {
      if (!mounted) return;
      setSession(nextSession);
      setAuthError(error instanceof Error ? error.message : null);
      setAuthState(error || !nextSession ? 'unauthenticated' : 'authenticated');
    };
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Authentication is taking too long to initialize.')), 10000));
    Promise.race([supabase.auth.getSession(), timeout]).then(({ data, error }) => finishAuth(error ? null : data.session, error)).catch((error) => finishAuth(null, error));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setAuthError(null);
      setAuthState(nextSession ? 'authenticated' : 'unauthenticated');
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setSession(null);
    setAuthState('unauthenticated');
  }, []);

  const refreshSession = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();
    setSession(error ? null : data.session);
    setAuthError(error ? error.message : null);
    setAuthState(error || !data.session ? 'unauthenticated' : 'authenticated');
  }, []);

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, authState, authError, signOut, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
