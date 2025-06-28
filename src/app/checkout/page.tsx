import { CheckoutClient } from "./components/checkout-client";

export default function CheckoutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Checkout</h1>
      </div>
      <CheckoutClient />
    </div>
  );
}
