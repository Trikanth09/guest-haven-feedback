
import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "./AuthContextTypes";
import { useAuthService } from "@/hooks/useAuthService";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    setUser,
    session,
    setSession,
    loading,
    setLoading,
    isAdmin,
    setIsAdmin,
    checkAdminRole,
    signUp,
    signIn,
    adminSignIn,
    signOut,
  } = useAuthService();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check admin role when auth state changes, but avoid another infinite loop
        // by using setTimeout to move this check out of the synchronous flow
        if (currentSession?.user) {
          setTimeout(() => {
            checkAdminRole(currentSession.user.id);
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        // Check admin role on initial load
        if (data.session?.user) {
          await checkAdminRole(data.session.user.id);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
      } finally {
        // Always set loading to false even if there was an error
        setLoading(false);
      }
    };
    
    initAuth();
    
    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      signIn, 
      signUp, 
      signOut, 
      loading, 
      isAdmin, 
      adminSignIn 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
