import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  UserPlus,
  Moon,
  Sun,
  Save,
  Eye,
  EyeOff,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // New user form state
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole | ''>('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserPassword || !newUserRole) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields to create a new user.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreatingUser(true);

    // Simulate user creation
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: 'User Created',
      description: `New ${newUserRole} account created for ${newUserEmail}`,
    });

    // Reset form
    setNewUserEmail('');
    setNewUserPassword('');
    setNewUserRole('');
    setIsCreatingUser(false);
  };

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
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account and system preferences</p>
      </div>

      {/* Section 1: My Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            My Account
          </CardTitle>
          <CardDescription>View your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Role</Label>
              <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                <Badge variant="outline" className={getRoleBadgeColor(user?.role || '')}>
                  {user?.role || 'N/A'}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">User Name</Label>
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="font-medium text-foreground">{user?.name || 'N/A'}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground">Password</Label>
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="font-mono text-foreground tracking-widest">••••••••</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section 2: Add New User */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            Add New User
          </CardTitle>
          <CardDescription>Create a new user account with role-based access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newUserRole">Role</Label>
            <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Safety Officer">Safety Officer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newUserEmail">Email ID</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="newUserEmail"
                type="email"
                placeholder="Enter email address"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newUserPassword">Password</Label>
            <div className="relative">
              <Input
                id="newUserPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Create password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button 
            onClick={handleCreateUser} 
            className="w-full sm:w-auto"
            disabled={isCreatingUser || !newUserEmail || !newUserPassword || !newUserRole}
          >
            {isCreatingUser ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Create User
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Section 3: Theme Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {theme === 'light' ? (
              <Sun className="w-5 h-5 text-primary" />
            ) : (
              <Moon className="w-5 h-5 text-primary" />
            )}
            Theme Mode
          </CardTitle>
          <CardDescription>Toggle between light and dark mode</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-foreground">Light</span>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
              <div className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-foreground">Dark</span>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-primary">
              {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
