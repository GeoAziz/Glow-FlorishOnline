import type { Product } from "@/types";

const products: Product[] = [
  {
    id: "1",
    slug: "radiant-glow-serum",
    name: "Radiant Glow Serum",
    description: "A silky, lightweight serum to boost radiance and hydration.",
    longDescription: "Our Radiant Glow Serum is a potent blend of Vitamin C, Hyaluronic Acid, and botanical antioxidants. It works to brighten the complexion, reduce the appearance of fine lines, and deeply hydrate the skin for a luminous, healthy glow. Suitable for all skin types.",
    ingredients: ["Vitamin C", "Hyaluronic Acid", "Green Tea Extract", "Aloe Vera"],
    price: 68.00,
    images: ["https://placehold.co/600x600.png", "https://placehold.co/600x600.png", "https://placehold.co/600x600.png"],
    category: "Skin",
    tags: ["Serum", "Hydration", "Brightening"],
    reviews: [
      { rating: 5, text: "Absolutely amazing! My skin has never looked better.", author: "Chloe M." },
      { rating: 5, text: "A holy grail product. Worth every penny.", author: "Isabella R." },
    ],
    stock: 25
  },
  {
    id: "2",
    slug: "hydrating-cream-cleanser",
    name: "Hydrating Cream Cleanser",
    description: "Gently removes impurities without stripping the skin.",
    longDescription: "This soap-free, pH-balanced cream cleanser melts away makeup and impurities while nourishing the skin with a blend of ceramides, oat extract, and avocado oil. Leaves skin feeling soft, supple, and perfectly clean.",
    ingredients: ["Ceramides", "Oat Kernel Extract", "Avocado Oil", "Glycerin"],
    price: 35.00,
    images: ["https://placehold.co/600x600.png", "https://placehold.co/600x600.png"],
    category: "Skin",
    tags: ["Cleanser", "Gentle", "Hydration"],
    reviews: [
      { rating: 5, text: "So gentle on my sensitive skin. I love it.", author: "Sophia T." },
    ],
    stock: 50
  },
  {
    id: "3",
    slug: "silk-finish-hair-mask",
    name: "Silk Finish Hair Mask",
    description: "Deeply conditions for soft, manageable, and shiny hair.",
    longDescription: "Revive dry, damaged hair with our intensive Silk Finish Hair Mask. Formulated with Argan Oil, Shea Butter, and Keratin, this treatment deeply penetrates the hair shaft to repair, strengthen, and moisturize, leaving you with silky smooth results.",
    ingredients: ["Argan Oil", "Shea Butter", "Hydrolyzed Keratin", "Jojoba Oil"],
    price: 45.00,
    images: ["https://placehold.co/600x600.png", "https://placehold.co/600x600.png"],
    category: "Hair",
    tags: ["Hair Mask", "Repair", "Conditioning"],
    reviews: [],
    stock: 30
  },
  {
    id: "4",
    slug: "luminous-touch-foundation",
    name: "Luminous Touch Foundation",
    description: "A buildable, medium-coverage foundation with a natural finish.",
    longDescription: "Achieve a flawless, second-skin finish with our Luminous Touch Foundation. The lightweight, breathable formula provides buildable medium coverage that evens out skin tone and blurs imperfections. Infused with skin-loving ingredients, it's makeup that's good for your skin.",
    ingredients: ["Niacinamide", "Squalane", "Titanium Dioxide", "Mica"],
    price: 52.00,
    images: ["https://placehold.co/600x600.png", "https://placehold.co/600x600.png"],
    category: "Makeup",
    tags: ["Foundation", "Medium Coverage", "Natural Finish"],
    reviews: [
      { rating: 4, text: "Great coverage and feels light on the skin.", author: "Olivia P." },
    ],
    stock: 40
  },
  {
    id: "5",
    slug: "calming-herbal-tea-blend",
    name: "Calming Herbal Tea Blend",
    description: "A soothing blend of organic herbs to promote relaxation.",
    longDescription: "Unwind and de-stress with our Calming Herbal Tea Blend. This caffeine-free infusion features organic chamomile, lavender, and lemon balm, traditionally used to calm the mind and body. Perfect for a peaceful evening ritual.",
    ingredients: ["Organic Chamomile", "Organic Lavender", "Organic Lemon Balm", "Organic Spearmint"],
    price: 22.00,
    images: ["https://placehold.co/600x600.png", "https://placehold.co/600x600.png"],
    category: "Wellness",
    tags: ["Tea", "Relaxation", "Organic"],
    reviews: [
       { rating: 5, text: "The perfect way to end my day. So delicious and calming.", author: "Ava G." },
    ],
    stock: 100
  },
  {
    id: "6",
    slug: "revitalizing-eye-cream",
    name: "Revitalizing Eye Cream",
    description: "Reduces dark circles and puffiness for a brighter look.",
    longDescription: "Awaken tired eyes with our Revitalizing Eye Cream. This potent formula combines caffeine to reduce puffiness, Vitamin K to diminish dark circles, and peptides to firm the delicate skin around the eyes. Look refreshed and well-rested, even when you're not.",
    ingredients: ["Caffeine", "Vitamin K", "Peptide Complex", "Cucumber Extract"],
    price: 55.00,
    images: ["https://placehold.co/600x600.png", "https://placehold.co/600x600.png"],
    category: "Skin",
    tags: ["Eye Cream", "Dark Circles", "Puffiness"],
    reviews: [],
    stock: 15
  },
   {
    id: "7",
    slug: "volumizing-dry-shampoo",
    name: "Volumizing Dry Shampoo",
    description: "Instantly refreshes hair and adds volume between washes.",
    longDescription: "Extend the life of your blowout with our Volumizing Dry Shampoo. Formulated with rice starch to absorb oil and add texture, this invisible spray leaves no white residue. Hair is left feeling clean, refreshed, and full of body.",
    ingredients: ["Rice Starch", "Tapioca Starch", "Alcohol Denat.", "Silica"],
    price: 28.00,
    images: ["https://placehold.co/600x600.png", "https://placehold.co/600x600.png"],
    category: "Hair",
    tags: ["Dry Shampoo", "Volume", "Styling"],
    reviews: [
      { rating: 5, text: "Best dry shampoo I've ever used. No white cast!", author: "Mia L." },
    ],
    stock: 60
  },
  {
    id: "8",
    slug: "velvet-matte-lipstick",
    name: "Velvet Matte Lipstick",
    description: "A long-wearing, highly pigmented lipstick with a matte finish.",
    longDescription: "Make a statement with our Velvet Matte Lipstick. This creamy, non-drying formula glides on smoothly and delivers intense, single-swipe color. Enriched with Vitamin E and Jojoba Oil, it keeps your lips comfortable all day long. Available in 8 stunning shades.",
    ingredients: ["Dimethicone", "Jojoba Oil", "Vitamin E", "Kaolin"],
    price: 30.00,
    images: ["https://placehold.co/600x600.png", "https://placehold.co/600x600.png"],
    category: "Makeup",
    tags: ["Lipstick", "Matte", "Long-wearing"],
    reviews: [
      { rating: 5, text: "The color 'Rose Petal' is my perfect nude.", author: "Grace W." },
      { rating: 4, text: "Very comfortable for a matte lipstick.", author: "Lily C." },
    ],
    stock: 80
  },
];

export async function getProducts(
  category?: string,
  minPrice?: number,
  maxPrice?: number
): Promise<Product[]> {
  // In a real app, this would be a database query.
  let filteredProducts = products;

  if (category) {
    filteredProducts = filteredProducts.filter(
      (p) => p.category === category
    );
  }
  
  if(minPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= minPrice
    );
  }

  if(maxPrice) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price <= maxPrice
    );
  }


  return Promise.resolve(filteredProducts);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = products.find((p) => p.slug === slug);
  return Promise.resolve(product || null);
}

export function getCategories() {
  const categories = [...new Set(products.map(p => p.category))];
  return categories;
}
