
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // The main DashboardLayout already handles the core auth check.
    // This is a secondary check to ensure the user has the correct role.
    if (!loading && user?.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [user, loading, router]);

  // Show a spinner if the role check is pending or if the user is not an admin.
  // This prevents rendering the admin content incorrectly while the redirect happens.
  if (loading || user?.role !== "admin") {
    return (
      <div className="flex h-full w-full items-center justify-center p-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
