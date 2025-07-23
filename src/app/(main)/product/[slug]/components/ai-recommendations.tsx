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
    <Card className="bg-secondary text-center py-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline justify-center">
          <Wand2 className="h-6 w-6 text-primary" />
          Personalized Beauty & Wellness Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">Coming Soon</span>
        <p className="mt-4 text-muted-foreground">Our AI-powered tips will be available soon!</p>
      </CardContent>
    </Card>
  );
}
