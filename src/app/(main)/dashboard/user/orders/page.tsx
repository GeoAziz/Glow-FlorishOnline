
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { getOrdersByUserId } from '@/actions/order';
import type { Order } from '@/types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Loader2 } from 'lucide-react';

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getOrdersByUserId(user.uid).then(userOrders => {
        setOrders(userOrders);
        setLoading(false);
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center p-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold font-headline mb-2">Order History</h1>
      <p className="text-muted-foreground mb-8">
        Here are all the orders you've placed with us.
      </p>

      {orders.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium truncate" style={{ maxWidth: '100px' }}>
                  {order.id}
                </TableCell>
                <TableCell>
                  {format(new Date(order.createdAt), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'} className="capitalize">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/order-confirmation/${order.id}`}>View Order</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold">No Orders Yet</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            You haven't placed any orders. Let's change that!
          </p>
          <Button asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
