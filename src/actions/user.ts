
'use server';

import { adminDb } from '@/lib/firebase/admin';
import type { UserRole, AdminAppUser } from '@/types';
import { getAuth } from 'firebase-admin/auth';
import { revalidatePath } from 'next/cache';
import type { ProfileFormValues } from '@/lib/schemas/user';

interface CreateUserDocumentArgs {
  uid: string;
  email: string | null;
  name?: string | null;
}

export async function createUserDocument({ uid, email, name }: CreateUserDocumentArgs) {
  try {
    const usersCollection = adminDb.collection('users');
    const userRef = usersCollection.doc(uid);
    
    const userDoc = await userRef.get();
    if (userDoc.exists) {
        return { success: true, message: 'User document already exists.' };
    }

    // Check if the users collection is empty.
    const collectionSnapshot = await usersCollection.limit(1).get();
    const isFirstUser = collectionSnapshot.empty;

    await userRef.set({
      uid,
      email,
      displayName: name || email?.split('@')[0] || 'New User',
      // If it's the first user, make them an admin. Otherwise, a regular user.
      role: isFirstUser ? 'admin' : ('user' as UserRole),
      createdAt: new Date().toISOString(),
    });

    return { success: true, message: 'User document created successfully.' };
  } catch (error) {
    console.error('Error creating user document:', error);
    return { success: false, error: 'Failed to create user document.' };
  }
}

export async function getUsers(): Promise<AdminAppUser[]> {
    try {
        const userRecords = await getAuth().listUsers();
        const usersCollection = await adminDb.collection('users').get();
        const rolesMap = new Map(usersCollection.docs.map(doc => [doc.id, doc.data().role]));
        
        return userRecords.users.map(userRecord => ({
            ...userRecord,
            // Assert role type, defaulting to 'user' if not found in Firestore
            role: (rolesMap.get(userRecord.uid) || 'user') as UserRole,
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

export async function updateUserRole(uid: string, role: UserRole) {
    try {
        const userRef = adminDb.collection('users').doc(uid);
        await userRef.update({ role });
        
        revalidatePath('/dashboard/admin/users');
        
        return { success: true };
    } catch (error) {
        console.error('Error updating user role:', error);
        return { success: false, error: 'Failed to update user role.' };
    }
}

export async function updateUserProfile(uid: string, data: ProfileFormValues) {
    if (!uid) {
        return { success: false, error: 'User not found.' };
    }

    try {
        // Update Firebase Auth
        await getAuth().updateUser(uid, {
            displayName: data.displayName,
        });

        // Update Firestore document
        const userRef = adminDb.collection('users').doc(uid);
        await userRef.update({
            displayName: data.displayName,
        });

        revalidatePath('/dashboard/user');
        revalidatePath('/dashboard/user/profile');
        revalidatePath('/', 'layout'); // Revalidate root layout to update UserNav
        
        return { success: true, message: 'Profile updated successfully!' };
    } catch (error) {
        console.error('Error updating user profile:', error);
        return { success: false, error: 'Failed to update profile.' };
    }
}
