'use server';

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import * as z from 'zod';

const emailSchema = z.string().email({ message: "Please enter a valid email address." });

export async function subscribeToNewsletter(email: string) {
    const validation = emailSchema.safeParse(email);

    if (!validation.success) {
        return { error: validation.error.errors[0].message };
    }

    try {
        const subscriptionsRef = adminDb.collection('newsletter_subscriptions');
        const docRef = subscriptionsRef.doc(email.toLowerCase());

        const doc = await docRef.get();
        if (doc.exists) {
            return { success: true, message: "You are already subscribed!" };
        }

        await docRef.set({
            email: email.toLowerCase(),
            subscribedAt: FieldValue.serverTimestamp()
        });
        
        return { success: true, message: "Thank you for subscribing!" };

    } catch (error) {
        console.error('Error subscribing to newsletter:', error);
        return { error: 'An unexpected error occurred. Please try again later.' };
    }
}
