'use server';

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

export async function addToWishlist(userId: string, productId: string) {
  if (!userId || !productId) {
    return { error: 'User ID and Product ID are required.' };
  }

  try {
    const wishlistRef = adminDb.collection('wishlists').doc(userId);
    await wishlistRef.set({
      productIds: FieldValue.arrayUnion(productId)
    }, { merge: true });
    
    revalidatePath('/product', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return { error: 'Failed to add item to wishlist.' };
  }
}

export async function removeFromWishlist(userId: string, productId: string) {
  if (!userId || !productId) {
    return { error: 'User ID and Product ID are required.' };
  }
  
  try {
    const wishlistRef = adminDb.collection('wishlists').doc(userId);
    await wishlistRef.update({
      productIds: FieldValue.arrayRemove(productId)
    });

    revalidatePath('/product', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return { error: 'Failed to remove item from wishlist.' };
  }
}

export async function getWishlist(userId: string): Promise<string[]> {
    if (!userId) {
        return [];
    }
    try {
        const wishlistDoc = await adminDb.collection('wishlists').doc(userId).get();
        if (wishlistDoc.exists) {
            const data = wishlistDoc.data();
            return data?.productIds || [];
        }
        return [];
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        return [];
    }
}
