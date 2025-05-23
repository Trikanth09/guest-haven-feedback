
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const ThemeToggle = () => {
  const { theme, toggleTheme, setTheme, systemPreference } = useTheme();
  const { toast } = useToast();

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    if (newTheme === "system") {
      setTheme(systemPreference || "light");
      toast({
        title: "System preference applied",
        description: `Theme set to ${systemPreference || "light"} mode based on your system.`,
      });
    } else {
      setTheme(newTheme);
      toast({
        title: "Theme changed",
        description: `Theme set to ${newTheme} mode.`,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Switch theme. Current theme: ${theme}`}
          className="transition-colors duration-200 text-hotel-navy dark:text-hotel-gold"
        >
          {theme === "light" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-hotel-softblue/20 dark:border-hotel-softblue/20">
        <DropdownMenuItem onClick={() => handleThemeChange("light")} className="hover:bg-hotel-cream dark:hover:bg-hotel-navy/60">
          <Sun className="h-4 w-4 mr-2 text-hotel-gold" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")} className="hover:bg-hotel-cream dark:hover:bg-hotel-navy/60">
          <Moon className="h-4 w-4 mr-2 text-hotel-gold" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")} className="hover:bg-hotel-cream dark:hover:bg-hotel-navy/60">
          <Monitor className="h-4 w-4 mr-2 text-hotel-gold" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
