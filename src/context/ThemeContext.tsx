
import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  systemPreference: Theme | null;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [systemPreference, setSystemPreference] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Function to safely get theme from localStorage
  const getSavedTheme = (): Theme | null => {
    try {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        return savedTheme;
      }
      return null;
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      return null;
    }
  };

  // Function to safely set theme in localStorage
  const saveTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("Error setting theme in localStorage:", error);
      toast({
        variant: "destructive",
        title: "Theme Preference Not Saved",
        description: "Could not save your theme preference. This setting will reset when you reload the page.",
      });
    }
  };

  // Initialize theme based on saved preference or system preference
  useEffect(() => {
    const initializeTheme = () => {
      try {
        setIsLoading(true);
        // Check local storage first
        const savedTheme = getSavedTheme();
        
        if (savedTheme) {
          setThemeState(savedTheme);
        } else {
          // Check system preference
          if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setThemeState("dark");
            setSystemPreference("dark");
          } else {
            setThemeState("light");
            setSystemPreference("light");
          }
        }
      } catch (error) {
        console.error("Error initializing theme:", error);
        // Default to light theme as fallback
        setThemeState("light");
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeTheme();
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? "dark" : "light");
      
      // Only update theme if user hasn't set a preference
      if (!getSavedTheme()) {
        setThemeState(e.matches ? "dark" : "light");
      }
    };
    
    // Add event listener with compatibility check
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else if ((mediaQuery as any).addListener) {
      // For older browsers
      (mediaQuery as any).addListener(handleChange);
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else if ((mediaQuery as any).removeListener) {
        (mediaQuery as any).removeListener(handleChange);
      }
    };
  }, []);

  // Apply theme class to document
  useEffect(() => {
    if (!isLoading) {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      // Save to localStorage
      saveTheme(theme);
    }
  }, [theme, isLoading]);

  const toggleTheme = () => {
    setThemeState(prevTheme => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      return newTheme;
    });
  };
  
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      setTheme,
      systemPreference,
      isLoading
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
