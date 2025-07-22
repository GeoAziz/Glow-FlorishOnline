"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

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

const PayPalButtons = dynamic(
  () => import("@paypal/react-paypal-js").then(mod => mod.PayPalButtons),
  { ssr: false }
);

import { PayPalScriptProvider } from "@paypal/react-paypal-js";

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('paypal');
  const [paypalSdkReady, setPaypalSdkReady] = useState(false);
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  // Debug log for PayPal environment variables
  console.log("!!! [PayPal Debug] process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID:", process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
  console.log("!!! [PayPal Debug] paypalClientId variable:", paypalClientId);

  // Always call hooks before any return!
  const form = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingAddressSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  useEffect(() => {
    console.log("!!! [PayPal Debug] useEffect triggered");
    if (window?.paypal && window.paypal.Buttons) {
      console.log("!!! [PayPal Debug] window.paypal.Buttons is available on initial render");
      setPaypalSdkReady(true);
    } else {
      console.log("!!! [PayPal Debug] window.paypal.Buttons not available, setting interval to check");
      const interval = setInterval(() => {
        if (window?.paypal && window.paypal.Buttons) {
          console.log("!!! [PayPal Debug] window.paypal.Buttons is now available");
          setPaypalSdkReady(true);
          clearInterval(interval);
        } else {
          console.log("!!! [PayPal Debug] window.paypal or window.paypal.Buttons still not available");
        }
      }, 300);
      return () => {
        clearInterval(interval);
        console.log("!!! [PayPal Debug] Interval cleared");
      };
    }
  }, []);

  // Now do conditional returns
  if (!paypalClientId || paypalClientId === "") {
    console.error("!!! [PayPal Debug] PayPal Client ID is missing or empty. Check your .env and restart the dev server.");
    return (
      <div className="text-center py-16 text-red-500">
        PayPal Client ID is missing. Please check your .env file and restart the dev server.
      </div>
    );
  }

  if (authLoading) {
    return <div className="text-center py-16"><Loader2 className="h-16 w-16 mx-auto animate-spin" /></div>;
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
    );
  }

  // Add this function inside your CheckoutClient component, before the return statement
  const handleOrderCreation = async (
    shippingData: ShippingFormValues,
    method: PaymentMethod,
    paymentDetails?: any
  ) => {
    setLoading(true);
    const orderItems = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.images[0]
    }));

    const total = cartTotal + 50.00; // Including shipping

    const result = await createOrder({
      userId: user.uid,
      items: orderItems,
      total,
      shippingAddress: shippingData,
      paymentMethod: method,
      paymentDetails
    });

    if (result.orderId) {
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
  };

  const handlePaypalApprove = async (data: any, actions: any) => {
    // This function is called when the user approves the payment on PayPal.
    // The `data` object contains the orderID.
    const shippingData = form.getValues();
    const isFormValid = await form.trigger();
    if (!isFormValid) {
      toast({ title: "Shipping Information Required", description: "Please fill out all required shipping fields before proceeding.", variant: "destructive" });
      return;
    }

    await handleOrderCreation(shippingData, 'paypal', { paypalOrderId: data.orderID });
  };

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: "SEK",
        components: "buttons",
        env: "sandbox" // <-- Ensure sandbox mode for sandbox client ID
      }}
    >
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
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input id="addressLine1" {...form.register("addressLine1")} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="addressLine2">Address Line 2</Label>
                <Input id="addressLine2" {...form.register("addressLine2")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...form.register("city")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" {...form.register("state")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" {...form.register("postalCode")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...form.register("country")} />
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
                  <Label htmlFor="paypal" className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> PayPal / Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="flex items-center gap-2"><Truck className="w-4 h-4" /> Pay on Delivery</Label>
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
                    <p className="font-semibold">{(item.product.price * item.quantity).toFixed(2)} SEK</p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{cartTotal.toFixed(2)} SEK</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>50.00 SEK</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{(cartTotal + 50).toFixed(2)} SEK</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {loading && (
                <div className="flex justify-center items-center w-full py-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="ml-2">Processing Order...</p>
                </div>
              )}
              {!loading && (
                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  Place Order
                </Button>
              )}
              {!loading && paymentMethod === 'paypal' && paypalSdkReady && (
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [{
                        amount: {
                          value: (cartTotal + 50.00).toFixed(2),
                          currency_code: 'SEK'
                        }
                      }]
                    });
                  }}
                  onApprove={handlePaypalApprove}
                  disabled={loading}
                />
              )}
              {!loading && paymentMethod === 'paypal' && !paypalSdkReady && (
                <div className="flex justify-center items-center w-full py-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="ml-2">Loading PayPal...</p>
                  <pre>{JSON.stringify({ paypalClientId, paymentMethod, paypalSdkReady }, null, 2)}</pre>
                </div>
              )}
            </CardFooter>
          </Card>
        </div>
      </form>
    </PayPalScriptProvider>
  );
}
