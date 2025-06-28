"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/types";
import { ProductCard } from "./product-card";
import { Filters } from "./filters";

interface ShopClientProps {
  products: Product[];
  categories: string[];
  priceRange: [number, number];
}

export function ShopClient({ products, categories, priceRange: initialPriceRange }: ShopClientProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number[]>([0, initialPriceRange[1]]);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      const priceMatch =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      return categoryMatch && priceMatch;
    });
  }, [products, selectedCategories, priceRange]);

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      <Filters
        categories={categories}
        selectedCategories={selectedCategories}
        onCategoryChange={handleCategoryChange}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        maxPrice={initialPriceRange[1]}
      />
      <main className="flex-1">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold">No Products Found</h2>
            <p className="text-muted-foreground mt-2">
              Try adjusting your filters to find what you're looking for.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
