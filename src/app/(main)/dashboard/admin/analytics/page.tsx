
import { getAnalyticsData } from "@/lib/data";
import { SalesChart } from "./components/sales-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AnalyticsPage() {
    const { monthlyRevenue } = await getAnalyticsData();
    
    return (
        <div>
            <h1 className="text-4xl font-bold font-headline mb-2">Analytics</h1>
            <p className="text-muted-foreground mb-8">
                Visual insights into your store's performance.
            </p>

            <Card>
                <CardHeader>
                    <CardTitle>Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    {monthlyRevenue.length > 0 ? (
                         <SalesChart data={monthlyRevenue} />
                    ) : (
                        <div className="h-[350px] flex items-center justify-center">
                            <p className="text-muted-foreground">No sales data available yet to generate a chart.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
