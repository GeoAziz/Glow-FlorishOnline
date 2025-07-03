
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function ModeratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // The main DashboardLayout handles the primary auth check.
    // This ensures the user has the correct role for this section.
    if (!loading && user?.role !== "moderator" && user?.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [user, loading, router]);

  // Show a spinner while the role check is pending or if the user does not have access.
  if (loading || (user?.role !== "moderator" && user?.role !== "admin")) {
    return (
      <div className="flex h-full w-full items-center justify-center p-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
