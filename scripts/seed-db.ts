<<<<<<< HEAD

=======
>>>>>>> 0e15c13 (fixes)
// To run this script, use: tsx ./scripts/seed-db.ts

import { adminDb } from '../src/lib/firebase/admin';
import { initialProducts, initialBlogPosts, blogPostContent, initialOrders } from '../src/lib/data';
import { FieldValue } from 'firebase-admin/firestore';
import { randomUUID } from 'crypto';

async function seedDatabase() {
  console.log('Seeding database...');
  
  try {
    // Seed Products
    const productsCollection = adminDb.collection('products');
    const productsBatch = adminDb.batch();

    console.log(`Adding ${initialProducts.length} products...`);
    initialProducts.forEach(productData => {
      const docRef = productsCollection.doc(productData.id);
<<<<<<< HEAD
      
      const productWithTimestamps = {
        ...productData,
        createdAt: new Date(),
        reviews: productData.reviews.map(review => ({
          ...review,
          id: randomUUID(), // Assign a random ID to each review
          createdAt: new Date() // Add current date for seeded reviews
        }))
      };
      
=======
      const productWithTimestamps = {
        ...productData,
        createdAt: new Date().toISOString(),
        reviews: Array.isArray((productData as any).reviews)
          ? (productData as any).reviews.map((review: any) => ({
              ...review,
              id: randomUUID(),
              createdAt: new Date().toISOString()
            }))
          : [],
      };
>>>>>>> 0e15c13 (fixes)
      productsBatch.set(docRef, productWithTimestamps);
    });

    await productsBatch.commit();
    console.log('✅ Products seeded successfully.');

    // Seed Categories
    const categoriesCollection = adminDb.collection('categories');
    const categories = [...new Set(initialProducts.map(p => p.category))];
    const categoriesBatch = adminDb.batch();

    console.log(`Adding ${categories.length} categories...`);
    categories.forEach(categoryName => {
        // Use the category name as the document ID for simplicity and uniqueness
        const docRef = categoriesCollection.doc(categoryName);
        categoriesBatch.set(docRef, { name: categoryName });
    });

    await categoriesBatch.commit();
    console.log('✅ Categories seeded successfully.');
    
    // Seed Blog Posts
    const blogCollection = adminDb.collection('blog_posts');
    const blogBatch = adminDb.batch();
    
    console.log(`Adding ${initialBlogPosts.length} blog posts...`);
    initialBlogPosts.forEach(post => {
        const docRef = blogCollection.doc(post.slug);
        const fullPost = {
            ...post,
            content: blogPostContent[post.slug] || '',
<<<<<<< HEAD
            publishedDate: new Date() // Use current date for seeding
=======
            publishedDate: new Date().toISOString() // Use current date for seeding
>>>>>>> 0e15c13 (fixes)
        };
        blogBatch.set(docRef, fullPost);
    });

    await blogBatch.commit();
    console.log('✅ Blog posts seeded successfully.');

    // Seed Orders
    const ordersCollection = adminDb.collection('orders');
    const ordersBatch = adminDb.batch();

    console.log(`Adding ${initialOrders.length} sample orders...`);
    initialOrders.forEach(orderData => {
<<<<<<< HEAD
      // For orders, we'll let Firestore generate the ID
      const docRef = ordersCollection.doc(); 
      
      const orderWithTimestamp = {
        ...orderData,
        createdAt: FieldValue.serverTimestamp(),
      };
      
=======
      const docRef = ordersCollection.doc(); 
      const orderWithTimestamp = {
        ...orderData,
        createdAt: new Date().toISOString(),
      };
>>>>>>> 0e15c13 (fixes)
      ordersBatch.set(docRef, orderWithTimestamp);
    });

    await ordersBatch.commit();
    console.log('✅ Orders seeded successfully.');


    console.log('Database seeding complete!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
