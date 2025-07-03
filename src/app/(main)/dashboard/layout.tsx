
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

    // --- Role-Based Access Control ---

    // Special Case: Redirect from the base /dashboard path to the role-specific homepage.
    if (pathname === '/dashboard') {
        const roleBasePaths: Record<UserRole, string> = {
            admin: "/dashboard/admin",
            moderator: "/dashboard/mod",
            user: "/dashboard/user",
        };
        router.replace(roleBasePaths[user.role]);
        return;
    }

    // Define page types
    const isAdminPage = pathname.startsWith('/dashboard/admin');
    const isModeratorPage = pathname.startsWith('/dashboard/mod');
    
    // Explicitly define permissions for each role.

    // Admins can access all dashboard pages.
    if (user.role === 'admin') {
      return; // No restrictions for admins.
    }

    // Moderators can access moderator pages and their own user pages.
    if (user.role === 'moderator') {
      if (isAdminPage) {
        // If a moderator tries to access an admin-only page, redirect them.
        router.replace('/unauthorized');
      }
      return; // Otherwise, allow access.
    }

    // Regular users can only access their own user pages.
    if (user.role === 'user') {
      if (isAdminPage || isModeratorPage) {
        // If a user tries to access admin or moderator pages, redirect them.
        router.replace('/unauthorized');
      }
      return; // Otherwise, allow access to /dashboard/user/* pages.
    }

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
