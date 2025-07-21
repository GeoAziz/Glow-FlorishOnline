
import { adminDb } from '../src/lib/firebase/admin';
import { initialProducts, initialBlogPosts, blogPostContent } from '../src/lib/data';
import { FieldValue } from 'firebase-admin/firestore';

async function seedDatabase() {
  console.log('Seeding database with new product line...');
  
  try {
    // Clear existing products and categories for a clean slate
    console.log('Clearing existing products...');
    const productsSnapshot = await adminDb.collection('products').get();
    const deleteProductsBatch = adminDb.batch();
    productsSnapshot.docs.forEach(doc => deleteProductsBatch.delete(doc.ref));
    await deleteProductsBatch.commit();
    console.log('Existing products cleared.');

    console.log('Clearing existing categories...');
    const categoriesSnapshot = await adminDb.collection('categories').get();
    const deleteCategoriesBatch = adminDb.batch();
    categoriesSnapshot.docs.forEach(doc => deleteCategoriesBatch.delete(doc.ref));
    await deleteCategoriesBatch.commit();
    console.log('Existing categories cleared.');
    
    // Seed Products
    const productsCollection = adminDb.collection('products');
    const productsBatch = adminDb.batch();

    console.log(`Adding ${initialProducts.length} new products...`);
    initialProducts.forEach(productData => {
      const docRef = productsCollection.doc(); // Let Firestore generate ID
      
      const productWithTimestamps = {
        ...productData,
        createdAt: FieldValue.serverTimestamp(),
      };
      
      productsBatch.set(docRef, productWithTimestamps);
    });

    await productsBatch.commit();
    console.log('✅ New products seeded successfully.');

    // Seed Categories from new product data
    const categoriesCollection = adminDb.collection('categories');
    const categories = [...new Set(initialProducts.map(p => p.category))];
    const categoriesBatch = adminDb.batch();

    console.log(`Adding ${categories.length} new categories...`);
    categories.forEach(categoryName => {
        const docRef = categoriesCollection.doc(categoryName.replace(/\s+/g, '-').toLowerCase());
        categoriesBatch.set(docRef, { name: categoryName });
    });

    await categoriesBatch.commit();
    console.log('✅ New categories seeded successfully.');
    
    // Seed Blog Posts (assuming these are still relevant)
    const blogCollection = adminDb.collection('blog_posts');
    const blogBatch = adminDb.batch();
    
    console.log(`Adding ${initialBlogPosts.length} blog posts...`);
    initialBlogPosts.forEach(post => {
        const docRef = blogCollection.doc(post.slug);
        const fullPost = {
            ...post,
            content: blogPostContent[post.slug] || '',
            publishedDate: FieldValue.serverTimestamp()
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
