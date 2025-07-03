
import { getAdminDashboardStats } from "@/lib/data";
import { StatsCards } from "./components/stats-cards";
import { RecentOrders } from "./components/recent-orders";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div>
        <h1 className="text-4xl font-bold font-headline mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">An overview of your store's performance.</p>

        <StatsCards stats={stats} />

        <div className="mt-8">
            <RecentOrders recentOrders={stats.recentOrders} />
        </div>
    </div>
  );
}
