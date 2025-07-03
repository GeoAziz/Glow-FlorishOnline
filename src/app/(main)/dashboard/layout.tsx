
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
    // If auth state is still loading, or the user object exists but the role hasn't been fetched yet, do nothing.
    // The loading screen will be displayed.
    if (loading || (user && !user.role)) {
      return;
    }

    // If loading is finished and there's no user, redirect to the auth page.
    if (!user) {
      router.replace(`/auth?redirect=${pathname || "/dashboard"}`);
      return;
    }

    // --- Role-Based Access Control ---
    const isAdminPage = pathname.startsWith('/dashboard/admin');
    const isModeratorPage = pathname.startsWith('/dashboard/mod');

    // Rule 1: Only admins can access admin pages.
    if (isAdminPage && user.role !== 'admin') {
      router.replace('/unauthorized');
      return;
    }

    // Rule 2: Only admins and moderators can access moderator pages.
    if (isModeratorPage && user.role !== 'admin' && user.role !== 'moderator') {
      router.replace('/unauthorized');
      return;
    }
    
    // Rule 3: If the user lands on the generic `/dashboard` page, redirect them to their specific dashboard homepage.
    if (pathname === '/dashboard') {
        const roleBasePaths: Record<UserRole, string> = {
            admin: "/dashboard/admin",
            moderator: "/dashboard/mod",
            user: "/dashboard/user",
        };
        router.replace(roleBasePaths[user.role]);
        return;
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
