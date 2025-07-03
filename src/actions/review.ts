'use server';

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import * as z from 'zod';

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
            rating: data.rating,
            text: data.text,
            author: data.author,
            // In a real app, you might want to add a status for moderation
            // status: 'pending', 
            // createdAt: FieldValue.serverTimestamp()
        };

        await productRef.update({
            reviews: FieldValue.arrayUnion(newReview)
        });

    } catch (error) {
        console.error('Error submitting review:', error);
        return { success: false, error: 'Failed to submit review.' };
    }

    revalidatePath(`/product/${data.slug}`);
    return { success: true, message: "Thank you for your review!" };
}
