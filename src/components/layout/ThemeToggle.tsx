
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
          className="transition-colors duration-200"
        >
          {theme === "light" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleThemeChange("light")}>
          <Sun className="h-4 w-4 mr-2" />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
          <Moon className="h-4 w-4 mr-2" />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleThemeChange("system")}>
          <Monitor className="h-4 w-4 mr-2" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
