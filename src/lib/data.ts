

import { adminDb } from './firebase/admin';
import type { Product, BlogPost, Review, PendingReview, Order, Testimonial } from "@/types";
import type { Query, DocumentSnapshot } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { format } from 'date-fns';

const faceCareProducts = [
  { brand: "Glow & Flourish", name: "Snail Repair Cream", price: 199 },
  { brand: "Glow & Flourish", name: "Vitamin C Serum", price: 249 },
  { brand: "Glow & Flourish", name: "Hydrating Gel Moisturizer", price: 179 },
  { brand: "Glow & Flourish", name: "Clay Detox Mask", price: 149 },
  { brand: "Glow & Flourish", name: "Niacinamide Booster", price: 229 },
  { brand: "Glow & Flourish", name: "Hyaluronic Acid Serum", price: 199 },
  { brand: "Glow & Flourish", name: "Glow Night Cream", price: 259 },
  { brand: "Glow & Flourish", name: "Green Tea Toner", price: 129 },
  { brand: "Glow & Flourish", name: "Gentle Cleansing Foam", price: 139 },
  { brand: "Glow & Flourish", name: "Spot Treatment Roll-On", price: 169 },
];

const hairCareProducts = [
  { brand: "Glow & Flourish", name: "Shea Butter Leave-In", price: 189 },
  { brand: "Glow & Flourish", name: "Castor Oil Scalp Tonic", price: 159 },
  { brand: "Glow & Flourish", name: "Curl Defining Gel", price: 169 },
  { brand: "Glow & Flourish", name: "Rice Water Repair Mist", price: 149 },
  { brand: "Glow & Flourish", name: "Avocado Hair Mask", price: 199 },
  { brand: "Glow & Flourish", name: "Keratin Smoothing Cream", price: 219 },
  { brand: "Glow & Flourish", name: "Aloe Vera Conditioner", price: 179 },
  { brand: "Glow & Flourish", name: "Anti-Dandruff Herbal Shampoo", price: 139 },
  { brand: "Glow & Flourish", name: "Silk Protein Serum", price: 249 },
  { brand: "Glow & Flourish", name: "Edge Control Paste", price: 129 },
];

const bodyCareProducts = [
  { brand: "Glow & Flourish", name: "Raw Shea Butter Tub", price: 99 },
  { brand: "Glow & Flourish", name: "Brightening Body Lotion", price: 149 },
  { brand: "Glow & Flourish", name: "Sugar Glow Scrub", price: 129 },
  { brand: "Glow & Flourish", name: "Cocoa Butter Stick", price: 109 },
  { brand: "Glow & Flourish", name: "De-pigmentation Cream", price: 179 },
  { brand: "Glow & Flourish", name: "Skin Repair Oil", price: 139 },
  { brand: "Glow & Flourish", name: "Aromatherapy Shower Gel", price: 119 },
  { brand: "Glow & Flourish", name: "Underarm Detox Cream", price: 129 },
  { brand: "Glow & Flourish", name: "Stretch Mark Treatment Balm", price: 189 },
  { brand: "Glow & Flourish", name: "Sunscreen Lotion SPF50", price: 159 },
];

const fragranceAndWellnessProducts = [
  { brand: "Glow & Flourish", name: "Cherry Blooca Eau de Parfum", price: 279 },
  { brand: "Glow & Flourish", name: "Lavender Relaxation Mist", price: 139 },
  { brand: "Glow & Flourish", name: "Vanilla Body Spray", price: 119 },
  { brand: "Glow & Flourish", name: "Oud & Amber Blend", price: 319 },
  { brand: "Glow & Flourish", name: "Essential Oil Trio Kit", price: 189 },
  { brand: "Glow & Flourish", name: "Cedar & Patchouli Diffuser", price: 169 },
  { brand: "Glow & Flourish", name: "Citrus Burst Room Mist", price: 139 },
  { brand: "Glow & Flourish", name: "Jasmine Roll-on Perfume", price: 109 },
  { brand: "Glow & Flourish", name: "Minty Breath Spray", price: 89 },
  { brand: "Glow & Flourish", name: "Detox Bath Salt Pouch", price: 149 },
];

const generateProductData = (product: { brand: string; name: string; price: number }, category: Product['category']): Omit<Product, 'id' | 'createdAt'> & { reviews: Omit<Review, 'id'|'productId'|'userId'|'createdAt'>[] } => {
  const slug = product.name.toLowerCase().replace(/\s+/g, '-');
  return {
    ...product,
    slug,
    category,
    description: `High-quality ${product.name.toLowerCase()} from ${product.brand}.`,
    longDescription: `Discover the benefits of our ${product.name.toLowerCase()}. Made with the finest ingredients to ensure the best results for your ${category.toLowerCase().split(' ')[0]} care routine.`,
    ingredients: ["Aqua", "Glycerin", "Natural Extracts"],
    images: [`https://placehold.co/600x600.png?text=${encodeURIComponent(product.name)}`],
    stock: Math.floor(Math.random() * 100) + 10,
    rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10, // Random rating between 3.5 and 5.0
    tags: [category.split(' ')[0], "New"],
    reviews: [
      {
        author: "Ava G.",
        rating: 5,
        status: "approved",
        text: "This product is amazing! It completely changed my skin for the better."
      },
      {
        author: "Leo M.",
        rating: 4,
        status: "approved",
        text: "Really good, but a bit pricey for the size. Still, I would buy it again."
      }
    ]
  };
};

export const initialProducts = [
  ...faceCareProducts.map(p => generateProductData(p, "Face Care")),
  ...hairCareProducts.map(p => generateProductData(p, "Hair Care")),
  ...bodyCareProducts.map(p => generateProductData(p, "Body Care")),
  ...fragranceAndWellnessProducts.map(p => generateProductData(p, "Fragrance & Wellness")),
].map((p, index) => ({ ...p, id: `prod_${index + 1}` }));


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
   {
    slug: 'the-art-of-the-at-home-facial',
    title: 'The Art of the At-Home Facial',
    excerpt: 'You don\'t need a spa appointment to give your skin a rejuvenating treat. Learn how to perform a professional-quality facial at home with our expert tips and product recommendations.',
    author: 'Eleanor Vance',
    imageUrl: 'https://placehold.co/800x400.png',
    imageHint: 'facial mask',
    tags: ['Skincare', 'DIY', 'Facial'],
  },
];

export const blogPostContent: {[key: string]: string} = {
  'the-ultimate-guide-to-a-glowing-skincare-routine': 'Building a consistent skincare routine is the cornerstone of healthy, glowing skin. It doesn\'t need to be complicated, but it should be consistent. Here are the essential steps for a routine that will leave your skin feeling nourished and radiant.\n\n**Step 1: Cleanse**\nStart with a gentle cleanser to remove makeup, dirt, and impurities. For dry or sensitive skin, a cream cleanser is ideal. For oily or acne-prone skin, a gel or foaming cleanser works well. Massage it into your skin for at least 60 seconds before rinsing with lukewarm water.\n\n**Step 2: Tone (Optional but Recommended)**\nA toner helps to remove any last traces of dirt and balances your skin\'s pH. Look for alcohol-free formulas with hydrating or soothing ingredients like rosewater or hyaluronic acid.\n\n**Step 3: Treat with Serums**\nThis is where you target specific concerns. A Vitamin C serum in the morning can protect against environmental damage, while a retinol or peptide serum at night can help with anti-aging. Apply a few drops to your face and neck.\n\n**Step 4: Moisturize**\nHydration is key for all skin types. A good moisturizer locks in all the benefits of your previous steps and keeps your skin barrier healthy. Choose a lightweight lotion for oily skin or a richer cream for dry skin.\n\n**Step 5: Protect with SPF (AM Routine)**\nSunscreen is non-negotiable. It\'s the most effective anti-aging product you can use. Apply a broad-spectrum SPF of 30 or higher every single morning, even on cloudy days.',
  '5-self-care-rituals-to-boost-your-well-being': 'Self-care isn\'t selfish; it\'s essential for maintaining your mental, emotional, and physical health. Here are five simple yet powerful rituals to help you reconnect with yourself.\n\n**1. Mindful Mornings**\nInstead of grabbing your phone first thing, take five minutes to stretch, meditate, or simply enjoy a cup of tea in silence. Setting a calm tone for your day can have a profound impact on your stress levels.\n\n**2. The Weekly Unwind Bath**\nTransform your bathroom into a spa once a week. Add Epsom salts, essential oils, or a bath bomb to a warm bath. Light a candle, play some calming music, and let the stress of the week melt away.\n\n**3. Digital Detox Hour**\nDesignate one hour each day where you put all your devices away. Use this time to read a book, go for a walk, work on a hobby, or simply be present in your surroundings without digital distractions.\n\n**4. Nourish from Within**\nTake the time to prepare a truly nourishing meal for yourself. Focus on whole foods, vibrant colors, and flavors you love. Eating mindfully, without distractions, can turn a simple meal into a restorative experience.\n\n**5. Gratitude Journaling**\nBefore bed, write down three things you were grateful for that day. This simple practice can shift your focus from what\'s wrong to what\'s right, promoting a more positive outlook on life.',
  'the-art-of-the-at-home-facial': 'Transform your bathroom into a personal sanctuary with this guide to the perfect at-home facial. It\'s a wonderful way to de-stress and give your skin the focused attention it deserves.\n\n**1. Set the Mood**\nStart by creating a relaxing atmosphere. Light a scented candle, put on some calming music, and make sure you have clean, fluffy towels ready. This is about the experience as much as the results.\n\n**2. Double Cleanse**\nBegin with an oil-based cleanser to melt away makeup, sunscreen, and excess sebum. Follow up with a water-based cleanser (cream, gel, or foam) to purify the skin and remove any remaining residue. This two-step process ensures your skin is impeccably clean.\n\n**3. Exfoliate Gently**\nNext, slough off dead skin cells to reveal a brighter complexion. You can use a gentle physical scrub with fine particles or a chemical exfoliant with AHAs (like glycolic or lactic acid) or BHAs (salicylic acid). Don\'t overdo it—a few minutes is all you need.\n\n**4. Steam Your Face**\nLean over a bowl of hot water with a towel over your head for 5-10 minutes. Steaming helps to open up your pores, making them more receptive to the treatments that follow. You can add a few drops of essential oil like lavender for an aromatherapy boost.\n\n**5. Apply a Face Mask**\nChoose a mask based on your skin\'s needs. A clay mask is great for detoxifying oily skin, while a hydrating mask with hyaluronic acid is perfect for dry skin. Apply an even layer and relax for 10-15 minutes.\n\n**6. Tone and Moisturize**\nAfter rinsing off the mask, apply your favorite toner, serum, and moisturizer to lock in all the goodness. Gently massage the products into your skin using upward strokes to finish your luxurious at-home facial.',
};

const testimonials: Testimonial[] = [
    {
      name: "Jessica L.",
      text: "The Snail Repair Cream has completely transformed my skin. I've never felt more confident!",
      rating: 5,
    },
    {
      name: "Sarah K.",
      text: "I'm in love with the minimalist packaging and the quality of the products. The Avocado Hair Mask is a must-try.",
      rating: 5,
    },
    {
      name: "Emily R.",
      text: "Glow & Flourish is my new go-to for all things beauty and wellness. Their commitment to clean ingredients is amazing.",
      rating: 5,
    },
  ];

function convertDocToProduct(doc: DocumentSnapshot): Product {
    const data = doc.data();
    if (!data) {
        throw new Error("Document data is missing");
    }
    
    // Convert Firestore Timestamps to JS Dates
    const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();

    return {
        id: doc.id,
        ...data,
        createdAt,
    } as Product;
}

export async function getProducts({
    searchQuery,
    category,
    minPrice,
    maxPrice
}: {
    searchQuery?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
} = {}): Promise<Product[]> {
  try {
    let query: Query = adminDb.collection('products');

    if (category) {
      query = query.where('category', '==', category);
    }
    
    const snapshot = await query.orderBy('name').get();
    
    if (snapshot.empty) {
      return [];
    }

    let products = snapshot.docs.map(convertDocToProduct);
    
    if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase();
        products = products.filter(p =>
            p.name.toLowerCase().includes(lowercasedQuery) ||
            p.description.toLowerCase().includes(lowercasedQuery)
        );
    }
    
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

    return convertDocToProduct(doc);
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
    return convertDocToProduct(doc);
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
      .map(convertDocToProduct);
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

export async function getReviewsByProductId(productId: string): Promise<Review[]> {
    if (!productId) return [];
    try {
        const snapshot = await adminDb.collection('reviews')
            .where('productId', '==', productId)
            .where('status', '==', 'approved')
            .orderBy('createdAt', 'desc')
            .get();

        if (snapshot.empty) {
            return [];
        }

        return snapshot.docs.map(doc => {
            const data = doc.data();
            // Convert Firestore Timestamp to a serializable ISO string
            const createdAt = data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString();
            return {
                id: doc.id,
                ...data,
                createdAt,
            } as Review;
        });

    } catch (error) {
        console.error('Error fetching reviews:', error);
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
      const publishedDate = data.publishedDate?.toDate ? data.publishedDate.toDate() : new Date();
      return {
        id: doc.id,
        ...data,
        publishedDate,
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
    
    const publishedDate = data.publishedDate?.toDate ? data.publishedDate.toDate() : new Date();

    return {
      id: doc.id,
      ...data,
      publishedDate,
    } as BlogPost;
  } catch (error) {
    console.error(`Error fetching blog post by slug ${slug}:`, error);
    return null;
  }
}


export async function getPendingReviews(): Promise<PendingReview[]> {
  try {
    const reviewsSnapshot = await adminDb.collection('reviews')
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .get();
      
    if (reviewsSnapshot.empty) {
      return [];
    }

    const productIds = [...new Set(reviewsSnapshot.docs.map(doc => doc.data().productId))];
    if (productIds.length === 0) return [];
    
    const products = await getProductsByIds(productIds);
    const productsMap = new Map(products.map(p => [p.id, p]));

    const allPendingReviews: PendingReview[] = [];

    reviewsSnapshot.docs.forEach(doc => {
      const reviewData = doc.data();
      const product = productsMap.get(reviewData.productId);
      if (product) {
        const createdAt = reviewData.createdAt?.toDate ? reviewData.createdAt.toDate().toISOString() : new Date().toISOString();
        allPendingReviews.push({
          id: doc.id,
          ...reviewData,
          createdAt,
          productName: product.name,
          productSlug: product.slug,
        } as PendingReview);
      }
    });

    return allPendingReviews;
  } catch (error) {
    console.error("Error fetching pending reviews:", error);
    return [];
  }
}

export async function getAdminDashboardStats() {
    try {
        const ordersPromise = adminDb.collection('orders').get();
        const usersPromise = getAuth().listUsers();
        const pendingReviewsPromise = getPendingReviews();

        const [ordersSnapshot, userRecords, pendingReviews] = await Promise.all([
            ordersPromise, 
            usersPromise, 
            pendingReviewsPromise
        ]);

        let totalRevenue = 0;
        const totalSales = ordersSnapshot.size;
        ordersSnapshot.forEach(doc => {
            totalRevenue += doc.data().total;
        });

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const newUsersThisMonth = userRecords.users.filter(user => {
            const creationTime = new Date(user.metadata.creationTime);
            return creationTime >= oneMonthAgo;
        }).length;

        const recentOrdersSnapshot = await adminDb.collection('orders').orderBy('createdAt', 'desc').limit(5).get();
        const recentOrders = recentOrdersSnapshot.docs.map(doc => {
            const data = doc.data();
            const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
            return {
                id: doc.id,
                ...data,
                createdAt,
            } as Order;
        });

        return {
            totalRevenue,
            totalSales,
            newUsersThisMonth,
            recentOrders,
            totalUsers: userRecords.users.length,
            pendingReviewsCount: pendingReviews.length,
        };

    } catch (error) {
        console.error('Error fetching admin dashboard stats:', error);
        return {
            totalRevenue: 0,
            totalSales: 0,
            newUsersThisMonth: 0,
            totalUsers: 0,
            recentOrders: [] as Order[],
            pendingReviewsCount: 0,
        };
    }
}

export async function getAnalyticsData() {
    try {
        const ordersSnapshot = await adminDb.collection('orders').orderBy('createdAt', 'asc').get();

        if (ordersSnapshot.empty) {
            return { monthlyRevenue: [] };
        }

        const monthlyRevenueMap = new Map<string, number>();

        ordersSnapshot.docs.forEach(doc => {
            const order = doc.data() as Omit<Order, 'id' | 'createdAt'> & { createdAt: { toDate: () => Date } };
            const date = order.createdAt.toDate();
            const monthKey = format(date, 'MMM yy'); // e.g., "Jan 24"
            
            const currentRevenue = monthlyRevenueMap.get(monthKey) || 0;
            monthlyRevenueMap.set(monthKey, currentRevenue + order.total);
        });

        const monthlyRevenue = Array.from(monthlyRevenueMap.entries()).map(([month, revenue]) => ({
            month,
            revenue,
        }));

        return { monthlyRevenue };
    } catch (error) {
        console.error('Error fetching analytics data:', error);
        return { monthlyRevenue: [] };
    }
}

export async function getTestimonials(): Promise<Testimonial[]> {
    return Promise.resolve(testimonials);
}

// Add a function to simulate fetching initial orders for seeding
export const initialOrders = [
  {
    userId: "simulated_user_1",
    items: [
      { productId: "prod_1", name: "Snail Repair Cream", price: 199, quantity: 1, image: "https://placehold.co/600x600.png?text=Snail+Repair+Cream" },
      { productId: "prod_12", name: "Castor Oil Scalp Tonic", price: 159, quantity: 1, image: "https://placehold.co/600x600.png?text=Castor+Oil+Scalp+Tonic" }
    ],
    total: 358.00,
    shippingAddress: {
      fullName: "Jane Doe",
      addressLine1: "123 Main St",
      city: "Anytown",
      state: "CA",
      postalCode: "12345",
      country: "USA"
    },
    status: 'delivered',
    paymentMethod: 'paypal',
    paymentStatus: 'paid',
  },
  {
    userId: "simulated_user_2",
    items: [
      { productId: "prod_23", name: "Sugar Glow Scrub", price: 129, quantity: 2, image: "https://placehold.co/600x600.png?text=Sugar+Glow+Scrub" }
    ],
    total: 258.00,
    shippingAddress: {
      fullName: "John Smith",
      addressLine1: "456 Oak Ave",
      city: "Otherville",
      state: "NY",
      postalCode: "67890",
      country: "USA"
    },
    status: 'shipped',
    paymentMethod: 'delivery',
    paymentStatus: 'unpaid',
  }
];
