
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("guest");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API authentication
    setTimeout(() => {
      setIsLoading(false);
      
      // Navigate based on role
      if (activeTab === "guest") {
        toast({
          title: "Logged in successfully",
          description: "Welcome back to GuestHaven",
        });
        navigate("/feedback");
      } else {
        toast({
          title: "Admin login successful",
          description: "Welcome to your dashboard",
        });
        navigate("/admin/dashboard");
      }
    }, 1500);
  };

  return (
    <div className="container-custom section-padding fade-in">
      <div className="flex justify-center">
        <div className="w-full max-w-md">
          <Tabs defaultValue="guest" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="guest">Guest Login</TabsTrigger>
              <TabsTrigger value="admin">Hotel Admin</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guest">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl">Guest Login</CardTitle>
                  <CardDescription>
                    Sign in to submit feedback or check your past submissions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="guest-email">Email</Label>
                        <Input id="guest-email" type="email" placeholder="your.email@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="guest-password">Password</Label>
                          <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <Input id="guest-password" type="password" required />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember-me" />
                        <label
                          htmlFor="remember-me"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Remember me
                        </label>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-hotel-navy hover:bg-hotel-navy/90" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-sm text-center">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary hover:underline">
                      Create one
                    </Link>
                  </div>
                  <div className="text-xs text-center text-muted-foreground">
                    By signing in, you agree to our{" "}
                    <Link to="/terms" className="hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="hover:underline">
                      Privacy Policy
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="admin">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="font-playfair text-2xl">Hotel Admin Login</CardTitle>
                  <CardDescription>
                    Access your hotel's feedback dashboard and analytics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="admin-email">Email</Label>
                        <Input id="admin-email" type="email" placeholder="admin@hotelname.com" required />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="admin-password">Password</Label>
                          <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <Input id="admin-password" type="password" required />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember-admin" />
                        <label
                          htmlFor="remember-admin"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Remember me
                        </label>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-hotel-navy hover:bg-hotel-navy/90" 
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <div className="text-sm text-center">
                    Need an admin account?{" "}
                    <Link to="/contact" className="text-primary hover:underline">
                      Contact us
                    </Link>
                  </div>
                  <div className="text-xs text-center text-muted-foreground">
                    For hotel administration access only
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
