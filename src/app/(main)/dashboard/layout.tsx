
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
    // If auth state is still loading, do nothing yet.
    if (loading) {
      return;
    }

    // If loading is finished and there's no user, redirect to auth page.
    if (!user) {
      const redirectPath = window.location.pathname;
      router.replace(`/auth?redirect=${redirectPath || "/dashboard"}`);
      return;
    }

    // If loading is finished and we have a user, but the role isn't populated yet,
    // wait for the role to be fetched. This is the key fix for the race condition.
    if (!user.role) {
        return;
    }

    // Now we know we have a user with a role. Perform the redirection if necessary.
    const expectedBasePath = roleBasePaths[user.role];
    if (!pathname.startsWith(expectedBasePath)) {
      router.replace(expectedBasePath);
    }
  }, [user, loading, router, pathname]);

  // The Gatekeeper: Show a full-screen loader if auth is still processing
  // OR if the user object is present but doesn't have a role yet.
  if (loading || !user?.role) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }
  
  // This is a secondary check for the brief moment between the useEffect hook firing
  // the redirect and the page actually changing. It prevents a flash of incorrect content.
  const expectedBasePath = roleBasePaths[user.role];
  if (!pathname.startsWith(expectedBasePath)) {
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
