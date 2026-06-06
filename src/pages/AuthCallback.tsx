import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { isAdmin } from "@/lib/authUtils";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    let cancelled = false;

    const finish = async () => {
      const { error: initError } = await supabase.auth.initialize();
      if (cancelled) return;

      if (initError) {
        toast({
          title: "Sign-in failed",
          description: initError.message,
          variant: "destructive",
        });
        navigate("/login", { replace: true });
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (cancelled) return;

      if (session) {
        toast({
          title: "Sign-in successful",
          description: "Welcome back!",
        });
        navigate(isAdmin(session.user) ? "/admin/dashboard" : "/coming-soon", { replace: true });
        return;
      }

      toast({
        title: "Sign-in failed",
        description: "Could not complete sign-in. Please try again.",
        variant: "destructive",
      });
      navigate("/login", { replace: true });
    };

    void finish();

    return () => {
      cancelled = true;
    };
  }, [navigate, toast]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-sirdash-500 border-t-transparent" />
        <p className="text-gray-600 dark:text-gray-400">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
