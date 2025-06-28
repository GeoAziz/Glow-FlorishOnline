
import { getWishlist } from "@/actions/wishlist";
import { getProductsByIds } from "@/lib/data";
import { auth } from "@/lib/firebase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";

import { ProductCard } from "@/app/(main)/shop/components/product-card";
import { Button } from "@/components/ui/button";

export default async function WishlistPage() {
  const user = await auth.getCurrentUser();

  if (!user) {
    redirect("/auth?redirect=/dashboard/user/wishlist");
  }

  const wishlistProductIds = await getWishlist(user.uid);
  const wishlistProducts = await getProductsByIds(wishlistProductIds);

  return (
    <div>
      <h1 className="text-4xl font-bold font-headline mb-2">My Wishlist</h1>
      <p className="text-muted-foreground mb-8">
        Your saved items for later.
      </p>

      {wishlistProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold">Your Wishlist is Empty</h2>
          <p className="text-muted-foreground mt-2 mb-6">
            Add some products you love to see them here.
          </p>
          <Button asChild>
            <Link href="/shop">Explore Products</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
