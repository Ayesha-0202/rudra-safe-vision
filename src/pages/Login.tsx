import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Shield, Mail, Lock, ArrowRight, UserCog } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!role) {
      toast({
        title: 'Role Required',
        description: 'Please select your role before logging in.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(emailId, password, role);
      if (success) {
        toast({
          title: 'Welcome back!',
          description: `Successfully logged in as ${role}.`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Authentication Failed',
          description: 'Please check your credentials and try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
              <Shield className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold text-primary-foreground mb-4">
            Rudhra Safe Vision
          </h1>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            24/7 CCTV surveillance and real-time PPE compliance monitoring for industrial safety management.
          </p>
          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="w-2 h-2 bg-primary-foreground rounded-full" />
              <span>Real-time violation detection</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="w-2 h-2 bg-primary-foreground rounded-full" />
              <span>Multi-camera monitoring</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="w-2 h-2 bg-primary-foreground rounded-full" />
              <span>Comprehensive compliance reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Rudhra Safe Vision</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to access the monitoring system</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-foreground">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger className="h-12">
                  <div className="flex items-center gap-2">
                    <UserCog className="w-5 h-5 text-muted-foreground" />
                    <SelectValue placeholder="Select your role" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Safety Officer">Safety Officer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailId" className="text-sm font-medium text-foreground">
                Email ID
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="emailId"
                  type="email"
                  placeholder="Enter your email address"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  className="pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                  required
                  minLength={4}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={isLoading || !role}
            >
              {isLoading ? (
                'Signing in...'
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
                onClick={() => {
                  toast({
                    title: 'Password Reset',
                    description: 'Please contact your system administrator to reset your password.',
                  });
                }}
              >
                Forgot Password?
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Protected system. Authorized personnel only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
