"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { usePathname,useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth-store";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, checkAuth, initializeAuth } =
    useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Initialize auth state from localStorage only after hydration is complete
    const init = async () => {
      await initializeAuth();
      setInitializing(false);
    };
    init();
  }, [initializeAuth]);

  useEffect(() => {
    // Skip auth check for login page or while initializing
    if (pathname === "/login" || initializing) {
      return;
    }

    // Check auth status
    const isValidAuth = checkAuth();

    if (!isLoading && !isValidAuth) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, pathname, router, checkAuth, initializing]);

  // Show loading spinner while initializing or checking auth
  if (initializing || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If not authenticated and not on login page, redirect will happen
  if (!isAuthenticated && pathname !== "/login") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
