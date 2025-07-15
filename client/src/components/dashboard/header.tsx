import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, RefreshCw, Server, Settings } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";

export function DashboardHeader() {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Server className="text-white text-sm" size={16} />
              </div>
              <h1 className="text-xl font-semibold">Proxmox Monitor</h1>
            </div>
          </Link>
          
          <nav className="flex space-x-4">
            <Link href="/">
              <Button 
                variant={location === "/" ? "default" : "ghost"} 
                size="sm"
                className="text-sm"
              >
                Dashboard
              </Button>
            </Link>
            <Link href="/servers">
              <Button 
                variant={location === "/servers" ? "default" : "ghost"} 
                size="sm"
                className="text-sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Servers
              </Button>
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button 
            onClick={handleRefresh}
            className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white"
          >
            <RefreshCw className="mr-2" size={16} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <div className="w-8 h-8 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
        </div>
      </div>
    </header>
  );
}
