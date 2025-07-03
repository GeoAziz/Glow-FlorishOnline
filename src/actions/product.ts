
'use server';

import { adminDb } from '@/lib/firebase/admin';
import { revalidatePath } from 'next/cache';

export async function deleteProduct(productId: string) {
    if (!productId) {
        return { success: false, error: 'Product ID is required.' };
    }

    try {
        await adminDb.collection('products').doc(productId).delete();
        
        revalidatePath('/dashboard/admin/products');
        revalidatePath('/shop');
        revalidatePath('/');
        
        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        return { success: false, error: 'Failed to delete product.' };
    }
}
