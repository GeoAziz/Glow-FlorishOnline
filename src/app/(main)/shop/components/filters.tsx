"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface FiltersProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (categoryId: string, checked: boolean) => void;
  priceRange: number[];
  onPriceChange: (value: number[]) => void;
  maxPrice: number;
}

export function Filters({ 
  categories, 
  selectedCategories, 
  onCategoryChange, 
  priceRange, 
  onPriceChange,
  maxPrice
}: FiltersProps) {
  return (
    <aside className="w-full lg:w-64 space-y-8">
      <div>
        <h3 className="text-lg font-headline font-semibold mb-4">Category</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => onCategoryChange(category, !!checked)}
              />
              <Label htmlFor={category} className="font-normal">
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-headline font-semibold mb-4">Price Range</h3>
        <Slider
          defaultValue={[maxPrice]}
          max={maxPrice}
          min={0}
          step={1}
          value={[priceRange[1]]}
          onValueChange={(value) => onPriceChange([0, value[0]])}
        />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </aside>
  );
}
