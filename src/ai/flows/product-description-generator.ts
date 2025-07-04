'use server';
/**
 * @fileOverview A Genkit flow for generating product descriptions.
 *
 * - generateProductDescription - A function that generates a short and long product description.
 * - ProductDescriptionInput - The input type for the generateProductDescription function.
 * - ProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductDescriptionInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  keywords: z.string().describe('A comma-separated list of keywords describing the product (e.g., hydrating, for sensitive skin, anti-aging).'),
});
export type ProductDescriptionInput = z.infer<typeof ProductDescriptionInputSchema>;

const ProductDescriptionOutputSchema = z.object({
  description: z.string().describe('A short, catchy description for product cards (20-30 words).'),
  longDescription: z.string().describe('A full, detailed product description for the product page (80-120 words).'),
});
export type ProductDescriptionOutput = z.infer<typeof ProductDescriptionOutputSchema>;

export async function generateProductDescription(
  input: ProductDescriptionInput
): Promise<ProductDescriptionOutput> {
  return productDescriptionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productDescriptionGeneratorPrompt',
  input: {schema: ProductDescriptionInputSchema},
  output: {schema: ProductDescriptionOutputSchema},
  prompt: `You are a professional marketing copywriter for a luxury beauty brand called "Glow & Flourish".
Your tone is elegant, sophisticated, and focused on benefits and sensory experience.

Your task is to generate two product descriptions based on the provided product name and keywords.

Product Name: {{{productName}}}
Keywords: {{{keywords}}}

1.  **Short Description:** Write a short, catchy description suitable for a product listing page. It should be around 20-30 words and entice the customer to click.
2.  **Long Description:** Write a full, detailed product description for the product page. It should be 80-120 words long. Elaborate on the benefits, key ingredients mentioned in the keywords, and the experience of using the product.

Return the output in the specified JSON format.`,
});

const productDescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'productDescriptionGeneratorFlow',
    inputSchema: ProductDescriptionInputSchema,
    outputSchema: ProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
