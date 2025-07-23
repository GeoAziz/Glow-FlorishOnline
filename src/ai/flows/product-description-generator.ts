'use server';
/**
 * @fileOverview A Genkit flow for generating product descriptions.
 *
 * - generateProductDescription - A function that generates a short and long product description.
 * - ProductDescriptionInput - The input type for the generateProductDescription function.
 * - ProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import axios from 'axios';

const HF_API_KEY = process.env.HF_API_KEY;
const HF_MODEL = 'facebook/bart-large-cnn'; // switched to a free, supported model

export type ProductDescriptionInput = {
  productName: string;
  keywords: string;
};

export type ProductDescriptionOutput = {
  description: string;
  longDescription: string;
  ingredients: string[];
  tags: string[];
  imageUrl: string;
};

export async function generateProductDescription(
  input: ProductDescriptionInput
): Promise<ProductDescriptionOutput> {
  const prompt = `Write a short and long product description for ${input.productName}. Keywords: ${input.keywords}`;
  try {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${HF_MODEL}`,
      { inputs: prompt },
      { headers: { Authorization: `Bearer ${HF_API_KEY}` } }
    );
    const text = response.data?.[0]?.generated_text || response.data?.generated_text || '';
    return {
      description: text.slice(0, 100),
      longDescription: text,
      ingredients: [],
      tags: [],
      imageUrl: 'https://placehold.co/600x600.png', // Always provide a fallback image
    };
  } catch (error: any) {
    return {
      description: 'Model unavailable or quota exceeded.',
      longDescription: '',
      ingredients: [],
      tags: [],
      imageUrl: 'https://placehold.co/600x600.png', // Fallback image on error
    };
  }
}

// Add support for local image upload and preview
// This is a placeholder for the backend logic. The UI will need to handle file uploads and convert them to URLs or base64 strings for Firestore storage.
