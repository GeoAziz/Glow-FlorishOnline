
import { getOrders } from "@/actions/order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { OrderActionsCell } from "./components/order-actions-cell";
import { ClipboardList } from "lucide-react";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const getStatusVariant = (status: string) => {
    switch (status) {
        case 'delivered':
            return 'default';
        case 'cancelled':
            return 'destructive';
        default:
            return 'secondary';
    }
  }

  return (
    <div>
      <h1 className="text-4xl font-bold font-headline mb-2">Manage Orders</h1>
      <p className="text-muted-foreground mb-8">
        A list of all customer orders.
      </p>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{order.customer.name}</div>
                  <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                </TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)} className="capitalize">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-right">${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <OrderActionsCell orderId={order.id} currentStatus={order.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       {orders.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg mt-4">
            <ClipboardList className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold">No Orders Found</h2>
            <p className="text-muted-foreground mt-2">
              There are no orders to display yet.
            </p>
          </div>
        )}
    </div>
  );
}
