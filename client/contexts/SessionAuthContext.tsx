import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../../vendor/cms-core/client/lib/supabase';

interface SessionAuthContextType {
  isSessionActive: boolean;
  isLoading: boolean;
  setSessionActive: () => void;
  clearSession: () => void;
}

const SessionAuthContext = createContext<SessionAuthContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'session_authenticated';

export function SessionAuthProvider({ children }: { children: React.ReactNode }) {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Check if sessionStorage has active session flag
        const hasSessionFlag = sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true';
        
        // Verify Supabase session is still valid
        const { data } = await supabase.auth.getSession();
        const hasValidSupabaseSession = !!data?.session;

        // Both conditions must be true: session flag AND valid Supabase session
        const isActive = hasSessionFlag && hasValidSupabaseSession;
        setIsSessionActive(isActive);
      } catch (error) {
        console.error('Error checking session:', error);
        setIsSessionActive(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const setSessionActiveInStorage = () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    setIsSessionActive(true);
  };

  const clearSessionFromStorage = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setIsSessionActive(false);
  };

  const value: SessionAuthContextType = {
    isSessionActive,
    isLoading,
    setSessionActive: setSessionActiveInStorage,
    clearSession: clearSessionFromStorage,
  };

  return (
    <SessionAuthContext.Provider value={value}>
      {children}
    </SessionAuthContext.Provider>
  );
}

export function useSessionAuth() {
  const context = useContext(SessionAuthContext);
  if (context === undefined) {
    throw new Error('useSessionAuth must be used within SessionAuthProvider');
  }
  return context;
}
