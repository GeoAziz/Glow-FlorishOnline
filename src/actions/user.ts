'use server';

import { adminDb } from '@/lib/firebase/admin';
import type { UserRole } from '@/types';

interface CreateUserDocumentArgs {
  uid: string;
  email: string | null;
  name?: string | null;
}

export async function createUserDocument({ uid, email, name }: CreateUserDocumentArgs) {
  try {
    const userRef = adminDb.collection('users').doc(uid);
    
    const userDoc = await userRef.get();
    if (userDoc.exists) {
        // User document already exists, do nothing.
        return { success: true, message: 'User document already exists.' };
    }

    await userRef.set({
      uid,
      email,
      displayName: name || email?.split('@')[0] || 'New User',
      role: 'user' as UserRole,
      createdAt: new Date().toISOString(),
    });

    return { success: true, message: 'User document created successfully.' };
  } catch (error) {
    console.error('Error creating user document:', error);
    return { success: false, error: 'Failed to create user document.' };
  }
}
