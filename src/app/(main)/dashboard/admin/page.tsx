import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Settings } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div>
        <h1 className="text-4xl font-bold font-headline mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Full control at your fingertips.</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Manage Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">1,257</p>
                    <p className="text-xs text-muted-foreground">
                        +20.1% from last month
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Analytics</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">+2,350</p>
                    <p className="text-xs text-muted-foreground">
                        Page views this week
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">App Settings</CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     <p className="text-xs text-muted-foreground">
                        Configure global application settings.
                    </p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
