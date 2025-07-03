
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { format } from "date-fns";


interface RecentOrdersProps {
  recentOrders: Order[];
}

export function RecentOrders({ recentOrders }: RecentOrdersProps) {
  return (
     <Card>
        <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>A list of the most recent orders.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="/dashboard/admin/orders">
                    View All
                    <ArrowUpRight className="h-4 w-4" />
                </Link>
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden sm:table-cell">Date</TableHead>
                        <TableHead className="hidden sm:table-cell">Status</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                        <TableCell>
                            <div className="font-medium">{order.shippingAddress.fullName}</div>
                            <div className="text-xs text-muted-foreground">{order.id}</div>
                        </TableCell>
                         <TableCell className="hidden sm:table-cell">
                            {format(order.createdAt, "MMM d, yyyy")}
                        </TableCell>
                         <TableCell className="hidden sm:table-cell">
                            <Badge className="text-xs capitalize" variant="outline">
                                {order.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    </TableRow>
                    ))}
                </TableBody>
            </Table>
             {recentOrders.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No recent orders found.</p>
                </div>
            )}
        </CardContent>
    </Card>
  );
}
