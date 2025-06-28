import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Heart, ShoppingBag } from "lucide-react";

export default function UserDashboardPage() {
  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20">
            <AvatarImage src="https://placehold.co/100x100.png" />
            <AvatarFallback>
                <User className="h-10 w-10" />
            </AvatarFallback>
        </Avatar>
        <div>
            <h1 className="text-4xl font-bold font-headline">My Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your personal space.</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Profile</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              View and edit your personal information.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Order History</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <p className="text-xs text-muted-foreground">
              Track your past and current orders.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Wishlist</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              See the products you've saved for later.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
