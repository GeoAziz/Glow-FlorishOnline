import { adminDb } from '../src/lib/firebase/admin';

async function removeEmbeddedReviewsFromProducts() {
  const snapshot = await adminDb.collection('products').get();
  const batch = adminDb.batch();

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    if (Array.isArray(data.reviews)) {
      batch.update(doc.ref, { reviews: [] }); // Remove embedded reviews array
    }
  });

  await batch.commit();
  console.log('✅ Removed embedded reviews from all products!');
}

removeEmbeddedReviewsFromProducts();