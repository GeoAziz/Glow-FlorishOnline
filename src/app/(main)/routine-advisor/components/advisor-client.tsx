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
      <Card>
        <CardHeader>
          <CardTitle>Your Skin Profile</CardTitle>
          <CardDescription>Tell us about your skin so we can create the perfect routine.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="skinType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base">1. What is your skin type?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                      >
                        {skinTypes.map(type => (
                          <FormItem key={type.id} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={type.id} />
                            </FormControl>
                            <FormLabel className="font-normal">{type.label}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skinConcerns"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">2. What are your main skin concerns? (Select all that apply)</FormLabel>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {skinConcerns.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="skinConcerns"
                        render={({ field }) => {
                          return (
                            <FormItem key={item.id} className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...(field.value || []), item.id])
                                      : field.onChange(field.value?.filter((value) => value !== item.id));
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{item.label}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" disabled={loading} className="w-full">
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Sparkles className="mr-2 h-5 w-5" />}
                Generate My Routine
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <AnimatePresence>
      {loading && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-16"
        >
            <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Our AI expert is crafting your routine...</p>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
      {routineResult && (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-headline font-bold">Your Personalized Skincare Routine</h2>
            <p className="text-muted-foreground">Follow these steps for healthier, happier skin.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Morning Routine */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sun className="text-primary"/> Morning Routine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {routineResult.morningRoutine.map((step, index) => (
                  <div key={index}>
                    <p className="font-bold">{index + 1}. {step.stepName}</p>
                    <div className="pl-6 mt-1 border-l-2 border-border ml-2 space-y-2 py-2">
                        <p className="font-semibold text-primary">{step.productRecommendation.name}</p>
                        <p className="text-sm text-muted-foreground italic">"{step.productRecommendation.reason}"</p>
                        <Button asChild size="sm" variant="secondary">
                           <Link href={`/product/${step.productRecommendation.slug}`}>
                                View Product <ArrowRight className="ml-2 h-4 w-4" />
                           </Link>
                        </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            {/* Evening Routine */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Moon className="text-primary"/> Evening Routine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 {routineResult.eveningRoutine.map((step, index) => (
                   <div key={index}>
                    <p className="font-bold">{index + 1}. {step.stepName}</p>
                    <div className="pl-6 mt-1 border-l-2 border-border ml-2 space-y-2 py-2">
                        <p className="font-semibold text-primary">{step.productRecommendation.name}</p>
                        <p className="text-sm text-muted-foreground italic">"{step.productRecommendation.reason}"</p>
                         <Button asChild size="sm" variant="secondary">
                           <Link href={`/product/${step.productRecommendation.slug}`}>
                                View Product <ArrowRight className="ml-2 h-4 w-4" />
                           </Link>
                        </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          {/* General Tips */}
          <Card className="mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lightbulb className="text-primary"/> General Tips</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                    {routineResult.generalTips.map((tip, index) => <li key={index}>{tip}</li>)}
                </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
