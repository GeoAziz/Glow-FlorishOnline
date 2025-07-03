
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getWishlist } from '@/actions/wishlist';
import { getProductsByIds } from '@/lib/data';
import type { Product } from '@/types';

import { ProductCard } from '@/app/(main)/shop/components/product-card';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';

export default function WishlistPage() {
  const { user } = useAuth();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchWishlistProducts = async () => {
        setLoading(true);
        const productIds = await getWishlist(user.uid);
        if (productIds.length > 0) {
          const products = await getProductsByIds(productIds);
          setWishlistProducts(products);
        }
        setLoading(false);
      };
      fetchWishlistProducts();
    } else {
        setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center p-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

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
