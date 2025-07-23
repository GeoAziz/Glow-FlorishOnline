'use server';

/**
 * @fileOverview A Genkit flow for generating personalized skincare routines.
 *
 * - generateSkincareRoutine - A function that generates a personalized skincare routine.
 * - SkincareRoutineInput - The input type for the generateSkincareRoutine function.
 * - SkincareRoutineOutput - The return type for the generateSkincareRoutine function.
 */

import axios from "axios";
import { z } from "genkit";

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = 'google/flan-t5-base'; // switched to a free model

// Input Schema
const skinTypes = ['oily', 'dry', 'combination', 'normal', 'sensitive'] as const;
const skinConcerns = ['acne', 'dullness', 'fine lines', 'redness', 'dark spots', 'uneven texture'] as const;

export type SkincareRoutineInput = {
  skinType: typeof skinTypes[number];
  skinConcerns: typeof skinConcerns[number][];
};

// Output Schema
export type RoutineStep = {
  stepName: string;
  productRecommendation: {
    slug: string;
    name: string;
    reason: string;
  };
};

export type SkincareRoutineOutput = {
  morningRoutine: RoutineStep[];
  eveningRoutine: RoutineStep[];
  generalTips: string[];
};

// Exported Wrapper Function
export async function generateSkincareRoutine(
  input: SkincareRoutineInput
): Promise<SkincareRoutineOutput> {
  const promptText = `Create a morning and evening skincare routine for a customer with skin type: ${input.skinType} and concerns: ${input.skinConcerns.join(', ')}. Include product recommendations and 2-3 general tips.`;
  const response = await axios.post(
    `https://api-inference.huggingface.co/models/${HF_MODEL}`,
    { inputs: promptText },
    { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
  );
  const text = response.data?.[0]?.generated_text || response.data?.generated_text || '';
  // Basic parsing, since flan-t5-base does not return structured JSON
  return {
    morningRoutine: [{ stepName: 'See text', productRecommendation: { slug: '', name: '', reason: text } }],
    eveningRoutine: [{ stepName: 'See text', productRecommendation: { slug: '', name: '', reason: text } }],
    generalTips: [text],
  };
}
