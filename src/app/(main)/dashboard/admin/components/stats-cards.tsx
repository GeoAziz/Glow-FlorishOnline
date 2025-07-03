
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, CreditCard, MessageSquareWarning } from "lucide-react";

interface StatsCardsProps {
    stats: {
        totalRevenue: number;
        totalSales: number;
        totalUsers: number;
        newUsersThisMonth: number;
        pendingReviewsCount: number;
    }
}

export function StatsCards({ stats }: StatsCardsProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">
                        From {stats.totalSales} orders
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">+{stats.totalSales}</p>
                    <p className="text-xs text-muted-foreground">
                        Total orders placed
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    <p className="text-xs text-muted-foreground">
                       +{stats.newUsersThisMonth} new this month
                    </p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                    <MessageSquareWarning className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                     <p className="text-2xl font-bold">{stats.pendingReviewsCount}</p>
                     <p className="text-xs text-muted-foreground">
                        Items awaiting moderation.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
