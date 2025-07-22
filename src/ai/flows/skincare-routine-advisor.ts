'use server';

/**
 * @fileOverview A Genkit flow for generating personalized skincare routines.
 *
 * - generateSkincareRoutine - A function that generates a personalized skincare routine.
 * - SkincareRoutineInput - The input type for the generateSkincareRoutine function.
 * - SkincareRoutineOutput - The return type for the generateSkincareRoutine function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getProducts } from '@/lib/data';

// Input Schema
const skinTypes = ['oily', 'dry', 'combination', 'normal', 'sensitive'] as const;
const skinConcerns = ['acne', 'dullness', 'fine lines', 'redness', 'dark spots', 'uneven texture'] as const;

const SkincareRoutineInputSchema = z.object({
  skinType: z.enum(skinTypes).describe('The user\'s skin type.'),
  skinConcerns: z.array(z.enum(skinConcerns)).describe('A list of the user\'s primary skin concerns.'),
});
export type SkincareRoutineInput = z.infer<typeof SkincareRoutineInputSchema>;

// Output Schema
const RoutineStepSchema = z.object({
  stepName: z.string().describe('The name of the routine step (e.g., "Cleanse", "Serum", "Moisturize").'),
  productRecommendation: z.object({
    slug: z.string().describe('The unique slug of the recommended product.'),
    name: z.string().describe('The name of the recommended product.'),
    reason: z.string().describe('A brief explanation of why this specific product is recommended for the user.'),
  }),
});

const SkincareRoutineOutputSchema = z.object({
  morningRoutine: z.array(RoutineStepSchema).describe('An array of steps for the morning routine.'),
  eveningRoutine: z.array(RoutineStepSchema).describe('An array of steps for the evening routine.'),
  generalTips: z.array(z.string()).describe('A list of 2-3 general tips for the user\'s skin type and concerns.'),
});
export type SkincareRoutineOutput = z.infer<typeof SkincareRoutineOutputSchema>;

// Tool Definition
const findProductsTool = ai.defineTool(
  {
    name: 'findProducts',
    description: 'Finds products from the store catalog based on category and/or keywords. Use this to find suitable cleansers, serums, moisturizers, etc.',
    inputSchema: z.object({
      category: z.enum(['Face Care', 'Hair Care', 'Body Care', 'Fragrance & Wellness']).optional().describe('The product category to search within.'),
      searchQuery: z.string().optional().describe('Keywords to search for in product names and descriptions (e.g., "hydrating", "acne", "retinol").'),
    }),
    outputSchema: z.array(z.object({
      slug: z.string(),
      name: z.string(),
      description: z.string(),
      category: z.string(),
      ingredients: z.array(z.string()),
    })),
  },
  async ({ category, searchQuery }) => {
    console.log(`🔍 Tool called: findProducts with category="${category}", query="${searchQuery}"`);
    const products = await getProducts({ category, searchQuery });
    console.log("[🧪 findProductsTool] Got products:", JSON.stringify(products, null, 2));
    return (products || []).filter(p => p && p.slug && p.name).map(p => ({
      slug: p.slug,
      name: p.name,
      description: p.description || '',
      category: p.category || 'Unknown',
      ingredients: p.ingredients || [],
    }));
  }
);

// Prompt Definition
const prompt = ai.definePrompt({
  name: 'skincareRoutinePrompt',
  input: { schema: SkincareRoutineInputSchema },
  output: { schema: SkincareRoutineOutputSchema },
  tools: [findProductsTool],
  prompt: `You are an expert esthetician for "Glow & Flourish", a luxury beauty brand.
Your task is to create a personalized morning and evening skincare routine for a customer based on their skin type and concerns.
You MUST use the 'findProducts' tool to search for appropriate products from the store's catalog for each step of the routine.
For each recommended product, provide a concise reason why it's a good fit for the user.
Also, provide 2-3 general tips tailored to the user's needs.

Follow these steps:
1. Analyze the user's skin type: {{{skinType}}} and concerns: {{{skinConcerns}}}.
2. For the morning routine, find a suitable Cleanser, a Serum (optional, if relevant), a Moisturizer, and an SPF (if available, otherwise skip).
3. For the evening routine, find a suitable Cleanser, a treatment Serum, and a Moisturizer.
4. Use the 'findProducts' tool for each product type you need. For example, to find a cleanser for oily skin, you might call findProducts({ category: 'Face Care', searchQuery: 'cleanser oily' }).
5. From the tool's results, select the MOST appropriate product for the user's profile.
6. Construct the final JSON output with the morning routine, evening routine, and general tips. Ensure the product slug is included.`,
});

// Flow Definition with error handling and logging
const skincareRoutineFlow = ai.defineFlow(
  {
    name: 'skincareRoutineFlow',
    inputSchema: SkincareRoutineInputSchema,
    outputSchema: SkincareRoutineOutputSchema,
  },
  async (input) => {
    console.log("📥 Prompt input:", JSON.stringify(input, null, 2));

    let result: unknown;

    try {
      result = await prompt(input);
      console.log("📤 Raw prompt result:", JSON.stringify(result, null, 2));
    } catch (err: any) {
      console.error("❌ Prompt execution failed!");
      if (err instanceof Error) {
        console.error("🧠 Message:", err.message);
        console.error("📚 Stack trace:", err.stack);
      } else {
        console.error("Unknown error:", err);
      }
      throw new Error("The AI failed to generate a routine due to an internal error. Details: " + (err instanceof Error ? err.message : String(err)));
    }

    // Defensive check for result structure
    if (!result || typeof result !== 'object' || !('output' in result) || !(result as any).output) {
      console.error("❌ Invalid AI response structure:", JSON.stringify(result, null, 2));
      throw new Error("The AI failed to generate a routine. No valid output returned. See server logs for details.");
    }

    return (result as any).output as SkincareRoutineOutput;
  }
);

// Exported Wrapper Function
export async function generateSkincareRoutine(
  input: SkincareRoutineInput
): Promise<SkincareRoutineOutput> {
  return skincareRoutineFlow(input);
}
