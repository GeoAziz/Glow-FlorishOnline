'use server';

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { ContactFormValues } from '@/lib/schemas/contact';

export async function submitContactMessage(data: ContactFormValues) {
    try {
        const contactMessagesRef = adminDb.collection('contact_messages');
        await contactMessagesRef.add({
            ...data,
            submittedAt: FieldValue.serverTimestamp(),
            read: false,
        });

        return { success: true, message: 'Your message has been sent successfully!' };
    } catch (error) {
        console.error('Error submitting contact form:', error);
        return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
}
