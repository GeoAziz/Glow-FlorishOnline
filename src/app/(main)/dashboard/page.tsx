
'use client';

import { Loader2 } from 'lucide-react';

// This page now acts as a loading fallback.
// The main /dashboard/layout.tsx will always redirect the user away from here
// to their role-specific dashboard (e.g., /dashboard/admin).
// This component will only be visible for a brief moment during that redirection.
export default function DashboardRedirect() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
