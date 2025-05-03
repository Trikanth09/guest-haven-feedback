
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Shield, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const navigate = useNavigate();
  const { adminSignIn } = useAuth();
  const { toast } = useToast();
  
  const MAX_LOGIN_ATTEMPTS = 5;
  const isLocked = loginAttempts >= MAX_LOGIN_ATTEMPTS;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError("Too many login attempts. Please try again later.");
      return;
    }
    
    setError("");
    setIsLoading(true);

    try {
      const { error: authError } = await adminSignIn(email, password);
      
      if (authError) {
        setLoginAttempts(prev => prev + 1);
        
        if (loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS) {
          throw new Error("Account temporarily locked due to too many failed attempts");
        } else {
          throw new Error(authError.message || "Authentication failed");
        }
      }
      
      // Reset attempts on successful login
      setLoginAttempts(0);
      
      // Navigate to admin dashboard
      navigate("/admin/dashboard");
    } catch (err: any) {
      console.error("Admin login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-custom section-padding fade-in">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-2 rounded-full w-12 h-12 flex items-center justify-center mb-2 dark:bg-blue-900/30">
                <Shield className="h-6 w-6 text-primary dark:text-blue-400" />
              </div>
              <CardTitle className="font-playfair text-2xl dark:text-white">Admin Login</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Access the administration dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {isLocked ? (
                <div className="text-center py-4">
                  <Shield className="h-12 w-12 text-destructive mx-auto mb-2" />
                  <h3 className="text-lg font-bold mb-2 dark:text-white">Account Temporarily Locked</h3>
                  <p className="text-muted-foreground dark:text-gray-400">
                    Too many failed login attempts. Please try again later or contact support.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="admin@example.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="dark:text-gray-200">Password</Label>
                      <Input 
                        id="password" 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required 
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-hotel-navy hover:bg-hotel-navy/90" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Authenticating..." : "Login as Admin"}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
            <CardFooter className="text-center text-sm text-muted-foreground dark:text-gray-400">
              This area is restricted to authorized personnel only.
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
