"use client";

import { useState, useEffect } from "react";
import { beautyTipsRecommendation } from "@/ai/flows/beauty-tips-recommendation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Wand2 } from "lucide-react";

interface AiRecommendationsProps {
  productDescription: string;
}

export default function AiRecommendations({ productDescription }: AiRecommendationsProps) {
  const [tips, setTips] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTips() {
      try {
        setLoading(true);
        const result = await beautyTipsRecommendation({ productDescription });
        setTips(result.tips);
      } catch (error) {
        console.error("Failed to get AI recommendations:", error);
        setTips([]);
      } finally {
        setLoading(false);
      }
    }
    getTips();
  }, [productDescription]);

  return (
    <Card className="bg-secondary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Wand2 className="h-6 w-6 text-primary" />
          Personalized Beauty & Wellness Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : tips && tips.length > 0 ? (
          <ul className="space-y-3 list-disc list-inside text-muted-foreground">
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">
            No specific tips available for this product, but remember to always patch test new products and stay hydrated for healthy skin!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
