"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShoppingBag } from "lucide-react";
import type { OrderItem, ShippingAddress } from "@/types";

const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  addressLine1: z.string().min(5, "Address is required."),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State / Province is required."),
  postalCode: z.string().min(4, "Postal code is required."),
  country: z.string().min(2, "Country is required."),
});

type ShippingFormValues = z.infer<typeof shippingAddressSchema>;

export function CheckoutClient() {
  const { cart, cartTotal, clearCart, itemCount } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingAddressSchema),
  });
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth?redirect=/checkout');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
      return <div className="text-center py-16"><Loader2 className="h-16 w-16 mx-auto animate-spin" /></div>
  }

  if (!user) {
      return null;
  }
  
  if (itemCount === 0 && !loading) {
    return (
       <div className="text-center py-16">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold">Your Cart is Empty</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          You need items in your cart to proceed to checkout.
        </p>
        <Button asChild>
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    )
  }

  const onSubmit = async (data: ShippingFormValues) => {
    if (!user) {
        toast({ title: "Authentication Error", description: "You must be logged in to place an order.", variant: "destructive" });
        return;
    }
    setLoading(true);

    const orderItems: OrderItem[] = cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0]
    }));
    
    const shippingAddress: ShippingAddress = data;
    const total = cartTotal + 5.00; // Including shipping

    const result = await createOrder({
        userId: user.uid,
        items: orderItems,
        total,
        shippingAddress
    });

    if (result.success && result.orderId) {
        clearCart();
        toast({ title: "Order Placed!", description: "Your order has been successfully placed." });
        router.push(`/order-confirmation/${result.orderId}`);
    } else {
        toast({ title: "Order Failed", description: result.error || "An unknown error occurred.", variant: "destructive" });
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Shipping & Payment */}
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" {...register("fullName")} />
                        {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                    </div>
                     <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="addressLine1">Address Line 1</Label>
                        <Input id="addressLine1" {...register("addressLine1")} />
                        {errors.addressLine1 && <p className="text-xs text-destructive">{errors.addressLine1.message}</p>}
                    </div>
                     <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                        <Input id="addressLine2" {...register("addressLine2")} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" {...register("city")} />
                        {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="state">State / Province</Label>
                        <Input id="state" {...register("state")} />
                        {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input id="postalCode" {...register("postalCode")} />
                        {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode.message}</p>}
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Input id="country" {...register("country")} />
                        {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Simulated Payment Section */}
             <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="font-headline">Payment</CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="text-muted-foreground">This is a simulated payment process. No real card is required. Clicking "Place Order" will complete the purchase.</p>
                    <div className="mt-4 p-4 border-dashed border-2 rounded-lg bg-muted/50">
                        <p className="font-semibold text-center">Payment integration would go here.</p>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
             <Card className="sticky top-20">
                <CardHeader>
                    <CardTitle className="font-headline">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
                        {cart.map(item => (
                            <div key={item.product.id} className="flex items-start gap-4">
                                <Image src={item.product.images[0]} alt={item.product.name} width={64} height={64} className="rounded-md" />
                                <div className="flex-grow">
                                    <p className="font-semibold">{item.product.name}</p>
                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                                <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>$5.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${(cartTotal + 5).toFixed(2)}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Place Order
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </form>
  )
}
