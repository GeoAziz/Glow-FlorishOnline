
'use server';

import { adminDb } from '@/lib/firebase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import * as z from 'zod';
import type { Product } from '@/types';

// New schema for product creation/editing
export const productFormSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters.' }),
  slug: z.string().min(3, { message: 'Slug must be at least 3 characters.' })
    .regex(/^[a-z0-9-]+$/, { message: 'Slug can only contain lowercase letters, numbers, and hyphens.' }),
  description: z.string().min(10, { message: 'Short description must be at least 10 characters.' }),
  longDescription: z.string().min(20, { message: 'Full description must be at least 20 characters.' }),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number.' }),
  stock: z.coerce.number().int().min(0, { message: 'Stock must be a non-negative integer.' }),
  category: z.enum(['Skin', 'Hair', 'Wellness', 'Makeup']),
  images: z.string().min(1, { message: 'Please provide at least one image URL.' })
    .transform(val => val.split(',').map(s => s.trim()).filter(url => url)),
  ingredients: z.string().min(1, { message: 'Please list at least one ingredient.' })
    .transform(val => val.split(',').map(s => s.trim())),
  tags: z.string().optional()
    .transform(val => val ? val.split(',').map(s => s.trim()) : []),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export async function createProduct(data: ProductFormValues) {
    try {
        const newProduct: Omit<Product, 'id' | 'reviews'> = {
            ...data,
            reviews: [], // New products have no reviews
        };

        await adminDb.collection('products').add(newProduct);

    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: 'Failed to create product.' };
    }

    revalidatePath('/dashboard/admin/products');
    revalidatePath('/shop');
    revalidatePath('/');
    redirect('/dashboard/admin/products');
}


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
