"use client";

import { usePathname } from "next/navigation";

import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DialogProvider } from "@/contexts/dialog-context";

const GuardProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  return isLoginPage ? (
    // For login page, just return children without layout
    <>{children}</>
  ) : (
    // For other admin pages, show full layout with AuthGuard
    <AuthGuard>
      <DialogProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="flex h-screen">
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
              {/* Header */}
              <AdminHeader />

              {/* Page Content */}
              <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 bg-white">
                {children}
              </main>
            </div>
          </div>
        </div>
      </DialogProvider>
    </AuthGuard>
  );
};

export default GuardProvider;
