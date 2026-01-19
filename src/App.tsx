import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import MainLayout from "@/components/layout/MainLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Cameras from "@/pages/Cameras";
import Alerts from "@/pages/Alerts";
import Reports from "@/pages/Reports";
import Footage from "@/pages/Footage";
import Settings from "@/pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cameras" element={<Cameras />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/footage" element={<Footage />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
