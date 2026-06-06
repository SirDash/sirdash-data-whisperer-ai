import { Outlet } from "react-router-dom";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminSidebarMobile } from "@/components/AdminSidebarMobile";

const AdminLayout = () => {
  return (
    <div className="min-h-screen h-[100dvh] flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <AdminSidebarMobile />
      <AdminSidebar />

      <main className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
