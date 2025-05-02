
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const { toast } = useToast();

  // Get redirect URL from query params or use default
  const from = new URLSearchParams(location.search).get("from") || "/feedback";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { error: authError } = await signIn(email, password);
      
      if (authError) {
        throw new Error(authError.message || "Authentication failed");
      }
      
      // Success notification
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      
      // Navigate to requested page or default
      navigate(from);
    } catch (err: any) {
      console.error("Login error:", err);
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
            <CardHeader>
              <CardTitle className="font-playfair text-2xl dark:text-white">Welcome Back</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Login to your account to submit feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your.email@example.com" 
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
                    <div className="flex justify-end">
                      <Button variant="link" className="p-0 h-auto dark:text-blue-300">
                        Forgot Password?
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-hotel-navy hover:bg-hotel-navy/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm dark:text-gray-300">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline dark:text-blue-300">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
