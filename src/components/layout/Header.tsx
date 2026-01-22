import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Extract username from email (prefix before @)
  const getDisplayName = (name: string | undefined) => {
    if (!name) return 'User';
    if (name.includes('@')) {
      return name.split('@')[0];
    }
    return name;
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

      <div className="flex items-center">
        {/* User Profile */}
        <Button 
          variant="ghost" 
          className="flex items-center gap-3 hover:bg-muted/50"
          onClick={() => navigate('/settings')}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">{getDisplayName(user?.name)}</p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        </Button>
      </div>
    </header>
  );
};

export default Header;
