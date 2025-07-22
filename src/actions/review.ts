<<<<<<< HEAD

'use server';

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
=======
'use server';

import { adminDb } from '@/lib/firebase/admin';
>>>>>>> 0e15c13 (fixes)
import { revalidatePath } from 'next/cache';
import type { Review } from '@/types';
import type { ReviewFormValues } from '@/lib/schemas/review';

export async function submitReview(data: ReviewFormValues) {
    try {
        const newReview: Omit<Review, 'id' | 'createdAt'> = {
            productId: data.productId,
            userId: data.userId,
            rating: data.rating,
            text: data.text,
            author: data.author,
            status: 'pending',
        };

        await adminDb.collection('reviews').add({
            ...newReview,
<<<<<<< HEAD
            createdAt: FieldValue.serverTimestamp(),
=======
            createdAt: new Date().toISOString(),
>>>>>>> 0e15c13 (fixes)
        });

    } catch (error) {
        console.error('Error submitting review:', error);
        return { success: false, error: 'Failed to submit review.' };
    }

    revalidatePath(`/product/${data.slug}`);
    return { success: true, message: "Thank you for your review! It will be visible after moderation." };
}

async function updateReviewStatus(reviewId: string, status: 'approved' | 'rejected') {
    if (!reviewId || !status) {
        return { success: false, error: 'Missing required information.' };
    }

    try {
        const reviewRef = adminDb.collection('reviews').doc(reviewId);
        
        await reviewRef.update({ status });
        
        revalidatePath(`/dashboard/mod/reviews`);
        // We need to revalidate the product page, but we don't have the slug here.
        // A broader revalidation is acceptable in this admin action.
        revalidatePath('/product', 'layout');

        return { success: true };
    } catch (error) {
        console.error('Error updating review status:', error);
        return { success: false, error: 'Failed to update review status.' };
    }
}

export async function approveReview(reviewId: string) {
    return updateReviewStatus(reviewId, 'approved');
}

export async function rejectReview(reviewId: string) {
    return updateReviewStatus(reviewId, 'rejected');
}
