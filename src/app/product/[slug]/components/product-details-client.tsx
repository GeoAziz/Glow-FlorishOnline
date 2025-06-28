"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, Minus, Plus, Heart } from "lucide-react";
import type { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [activeImage, setActiveImage] = useState(product.images[0]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  const averageRating = product.reviews.length > 0 
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
      {/* Image Gallery */}
      <div className="flex flex-col gap-4">
        <div className="aspect-square relative rounded-lg overflow-hidden shadow-md">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-300"
            data-ai-hint="cosmetic product"
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          {product.images.map((img, index) => (
            <button
              key={index}
              className={`aspect-square relative rounded-md overflow-hidden transition-all duration-200 ${
                activeImage === img ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'
              }`}
              onClick={() => setActiveImage(img)}
            >
              <Image
                src={img}
                alt={`${product.name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col">
        <span className="text-sm font-medium text-primary uppercase tracking-wider">{product.category}</span>
        <h1 className="text-4xl md:text-5xl font-headline font-bold my-2">{product.name}</h1>
        <div className="flex items-center gap-4 mt-2 mb-4">
            <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-primary fill-primary" />
                <span className="font-bold">{averageRating.toFixed(1)}</span>
                <span className="text-sm text-muted-foreground">({product.reviews.length} reviews)</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
        </div>
        <p className="text-3xl font-bold font-headline text-primary mb-6">${product.price.toFixed(2)}</p>
        
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>

        <Separator className="my-8" />
        
        <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q-1))}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                 <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.min(10, q+1))}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={product.stock === 0}>Add to Cart</Button>
            <Button size="lg" variant="outline" aria-label="Add to wishlist">
                <Heart className="h-5 w-5" />
            </Button>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="description">
            <AccordionTrigger>Full Description</AccordionTrigger>
            <AccordionContent>
              {product.longDescription}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="ingredients">
            <AccordionTrigger>Ingredients</AccordionTrigger>
            <AccordionContent>
              <ul className="list-disc list-inside text-muted-foreground">
                  {product.ingredients.map(ing => <li key={ing}>{ing}</li>)}
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="reviews">
            <AccordionTrigger>Reviews ({product.reviews.length})</AccordionTrigger>
            <AccordionContent>
              {product.reviews.length > 0 ? (
                <div className="space-y-4">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="border-b pb-4 last:border-none">
                       <div className="flex items-center mb-1">
                          {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-primary fill-primary" />
                          ))}
                      </div>
                      <p className="text-muted-foreground italic">"{review.text}"</p>
                      <p className="text-sm font-semibold mt-2">- {review.author}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </div>
    </div>
  );
}
