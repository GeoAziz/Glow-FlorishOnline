import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateProductDescription(input: { productName: string; keywords: string }) {
  const prompt = `You are a professional marketing copywriter for a luxury beauty brand called \"Glow & Flourish\".\nYour tone is elegant, sophisticated, and focused on benefits and sensory experience.\n\nProduct Name: ${input.productName}\nKeywords: ${input.keywords}\n\n1. description: Short, catchy description (20-30 words).\n2. longDescription: Full, detailed product description (80-120 words).\n3. ingredients: List of suggested ingredients (based on keywords and product type).\n4. tags: List of suggested tags (based on keywords and product type).\n5. imageUrl: Direct link to a suitable placeholder or stock image (e.g., placehold.co or unsplash).\n\nReturn output as JSON.`;
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 400,
  });
  const text = response.choices[0].message?.content ?? "";
  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch {
    // fallback: return as much as possible
    return {
      description: text.slice(0, 100),
      longDescription: text,
      ingredients: [],
      tags: [],
      imageUrl: "",
    };
  }
}
