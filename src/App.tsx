import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Sandbox from "./pages/Sandbox";
import Waitlist from "./pages/Waitlist";
import ComingSoon from "./pages/ComingSoon";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";
import AdminUpdates from "./pages/AdminUpdates";
import AdminCreateUpdate from "./pages/AdminCreateUpdate";
import AdminEditUpdate from "./pages/AdminEditUpdate";
import AdminLayout from "./components/AdminLayout";
import AdminRoute from "./components/AdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/sandbox" element={<Sandbox />} />
          <Route path="/waitlist" element={<Waitlist />} />
          <Route path="/coming-soon" element={<ComingSoon />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="updates" replace />} />
            <Route path="updates" element={<AdminUpdates />} />
            <Route path="updates/create" element={<AdminCreateUpdate />} />
            <Route path="updates/edit/:id" element={<AdminEditUpdate />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
