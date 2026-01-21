import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Bell, User, Activity, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'Manager':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'Admin':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Safety Officer':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
          <Shield className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Smart Industrial Safety Monitor</h1>
          <p className="text-xs text-muted-foreground">24/7 CCTV Surveillance & PPE Compliance</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* System Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 rounded-full">
          <Activity className="w-4 h-4 text-success animate-pulse-slow" />
          <span className="text-sm font-medium text-success">System Online</span>
        </div>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="relative">
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Sun className="w-5 h-5 text-muted-foreground" />
          )}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getRoleBadgeColor(user?.role || '')}`}>
                  {user?.role}
                </Badge>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/settings')}>
              <User className="w-4 h-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive" onClick={logout}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
