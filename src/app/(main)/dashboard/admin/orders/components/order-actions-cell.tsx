
"use client";

import { useState, useTransition } from "react";
import { MoreHorizontal, Loader2, Check, Truck, Package, XCircle, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateOrderStatus } from "@/actions/order";
import type { Order } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface OrderActionsCellProps {
  orderId: string;
  currentStatus: Order['status'];
}

const orderStatuses: Order['status'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const statusIcons: Record<Order['status'], React.ReactNode> = {
    pending: <ShoppingBag className="mr-2 h-4 w-4" />,
    processing: <Package className="mr-2 h-4 w-4" />,
    shipped: <Truck className="mr-2 h-4 w-4" />,
    delivered: <Check className="mr-2 h-4 w-4" />,
    cancelled: <XCircle className="mr-2 h-4 w-4" />,
};

export function OrderActionsCell({ orderId, currentStatus }: OrderActionsCellProps) {
  const [status, setStatus] = useState<Order['status']>(currentStatus);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === status) return;

    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus as Order['status']);
      if (result.success) {
        setStatus(newStatus as Order['status']);
        toast({
            title: "Success",
            description: `Order status updated to ${newStatus}.`,
        });
      } else {
        toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
        });
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Update Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={status}
          onValueChange={handleStatusChange}
          disabled={isPending}
        >
          {orderStatuses.map((s) => (
            <DropdownMenuRadioItem key={s} value={s} className="capitalize flex items-center">
                {statusIcons[s]}
                {s}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
