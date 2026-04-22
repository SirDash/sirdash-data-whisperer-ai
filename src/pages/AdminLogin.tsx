import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { isAdmin } from "@/lib/authUtils";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Mail, Lock, ShieldCheck } from "lucide-react";

const adminLoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type AdminLoginValues = z.infer<typeof adminLoginSchema>;

const AdminLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: AdminLoginValues) => {
    setIsSubmitting(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      if (!isAdmin(authData.user)) {
        await supabase.auth.signOut();
        toast({
          title: "Access denied",
          description: "This account does not have admin privileges.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome back",
        description: "Signed in as administrator.",
      });
      navigate("/admin/dashboard");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Invalid credentials";
      toast({
        title: "Sign-in failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative flex flex-col justify-center flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="absolute top-6 left-4 sm:left-6 lg:left-8 inline-flex items-center gap-1.5 text-sm font-medium text-sirdash-600 hover:text-sirdash-500"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Home
        </Link>

        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center">
            <a href="/" className="flex justify-center">
              <img
                src="/lovable-uploads/36980bbb-084d-4771-ad2a-8202c6f6b624.png"
                alt="SirDash Logo"
                className="h-16 w-auto"
              />
            </a>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              Admin Portal
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Restricted to authorized administrators only
            </p>
          </div>

          <div className="mt-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input
                            placeholder="Enter your email"
                            autoComplete="email"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-sirdash-500 hover:bg-sirdash-600 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Sign in to Admin
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <div className="relative flex-1 hidden w-0 lg:block">
        <div className="absolute inset-0 bg-gradient-to-r from-sirdash-500 to-sirdash-700">
          <div className="flex flex-col items-center justify-center h-full p-12 text-white">
            <ShieldCheck className="h-14 w-14 mb-6 text-white/80" />
            <h2 className="text-4xl font-bold mb-6">Admin Access</h2>
            <p className="text-xl mb-8 max-w-md text-center">
              Manage and monitor the SirDash platform from one place
            </p>
            <div className="w-full max-w-md bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-xl">
              <p className="mb-4 text-lg font-medium">As an admin you can:</p>
              <ul className="space-y-2">
                {[
                  "View and manage all user accounts",
                  "Monitor platform usage and analytics",
                  "Configure system-wide settings",
                ].map((item) => (
                  <li key={item} className="flex items-start">
                    <svg
                      className="h-6 w-6 mr-2 text-sirdash-200 flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
