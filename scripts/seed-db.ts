// To run this script, use: tsx ./scripts/seed-db.ts

import { adminDb } from '../src/lib/firebase/admin';
import { initialProducts } from '../src/lib/data';

async function seedDatabase() {
  console.log('Seeding database...');
  
  try {
    // Seed Products
    const productsCollection = adminDb.collection('products');
    const productsBatch = adminDb.batch();

    console.log(`Adding ${initialProducts.length} products...`);
    initialProducts.forEach(product => {
      // Use the predefined ID from the data as the document ID
      const docRef = productsCollection.doc(product.id);
      productsBatch.set(docRef, product);
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
    
    console.log('Database seeding complete!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
