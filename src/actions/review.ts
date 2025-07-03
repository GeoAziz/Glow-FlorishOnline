
'use server';

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';
import { randomUUID } from 'crypto';
import type { Product } from '@/types';

export const reviewFormSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  rating: z.coerce.number().min(1, "Rating is required.").max(5),
  text: z.string().min(10, { message: "Review must be at least 10 characters." }),
  author: z.string(),
});

type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export async function submitReview(data: ReviewFormValues) {
    try {
        const productRef = adminDb.collection('products').doc(data.productId);

        const newReview = {
            id: randomUUID(),
            rating: data.rating,
            text: data.text,
            author: data.author,
            status: 'pending', // Add status for moderation
            createdAt: FieldValue.serverTimestamp(), // Add server timestamp
        };

        await productRef.update({
            reviews: FieldValue.arrayUnion(newReview)
        });

    } catch (error) {
        console.error('Error submitting review:', error);
        return { success: false, error: 'Failed to submit review.' };
    }

    revalidatePath(`/product/${data.slug}`);
    return { success: true, message: "Thank you for your review! It will be visible after moderation." };
}

async function updateReviewStatus(productId: string, reviewId: string, status: 'approved' | 'rejected') {
    if (!productId || !reviewId || !status) {
        return { success: false, error: 'Missing required information.' };
    }

    try {
        const productRef = adminDb.collection('products').doc(productId);
        const productDoc = await productRef.get();

        if (!productDoc.exists) {
            return { success: false, error: 'Product not found.' };
        }

        const productData = productDoc.data() as Product;
        const reviewIndex = productData.reviews.findIndex(r => r.id === reviewId);

        if (reviewIndex === -1) {
            return { success: false, error: 'Review not found.' };
        }

        // Create a new reviews array with the updated status
        const updatedReviews = [...productData.reviews];
        updatedReviews[reviewIndex] = {
            ...updatedReviews[reviewIndex],
            status: status
        };

        await productRef.update({ reviews: updatedReviews });
        
        revalidatePath(`/dashboard/mod/reviews`);
        revalidatePath(`/product/${productData.slug}`);

        return { success: true };
    } catch (error) {
        console.error('Error updating review status:', error);
        return { success: false, error: 'Failed to update review status.' };
    }
}

export async function approveReview(productId: string, reviewId: string) {
    return updateReviewStatus(productId, reviewId, 'approved');
}

export async function rejectReview(productId: string, reviewId: string) {
    return updateReviewStatus(productId, reviewId, 'rejected');
}
