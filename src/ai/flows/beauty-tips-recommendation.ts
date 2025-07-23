// beauty-tips-recommendation.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing personalized beauty and wellness tips based on viewed products.
 *
 * - `beautyTipsRecommendation` - A function that takes a product description and returns relevant beauty and wellness tips.
 * - `BeautyTipsRecommendationInput` - The input type for the `beautyTipsRecommendation` function.
 * - `BeautyTipsRecommendationOutput` - The output type for the `beautyTipsRecommendation` function.
 */

import axios from 'axios';

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2';

export type BeautyTipsRecommendationInput = {productDescription: string};
export type BeautyTipsRecommendationOutput = {tips: string[]};

export async function beautyTipsRecommendation(
  input: BeautyTipsRecommendationInput
): Promise<BeautyTipsRecommendationOutput> {
  const prompt = `You are a beauty and wellness expert. Based on the following product description, provide personalized beauty and wellness tips to the customer.\n\nProduct Description: ${input.productDescription}\n\nTips should be relevant to the product and help the customer make informed decisions and discover new products that suit their needs. Provide 3 tips. Return the tips as a JSON array.\n\nFor example:\n{\n  \"tips\": [\n    \"Tip 1: ...\",\n    \"Tip 2: ...\",\n    \"Tip 3: ...\"\n  ]\n}`;
  const response = await axios.post(
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
    {inputs: prompt},
    {headers: {Authorization: `Bearer ${HF_API_KEY}`}}
  );
  const text = response.data?.['generated_text'] || response.data?.[0]?.generated_text || '';
  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch {
    return {tips: [text]};
  }
}
