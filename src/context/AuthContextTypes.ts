
import { Session, User } from "@supabase/supabase-js";

export type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
  adminSignIn: (email: string, password: string) => Promise<{ error: any | null }>;
};
