
import { adminDb } from './firebase/admin';
import type { Product, BlogPost } from "@/types";
import type { Query } from 'firebase-admin/firestore';

// This data is now used for seeding the database only.
// See scripts/seed-db.ts
export const initialProducts: Product[] = [
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

export const initialBlogPosts: Omit<BlogPost, 'id' | 'publishedDate' | 'content'>[] = [
  {
    slug: 'the-ultimate-guide-to-a-glowing-skincare-routine',
    title: 'The Ultimate Guide to a Glowing Skincare Routine',
    excerpt: 'Unlock the secrets to radiant skin with our step-by-step guide. From cleansing to moisturizing, we cover everything you need to know to build a routine that works for you.',
    author: 'Eleanor Vance',
    imageUrl: 'https://placehold.co/800x400.png',
    imageHint: 'skincare products',
    tags: ['Skincare', 'Routine', 'Tips'],
  },
  {
    slug: '5-self-care-rituals-to-boost-your-well-being',
    title: '5 Self-Care Rituals to Boost Your Well-Being',
    excerpt: 'In the hustle and bustle of daily life, taking time for yourself is more important than ever. Discover five simple self-care rituals you can incorporate into your week to relax, recharge, and flourish.',
    author: 'Jasper Moon',
    imageUrl: 'https://placehold.co/800x400.png',
    imageHint: 'wellness relax',
    tags: ['Wellness', 'Self-Care', 'Mindfulness'],
  },
];

export const blogPostContent: {[key: string]: string} = {
  'the-ultimate-guide-to-a-glowing-skincare-routine': 'Building a consistent skincare routine is the cornerstone of healthy, glowing skin. It doesn\'t need to be complicated, but it should be consistent. Here are the essential steps for a routine that will leave your skin feeling nourished and radiant.\n\n**Step 1: Cleanse**\nStart with a gentle cleanser to remove makeup, dirt, and impurities. For dry or sensitive skin, a cream cleanser is ideal. For oily or acne-prone skin, a gel or foaming cleanser works well. Massage it into your skin for at least 60 seconds before rinsing with lukewarm water.\n\n**Step 2: Tone (Optional but Recommended)**\nA toner helps to remove any last traces of dirt and balances your skin\'s pH. Look for alcohol-free formulas with hydrating or soothing ingredients like rosewater or hyaluronic acid.\n\n**Step 3: Treat with Serums**\nThis is where you target specific concerns. A Vitamin C serum in the morning can protect against environmental damage, while a retinol or peptide serum at night can help with anti-aging. Apply a few drops to your face and neck.\n\n**Step 4: Moisturize**\nHydration is key for all skin types. A good moisturizer locks in all the benefits of your previous steps and keeps your skin barrier healthy. Choose a lightweight lotion for oily skin or a richer cream for dry skin.\n\n**Step 5: Protect with SPF (AM Routine)**\nSunscreen is non-negotiable. It\'s the most effective anti-aging product you can use. Apply a broad-spectrum SPF of 30 or higher every single morning, even on cloudy days.',
  '5-self-care-rituals-to-boost-your-well-being': 'Self-care isn\'t selfish; it\'s essential for maintaining your mental, emotional, and physical health. Here are five simple yet powerful rituals to help you reconnect with yourself.\n\n**1. Mindful Mornings**\nInstead of grabbing your phone first thing, take five minutes to stretch, meditate, or simply enjoy a cup of tea in silence. Setting a calm tone for your day can have a profound impact on your stress levels.\n\n**2. The Weekly Unwind Bath**\nTransform your bathroom into a spa once a week. Add Epsom salts, essential oils, or a bath bomb to a warm bath. Light a candle, play some calming music, and let the stress of the week melt away.\n\n**3. Digital Detox Hour**\nDesignate one hour each day where you put all your devices away. Use this time to read a book, go for a walk, work on a hobby, or simply be present in your surroundings without digital distractions.\n\n**4. Nourish from Within**\nTake the time to prepare a truly nourishing meal for yourself. Focus on whole foods, vibrant colors, and flavors you love. Eating mindfully, without distractions, can turn a simple meal into a restorative experience.\n\n**5. Gratitude Journaling**\nBefore bed, write down three things you were grateful for that day. This simple practice can shift your focus from what\'s wrong to what\'s right, promoting a more positive outlook on life.',
};


export async function getProducts(
  category?: string,
  minPrice?: number,
  maxPrice?: number
): Promise<Product[]> {
  try {
    let query: Query = adminDb.collection('products');

    if (category) {
      query = query.where('category', '==', category);
    }
    
    const snapshot = await query.orderBy('name').get();
    
    if (snapshot.empty) {
      return [];
    }

    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Product[];
    
    // In-memory price filtering
    if (minPrice !== undefined) {
      products = products.filter(p => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      products = products.filter(p => p.price <= maxPrice);
    }

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!id) {
    return null;
  }
  try {
    const doc = await adminDb.collection('products').doc(id).get();

    if (!doc.exists) {
      return null;
    }

    return {
      id: doc.id,
      ...doc.data()
    } as Product;
  } catch (error) {
    console.error(`Error fetching product by id ${id}:`, error);
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const productsRef = adminDb.collection('products');
    const snapshot = await productsRef.where('slug', '==', slug).limit(1).get();

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as Product;
  } catch (error) {
    console.error(`Error fetching product by slug ${slug}:`, error);
    return null;
  }
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (ids.length === 0) {
    return [];
  }
  try {
    const productRefs = ids.map(id => adminDb.collection('products').doc(id));
    const productDocs = await adminDb.getAll(...productRefs);

    return productDocs
      .filter(doc => doc.exists)
      .map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Product));
  } catch (error) {
    console.error("Error fetching products by IDs:", error);
    return [];
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const snapshot = await adminDb.collection('categories').orderBy('name').get();
    if (snapshot.empty) {
        return [];
    }
    return snapshot.docs.map(doc => doc.data().name as string);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const snapshot = await adminDb.collection('blog_posts').orderBy('publishedDate', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        publishedDate: data.publishedDate.toDate(),
      } as BlogPost;
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const doc = await adminDb.collection('blog_posts').doc(slug).get();

    if (!doc.exists) {
      return null;
    }

    const data = doc.data();
    if (!data) return null;

    return {
      id: doc.id,
      ...data,
      publishedDate: data.publishedDate.toDate(),
    } as BlogPost;
  } catch (error) {
    console.error(`Error fetching blog post by slug ${slug}:`, error);
    return null;
  }
}
