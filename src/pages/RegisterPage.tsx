
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useIsMobile } from "@/hooks/use-mobile";

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const isMobile = useIsMobile();
  
  // Register form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Password validation
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | ''>('');
  
  const checkPasswordStrength = (pass: string) => {
    if (!pass) {
      setPasswordStrength('');
      return;
    }
    
    // Basic password strength check
    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /\d/.test(pass);
    const hasSpecial = /[^a-zA-Z0-9]/.test(pass);
    const isLongEnough = pass.length >= 8;
    
    const score = [hasLetters, hasNumbers, hasSpecial, isLongEnough].filter(Boolean).length;
    
    if (score <= 2) setPasswordStrength('weak');
    else if (score === 3) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError("");
    
    // Validation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (!agreeTerms) {
      setError("You must agree to the terms of service");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    setIsLoading(true);

    try {
      const { error: authError } = await signUp(email, password, firstName, lastName);
      
      if (authError) {
        throw new Error(authError.message || "Registration failed");
      }
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. You can now log in.",
      });
      navigate("/login");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
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
              <CardTitle className="font-playfair text-2xl dark:text-white">Create an Account</CardTitle>
              <CardDescription className="dark:text-gray-300">
                Join HotelEase to share your hotel experiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleRegister}>
                <div className="space-y-4">
                  <div className={isMobile ? "space-y-4" : "grid grid-cols-2 gap-4"}>
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="dark:text-gray-200">First Name</Label>
                      <Input 
                        id="first-name" 
                        placeholder="John" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="dark:text-gray-200">Last Name</Label>
                      <Input 
                        id="last-name" 
                        placeholder="Doe" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        required 
                      />
                    </div>
                  </div>
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
                    <Label htmlFor="password" className="dark:text-gray-200">
                      Password
                      {passwordStrength && (
                        <span className={
                          `ml-2 text-xs ${
                            passwordStrength === 'weak' ? 'text-red-500' : 
                            passwordStrength === 'medium' ? 'text-yellow-500' : 
                            'text-green-500'
                          }`
                        }>
                          ({passwordStrength})
                        </span>
                      )}
                    </Label>
                    <Input 
                      id="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        checkPasswordStrength(e.target.value);
                      }}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required 
                    />
                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="dark:text-gray-200">Confirm Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required 
                    />
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox 
                      id="terms" 
                      className="mt-1 dark:border-gray-600" 
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-tight peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300"
                    >
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline dark:text-blue-300">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline dark:text-blue-300">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-hotel-navy hover:bg-hotel-navy/90" 
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <div className="text-sm dark:text-gray-300">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline dark:text-blue-300">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
