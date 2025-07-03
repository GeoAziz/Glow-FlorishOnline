
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

  const roleBasePaths: Record<UserRole, string> = {
    admin: "/dashboard/admin",
    moderator: "/dashboard/mod",
    user: "/dashboard/user",
  };

  useEffect(() => {
    // First, handle unauthenticated users.
    if (!loading && !user) {
      const redirectPath = window.location.pathname;
      router.replace(`/auth?redirect=${redirectPath || "/dashboard"}`);
      return;
    }

    // Once the user is loaded, handle role-based redirection.
    if (!loading && user) {
      const expectedBasePath = roleBasePaths[user.role];
      // If the user is on a path that doesn't match their role's base path,
      // or if they land on the generic '/dashboard' page, redirect them.
      if (!pathname.startsWith(expectedBasePath)) {
        router.replace(expectedBasePath);
      }
    }
  }, [user, loading, router, pathname]);

  // While loading or if the user object isn't available yet, show a full-screen loader.
  // This is the primary gatekeeper.
  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  const expectedBasePath = roleBasePaths[user.role];
  // If the user is loaded but we are about to redirect, show a loader
  // to prevent a flash of the incorrect dashboard content.
  if (!pathname.startsWith(expectedBasePath)) {
     return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If we've passed all checks, the user is authenticated and on the correct path.
  // Render the dashboard.
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
