
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PayPalScriptProvider, PayPalButtons, OnApproveData } from "@paypal/react-paypal-js";

import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { createOrder } from "@/actions/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, ShoppingBag, CreditCard, Truck } from "lucide-react";
import type { OrderItem, ShippingAddress, PaymentMethod } from "@/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";

export function CheckoutClient() {
  const { cart, cartTotal, clearCart, itemCount } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal');

  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingAddressSchema),
  });
  
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth?redirect=/checkout');
    }
  }, [user, authLoading, router]);

  const handleOrderCreation = async (
      shippingData: ShippingAddress, 
      method: PaymentMethod,
      paymentDetails?: { paypalOrderId?: string }
    ) => {
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
    
    const total = cartTotal + 5.00; // Including shipping

    const result = await createOrder({
        userId: user.uid,
        items: orderItems,
        total,
        shippingAddress: shippingData,
        paymentMethod: method,
        paymentDetails
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
  
  const handlePayOnDelivery = async (data: ShippingFormValues) => {
    await handleOrderCreation(data, 'delivery');
  }

  const handlePaypalApprove = async (data: OnApproveData, actions: any) => {
    // This function is called when the user approves the payment on PayPal.
    // The `data` object contains the orderID.
    const shippingData = form.getValues();
    const isFormValid = await form.trigger();
    if (!isFormValid) {
        toast({ title: "Shipping Information Required", description: "Please fill out all required shipping fields before proceeding.", variant: "destructive" });
        return;
    }

    await handleOrderCreation(shippingData, 'paypal', { paypalOrderId: data.orderID });
  }

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

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID }}>
        <form onSubmit={form.handleSubmit(handlePayOnDelivery)} className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Shipping & Payment */}
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Shipping Information</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" {...form.register("fullName")} />
                            {form.formState.errors.fullName && <p className="text-xs text-destructive">{form.formState.errors.fullName.message}</p>}
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="addressLine1">Address Line 1</Label>
                            <Input id="addressLine1" {...form.register("addressLine1")} />
                            {form.formState.errors.addressLine1 && <p className="text-xs text-destructive">{form.formState.errors.addressLine1.message}</p>}
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
                            <Input id="addressLine2" {...form.register("addressLine2")} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" {...form.register("city")} />
                            {form.formState.errors.city && <p className="text-xs text-destructive">{form.formState.errors.city.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State / Province</Label>
                            <Input id="state" {...form.register("state")} />
                            {form.formState.errors.state && <p className="text-xs text-destructive">{form.formState.errors.state.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="postalCode">Postal Code</Label>
                            <Input id="postalCode" {...form.register("postalCode")} />
                            {form.formState.errors.postalCode && <p className="text-xs text-destructive">{form.formState.errors.postalCode.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" {...form.register("country")} />
                            {form.formState.errors.country && <p className="text-xs text-destructive">{form.formState.errors.country.message}</p>}
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup defaultValue="paypal" onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="paypal" id="paypal" />
                                <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer">
                                  <CreditCard className="h-5 w-5" /> PayPal / Credit Card
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="delivery" id="delivery" />
                                <Label htmlFor="delivery" className="flex items-center gap-2 cursor-pointer">
                                  <Truck className="h-5 w-5" /> Pay on Delivery
                                </Label>
                            </div>
                        </RadioGroup>
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
                    <CardFooter className="flex flex-col gap-2">
                         {loading && (
                            <div className="flex justify-center items-center w-full py-4">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <p className="ml-2">Processing Order...</p>
                            </div>
                        )}
                        {!loading && paymentMethod === 'delivery' && (
                            <Button type="submit" size="lg" className="w-full" disabled={loading}>
                                Place Order
                            </Button>
                        )}
                        {!loading && paymentMethod === 'paypal' && (
                            <PayPalButtons 
                                style={{ layout: "vertical" }}
                                createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [{
                                            amount: {
                                                value: (cartTotal + 5.00).toFixed(2),
                                            }
                                        }]
                                    });
                                }}
                                onApprove={handlePaypalApprove}
                                disabled={loading}
                            />
                        )}
                    </CardFooter>
                </Card>
            </div>
        </form>
    </PayPalScriptProvider>
  )
}
