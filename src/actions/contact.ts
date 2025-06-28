'use server';

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import * as z from 'zod';

export const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

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
