import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { LogOut, List, Menu, PlusCircle } from "lucide-react";

export const AdminSidebarMobile = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    setMobileOpen(false);
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
    navigate("/login");
  };

  return (
    <div className="md:hidden">
      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <a href="/" className="flex min-w-0 items-center gap-2">
          <img
            src="/lovable-uploads/36980bbb-084d-4771-ad2a-8202c6f6b624.png"
            alt="SirDash Logo"
            className="h-7 w-auto shrink-0"
          />
          <span className="truncate text-sm font-semibold tracking-tight text-gray-800 dark:text-gray-100">
            SirDash AI
          </span>
        </a>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 text-gray-700 dark:text-gray-200"
          aria-expanded={mobileOpen}
          aria-controls="admin-mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          id="admin-mobile-menu"
          className="flex h-full w-[min(100vw,20rem)] flex-col gap-0 overflow-y-auto border-r border-gray-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-800 sm:max-w-sm"
        >
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="px-4 pt-4 sm:pt-5 pb-3 shrink-0">
              <a
                href="/"
                className="flex items-center gap-2 min-w-0"
                onClick={() => setMobileOpen(false)}
              >
                <img
                  src="/lovable-uploads/36980bbb-084d-4771-ad2a-8202c6f6b624.png"
                  alt="SirDash Logo"
                  className="h-7 w-auto shrink-0"
                />
                <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 tracking-tight truncate">
                  SirDash AI
                </span>
              </a>
            </div>

            <nav className="px-3 pb-2 shrink-0 flex flex-col gap-2" aria-label="Admin">
              <NavLink
                to="/admin/dashboard/updates/create"
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-center md:justify-start gap-2 w-full rounded-lg px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-sirdash-600 text-white shadow-sm"
                      : "bg-sirdash-500 text-white hover:bg-sirdash-600 shadow-sm"
                  }`
                }
              >
                <PlusCircle className="h-4 w-4 shrink-0" />
                <span className="text-center sm:text-left leading-tight">
                  Create<span className="hidden sm:inline"> New Update</span>
                </span>
              </NavLink>
              <NavLink
                to="/admin/dashboard/updates"
                end
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-center md:justify-start gap-2.5 w-full rounded-lg px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sirdash-50 text-sirdash-600 dark:bg-sirdash-900/30 dark:text-sirdash-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`
                }
              >
                <List className="h-4 w-4 shrink-0" />
                List Updates
              </NavLink>
            </nav>

            <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 p-3 flex flex-col gap-3 mt-auto">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-sirdash-100 dark:bg-sirdash-900/40 flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-sirdash-600 dark:text-sirdash-400 uppercase">
                    {user?.email?.[0] ?? "A"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">
                    {user?.email?.split("@")[0] ?? "Admin"}
                  </p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => void handleSignOut()}
                className="w-full gap-2 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white justify-center"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};
