"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Sun, Moon, Lightbulb, ArrowRight } from "lucide-react";

import { generateSkincareRoutine, type SkincareRoutineOutput } from "@/ai/flows/skincare-routine-advisor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const skinTypes = [
  { id: 'oily', label: 'Oily' },
  { id: 'dry', label: 'Dry' },
  { id: 'combination', label: 'Combination' },
  { id: 'normal', label: 'Normal' },
  { id: 'sensitive', label: 'Sensitive' },
] as const;

const skinConcerns = [
  { id: 'acne', label: 'Acne & Blemishes' },
  { id: 'dullness', label: 'Dullness & Uneven Tone' },
  { id: 'fine lines', label: 'Fine Lines & Wrinkles' },
  { id: 'redness', label: 'Redness & Irritation' },
  { id: 'dark spots', label: 'Dark Spots & Hyperpigmentation' },
  { id: 'uneven texture', label: 'Uneven Texture' },
] as const;


const advisorFormSchema = z.object({
  skinType: z.enum(['oily', 'dry', 'combination', 'normal', 'sensitive'], {
    required_error: "You need to select a skin type.",
  }),
  skinConcerns: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one concern.",
  }),
});

type AdvisorFormValues = z.infer<typeof advisorFormSchema>;

export function AdvisorClient() {
  const [loading, setLoading] = useState(false);
  const [routineResult, setRoutineResult] = useState<SkincareRoutineOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<AdvisorFormValues>({
    resolver: zodResolver(advisorFormSchema),
    defaultValues: {
      skinConcerns: [],
    },
  });

  const onSubmit = async (data: AdvisorFormValues) => {
    setLoading(true);
    setRoutineResult(null);
    try {
      const result = await generateSkincareRoutine(data);
      setRoutineResult(result);
    } catch (error) {
      console.error("Error generating routine:", error);
      toast({
        title: "Generation Failed",
        description: "An error occurred while generating your routine. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-secondary rounded-xl p-12 text-center shadow-lg mt-8">
        <h2 className="text-3xl font-headline font-bold mb-4">AI Routine Advisor</h2>
        <p className="text-lg text-muted-foreground mb-6">Our personalized skincare routine advisor is coming soon! Stay tuned for this feature.</p>
        <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full font-semibold">Coming Soon</span>
      </div>
    </div>
  );
}
