
"use client";

import { useAuth } from "@/hooks/use-auth";
import { usePathname, useRouter } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import type { UserRole } from "@/types";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Wait until authentication status and user role are fully loaded.
    if (loading || (user && !user.role)) {
      return;
    }

    // If loading is finished and there's no user, redirect to the auth page.
    if (!user) {
      router.replace(`/auth?redirect=${pathname || "/dashboard"}`);
      return;
    }
    
    // --- START: New Robust Role-Based Access Control ---

    // 1. Handle the initial redirect from the base /dashboard path
    if (pathname === '/dashboard') {
        const roleBasePaths: Record<UserRole, string> = {
            admin: "/dashboard/admin",
            moderator: "/dashboard/mod",
            user: "/dashboard/user",
        };
        router.replace(roleBasePaths[user.role]);
        return;
    }

    // 2. Define page access requirements
    const isAdminPage = pathname.startsWith('/dashboard/admin');
    const isModeratorPage = pathname.startsWith('/dashboard/mod');

    // 3. Enforce access rules
    const userRole = user.role;

    // Rule for 'user' role
    if (userRole === 'user' && (isAdminPage || isModeratorPage)) {
        router.replace('/unauthorized');
        return;
    }

    // Rule for 'moderator' role
    if (userRole === 'moderator' && isAdminPage) {
        router.replace('/unauthorized');
        return;
    }

    // Rule for 'admin' role: Admins can access everything, so no redirect rules are needed for them.
    // By reaching this point, an admin is granted access.

    // --- END: New Robust Role-Based Access Control ---

  }, [user, loading, router, pathname]);

  // Show a full-screen loader while authentication is in progress or the user's role is being fetched.
  if (loading || !user?.role) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If we've passed all checks, render the dashboard.
  return (
    <SidebarProvider>
      <DashboardSidebar role={user.role} />
      <SidebarInset>
        <AnimatePresence mode="wait">
          <motion.div
              key={router.asPath}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="p-4 sm:p-6 lg:p-8"
          >
              {children}
          </motion.div>
        </AnimatePresence>
      </SidebarInset>
    </SidebarProvider>
  );
}
