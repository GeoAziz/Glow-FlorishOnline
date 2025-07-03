
'use client';

import { useAuth } from '@/hooks/use-auth';
import { ProfileForm } from "./components/profile-form";
import { AppUser } from "@/types";
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
    const { user, loading } = useAuth();
    
    // The main DashboardLayout handles the primary loading/auth check,
    // but this provides a fallback while the user context is loading.
    if (loading) {
        return (
          <div className="flex h-full w-full items-center justify-center p-16">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
    }

    if (!user) {
        // This case should not be hit due to DashboardLayout's gatekeeping,
        // but it's a good practice to have a fallback.
        return <p>Please log in to view your profile.</p>;
    }

    return (
        <div>
            <h1 className="text-4xl font-bold font-headline mb-2">Profile Settings</h1>
            <p className="text-muted-foreground mb-8">
                Manage your account settings and personal information.
            </p>
            <ProfileForm user={user as AppUser} />
        </div>
    )
}
