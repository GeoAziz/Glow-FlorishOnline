import { getProducts, getCategories } from "@/lib/data";
import { ShopClient } from "./components/shop-client";

export default async function ShopPage() {
  const products = await getProducts();
  const categories = await getCategories();
  
  const prices = products.map(p => p.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Our Collection</h1>
        <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Discover our curated selection of clean beauty essentials, designed for your unique glow.</p>
      </div>
      <ShopClient products={products} categories={categories} priceRange={[minPrice, maxPrice]} />
    </div>
  );
}
