// beauty-tips-recommendation.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized beauty and wellness tips based on viewed products.
 *
 * - `beautyTipsRecommendation` - A function that takes a product description and returns relevant beauty and wellness tips.
 * - `BeautyTipsRecommendationInput` - The input type for the `beautyTipsRecommendation` function.
 * - `BeautyTipsRecommendationOutput` - The output type for the `beautyTipsRecommendation` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const BeautyTipsRecommendationInputSchema = z.object({
  productDescription: z
    .string()
    .describe('The description of the product the user is viewing.'),
});
export type BeautyTipsRecommendationInput = z.infer<
  typeof BeautyTipsRecommendationInputSchema
>;

const BeautyTipsRecommendationOutputSchema = z.object({
  tips: z
    .array(z.string())
    .describe('An array of personalized beauty and wellness tips.'),
});
export type BeautyTipsRecommendationOutput = z.infer<
  typeof BeautyTipsRecommendationOutputSchema
>;

export async function beautyTipsRecommendation(
  input: BeautyTipsRecommendationInput
): Promise<BeautyTipsRecommendationOutput> {
  return beautyTipsRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'beautyTipsRecommendationPrompt',
  input: {schema: BeautyTipsRecommendationInputSchema},
  output: {schema: BeautyTipsRecommendationOutputSchema},
  prompt: `You are a beauty and wellness expert. Based on the following product description, provide personalized beauty and wellness tips to the customer.

Product Description: {{{productDescription}}}

Tips should be relevant to the product and help the customer make informed decisions and discover new products that suit their needs. Provide 3 tips. Return the tips as a JSON array.

For example:
{
  "tips": [
    "Tip 1: ...",
    "Tip 2: ...",
    "Tip 3: ..."
  ]
}`,
});

const beautyTipsRecommendationFlow = ai.defineFlow(
  {
    name: 'beautyTipsRecommendationFlow',
    inputSchema: BeautyTipsRecommendationInputSchema,
    outputSchema: BeautyTipsRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
