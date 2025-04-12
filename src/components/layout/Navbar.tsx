
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, isAdmin } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/hotels" },
    { name: "Submit Feedback", path: "/feedback" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white dark:bg-hotel-charcoal shadow-sm py-4 sticky top-0 z-50 transition-colors duration-300">
      <div className="container-custom flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="text-2xl font-playfair font-bold bg-gradient-to-r from-hotel-navy to-hotel-softblue bg-clip-text text-transparent dark:from-hotel-gold dark:to-hotel-softblue">
            GuestHaven
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary dark:hover:text-hotel-gold ${
                  isActive(link.path)
                    ? "text-primary dark:text-hotel-gold border-b-2 border-hotel-gold"
                    : "text-muted-foreground dark:text-gray-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary dark:hover:text-hotel-gold flex items-center ${
                  isActive("/admin/dashboard")
                    ? "text-primary dark:text-hotel-gold border-b-2 border-hotel-gold"
                    : "text-muted-foreground dark:text-gray-300"
                }`}
              >
                <Shield className="w-4 h-4 mr-1" />
                Admin
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground dark:text-gray-300 hidden sm:block">
                  {user.email}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="dark:border-gray-600 dark:hover:bg-gray-700">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">
                    Register
                  </Button>
                </Link>
                <Link to="/admin/login">
                  <Button variant="outline" size="sm" className="flex items-center space-x-1 dark:border-gray-600 dark:hover:bg-gray-700">
                    <Shield size={16} />
                    <span>Admin</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <button
            className="text-muted-foreground dark:text-gray-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-3 space-y-3 bg-background dark:bg-hotel-charcoal border-t dark:border-gray-800">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block py-2 text-sm font-medium ${
                isActive(link.path)
                  ? "text-primary dark:text-hotel-gold"
                  : "text-muted-foreground dark:text-gray-300"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className={`block py-2 text-sm font-medium flex items-center ${
                isActive("/admin/dashboard")
                  ? "text-primary dark:text-hotel-gold"
                  : "text-muted-foreground dark:text-gray-300"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Shield className="w-4 h-4 mr-1" />
              Admin Dashboard
            </Link>
          )}
          
          <div className="flex flex-col space-y-2 pt-2 border-t dark:border-gray-800">
            {user ? (
              <>
                <div className="text-sm text-muted-foreground dark:text-gray-300 py-2">
                  {user.email}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center justify-center space-x-2 dark:border-gray-600 dark:hover:bg-gray-700"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full dark:border-gray-600 dark:hover:bg-gray-700">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="default" size="sm" className="w-full">
                    Register
                  </Button>
                </Link>
                <Link to="/admin/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-1 dark:border-gray-600 dark:hover:bg-gray-700">
                    <Shield size={16} />
                    <span>Admin</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
