
// To run this script, use: tsx ./scripts/seed-db.ts

import { adminDb } from '../src/lib/firebase/admin';
import { initialProducts, initialBlogPosts, blogPostContent } from '../src/lib/data';
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
      
      const productWithTimestamps = {
        ...productData,
        createdAt: new Date(),
        reviews: productData.reviews.map(review => ({
          ...review,
          id: randomUUID(), // Assign a random ID to each review
          createdAt: new Date() // Add current date for seeded reviews
        }))
      };
      
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
            publishedDate: new Date() // Use current date for seeding
        };
        blogBatch.set(docRef, fullPost);
    });

    await blogBatch.commit();
    console.log('✅ Blog posts seeded successfully.');


    console.log('Database seeding complete!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
