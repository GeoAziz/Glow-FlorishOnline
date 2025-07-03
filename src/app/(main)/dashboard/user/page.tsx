
'use client';

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { User, Heart, ShoppingBag, Settings, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function UserDashboardPage() {
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = async () => {
        try {
        await signOut(auth);
        router.push("/");
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
        } catch (error) {
        toast({
            title: "Error",
            description: "Failed to log out. Please try again.",
            variant: "destructive",
        });
        }
    };
    
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
                <AvatarImage src={user?.photoURL ?? ""} alt={user?.displayName ?? "User"} />
                <AvatarFallback>
                    <User className="h-10 w-10" />
                </AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl md:text-4xl font-bold font-headline">My Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.displayName ?? 'User'}!</p>
            </div>
        </div>
        <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShoppingBag className="h-5 w-5 text-primary" /> Order History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Track your past and current orders, and view details of your purchases.
            </p>
          </CardContent>
          <div className="p-6 pt-0">
             <Button asChild><Link href="/dashboard/user/orders">View Orders</Link></Button>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-primary" /> My Wishlist</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              See the products you've saved for later and easily add them to your cart.
            </p>
          </CardContent>
          <div className="p-6 pt-0">
             <Button asChild><Link href="/dashboard/user/wishlist">View Wishlist</Link></Button>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" /> Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View and edit your personal information and manage your account.
            </p>
          </CardContent>
           <div className="p-6 pt-0">
             <Button asChild><Link href="/dashboard/user/profile">Edit Profile</Link></Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
