import { getOrder } from "@/actions/order";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle } from "lucide-react";

interface OrderConfirmationPageProps {
  params: {
    orderId: string;
  };
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const order = await getOrder(params.orderId);

  if (!order) {
    notFound();
  }

  const { shippingAddress } = order;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h1 className="text-4xl md:text-5xl font-headline font-bold">Thank You For Your Order!</h1>
            <p className="text-muted-foreground mt-2">Your order has been confirmed. A confirmation email will be sent shortly.</p>
            <p className="text-sm text-muted-foreground mt-1">Order ID: {order.id}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <Card>
                <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     {order.items.map(item => (
                        <div key={item.productId} className="flex items-start gap-4">
                            <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md border" />
                            <div className="flex-grow">
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total Paid</span>
                        <span>${order.total.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Shipping Details */}
             <Card>
                <CardHeader>
                    <CardTitle>Shipping To</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                    <p className="font-semibold text-foreground">{shippingAddress.fullName}</p>
                    <p>{shippingAddress.addressLine1}</p>
                    {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                    <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                    <p>{shippingAddress.country}</p>
                </CardContent>
            </Card>
        </div>

        <div className="mt-12 text-center">
            <Button asChild>
                <Link href="/shop">Continue Shopping</Link>
            </Button>
        </div>

      </div>
    </div>
  );
}
