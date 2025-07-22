import { adminDb } from '../src/lib/firebase/admin';

async function fixReviewTimestamps() {
  const snapshot = await adminDb.collection('reviews').get();
  const batch = adminDb.batch();

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    let createdAt = data.createdAt;
    if (createdAt && typeof createdAt.toDate === 'function') {
      createdAt = createdAt.toDate().toISOString();
    } else if (createdAt && createdAt._seconds) {
      createdAt = new Date(createdAt._seconds * 1000).toISOString();
    }
    batch.update(doc.ref, { createdAt });
  });

  await batch.commit();
  console.log('✅ All review timestamps fixed!');
}

fixReviewTimestamps();
