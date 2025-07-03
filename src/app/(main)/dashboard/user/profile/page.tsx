
import { auth as serverAuth } from "@/lib/firebase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "./components/profile-form";
import { AppUser } from "@/types";

export default async function ProfilePage() {
    const user = await serverAuth.getCurrentUser();
    if (!user) {
        redirect('/auth?redirect=/dashboard/user/profile');
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
