import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl md:text-6xl font-headline font-bold mb-4">
        Checkout
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        This is where the magic happens! The payment processing and order finalization flow will be implemented here.
      </p>
       <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
    </div>
  );
}
