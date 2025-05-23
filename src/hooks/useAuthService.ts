
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export function useAuthService() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  // Check if user has admin role
  const checkAdminRole = async (userId: string) => {
    if (!userId) return false;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();
      
      if (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
        return false;
      }
      
      const hasAdminRole = !!data;
      setIsAdmin(hasAdminRole);
      return hasAdminRole;
    } catch (err) {
      console.error("Error in checkAdminRole:", err);
      setIsAdmin(false);
      return false;
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Registration Successful",
        description: "Please check your email to confirm your account.",
      });
      return { error: null };
    } catch (err: any) {
      toast({
        title: "Registration Failed",
        description: err.message,
        variant: "destructive",
      });
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      return { error: null };
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message,
        variant: "destructive",
      });
      return { error: err };
    }
  };
  
  const adminSignIn = async (email: string, password: string) => {
    try {
      // Exact string comparison with hardcoded credentials
      if (email === "trikanth09@gmail.com" && password === "Trikanth@09") {
        // Check if user exists in Supabase
        const { data: userResponse, error: userError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (userError) {
          // User doesn't exist in Supabase, create the admin account
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: "Admin",
                last_name: "User",
              }
            }
          });

          if (signUpError) {
            toast({
              title: "Admin Login Failed",
              description: "Could not create admin account: " + signUpError.message,
              variant: "destructive",
            });
            return { error: signUpError };
          }

          // Set admin status directly since we know this is the hardcoded admin
          setIsAdmin(true);
          setUser(signUpData.user);
          setSession(signUpData.session);

          toast({
            title: "Admin Login Successful",
            description: "Welcome to the admin panel!",
          });
          return { error: null };
        } else {
          // User exists, set admin status directly
          setIsAdmin(true);
          setUser(userResponse.user);
          setSession(userResponse.session);

          toast({
            title: "Admin Login Successful",
            description: "Welcome to the admin panel!",
          });
          return { error: null };
        }
      } else {
        // Credentials don't match
        toast({
          title: "Access Denied",
          description: "Invalid admin credentials",
          variant: "destructive",
        });
        return { error: new Error("Invalid admin credentials") };
      }
    } catch (err: any) {
      toast({
        title: "Admin Login Failed",
        description: err.message,
        variant: "destructive",
      });
      return { error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return {
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
  };
}
