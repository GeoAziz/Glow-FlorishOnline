"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function CartClient() {
  const { cart, updateQuantity, removeFromCart, cartTotal, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold">Your Cart is Empty</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Button asChild>
          <Link href="/shop">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
      <div className="lg:col-span-2 space-y-4">
        {cart.map((item) => (
          <Card key={item.product.id} className="flex items-center p-4">
            <Link href={`/product/${item.product.slug}`} className="relative h-24 w-24 rounded-md overflow-hidden">
                <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                />
            </Link>
            <div className="flex-grow ml-4">
                <Link href={`/product/${item.product.slug}`} className="font-semibold hover:text-primary">{item.product.name}</Link>
                <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
            </div>
             <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-bold">{item.quantity}</span>
                 <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <p className="w-24 text-right font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
            <Button variant="ghost" size="icon" className="ml-4" onClick={() => removeFromCart(item.product.id)}>
                <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </Card>
        ))}
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-20">
            <CardHeader>
                <CardTitle className="font-headline">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Button asChild size="lg" className="w-full">
                    <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
            </CardFooter>
        </Card>
      </div>
    </div>
  );
}
