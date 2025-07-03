
'use server';

import { adminDb } from '@/lib/firebase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Product } from '@/types';
import type { ProductFormValues } from '@/lib/schemas/product';
import { FieldValue } from 'firebase-admin/firestore';

export async function createProduct(data: ProductFormValues) {
    try {
        // Since productFormSchema includes fields not in the Product type (like the string version of images),
        // we create a new object that conforms to Omit<Product, 'id' | 'reviews'>
        const newProduct: Omit<Product, 'id' | 'reviews' | 'createdAt'> = {
            name: data.name,
            slug: data.slug,
            description: data.description,
            longDescription: data.longDescription,
            price: data.price,
            stock: data.stock,
            category: data.category,
            images: data.images,
            ingredients: data.ingredients,
            tags: data.tags,
            reviews: [], // New products have no reviews
        };

        await adminDb.collection('products').add({
            ...newProduct,
            createdAt: FieldValue.serverTimestamp(),
        });

    } catch (error) {
        console.error('Error creating product:', error);
        return { success: false, error: 'Failed to create product.' };
    }

    revalidatePath('/dashboard/admin/products');
    revalidatePath('/shop');
    revalidatePath('/');
    redirect('/dashboard/admin/products');
}

export async function updateProduct(productId: string, data: ProductFormValues) {
    if (!productId) {
        return { success: false, error: 'Product ID is required.' };
    }
    
    try {
        const productRef = adminDb.collection('products').doc(productId);
        // The `data` object from productFormSchema already has the correct shape for updating Firestore
        await productRef.update(data);

    } catch (error) {
        console.error('Error updating product:', error);
        return { success: false, error: 'Failed to update product.' };
    }

    revalidatePath(`/dashboard/admin/products`);
    revalidatePath(`/shop`);
    revalidatePath(`/product/${data.slug}`);
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
