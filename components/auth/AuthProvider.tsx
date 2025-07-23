"use client";

import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { Session, AuthError } from "@supabase/supabase-js";

// Type for the context
type AuthContextType = {
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// Create context with default null
const AuthContext = createContext<AuthContextType | null>(null);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    setSession(data.session);
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    setSession(null);
  };

  // Load session and subscribe to changes
  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (isMounted) setSession(session);
      }
    );

    return () => {
      isMounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to access auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
