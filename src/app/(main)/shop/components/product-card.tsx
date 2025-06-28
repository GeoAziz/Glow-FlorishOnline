"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <Card className={cn("overflow-hidden group transition-shadow hover:shadow-lg flex flex-col", className)}>
      <CardHeader className="p-0">
        <Link href={`/product/${product.slug}`} className="block relative aspect-square">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="cosmetic product"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        {product.category && <p className="text-xs text-muted-foreground mb-1">{product.category}</p>}
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-base leading-tight hover:text-primary transition-colors truncate">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
        <Button size="icon" variant="outline" onClick={() => addToCart(product)} aria-label={`Add ${product.name} to cart`}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
