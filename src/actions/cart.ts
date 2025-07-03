
'use server';

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import type { CartItem, Product, OrderItem } from '@/types';
import { getProductsByIds } from '@/lib/data';

// Firestore cart item stores only the ID and quantity
type FirestoreCartItem = {
  productId: string;
  quantity: number;
}

export async function getCart(userId: string): Promise<CartItem[]> {
  if (!userId) {
    return [];
  }
  try {
    const cartDoc = await adminDb.collection('carts').doc(userId).get();
    if (!cartDoc.exists) {
      return [];
    }
    
    const firestoreItems = cartDoc.data()?.items as FirestoreCartItem[] || [];
    if (firestoreItems.length === 0) {
        return [];
    }

    const productIds = firestoreItems.map(item => item.productId);
    const products = await getProductsByIds(productIds);

    const productsMap = new Map(products.map(p => [p.id, p]));

    const cartItems: CartItem[] = firestoreItems.map(item => {
        const product = productsMap.get(item.productId);
        if (product) {
            return { product, quantity: item.quantity };
        }
        return null;
    }).filter((item): item is CartItem => item !== null);

    return cartItems;

  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  if (!userId || !productId || quantity <= 0) {
    return { error: 'Invalid arguments' };
  }

  try {
    const cartRef = adminDb.collection('carts').doc(userId);
    const cartDoc = await cartRef.get();

    if (cartDoc.exists) {
        const items = cartDoc.data()?.items as FirestoreCartItem[] || [];
        const existingItemIndex = items.findIndex(item => item.productId === productId);

        if (existingItemIndex > -1) {
            items[existingItemIndex].quantity += quantity;
            await cartRef.update({ items });
        } else {
            await cartRef.update({
                items: FieldValue.arrayUnion({ productId, quantity })
            });
        }
    } else {
        await cartRef.set({ items: [{ productId, quantity }] });
    }
    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { error: 'Failed to add item to cart.' };
  }
}

export async function removeFromCart(userId: string, productId: string) {
    if (!userId || !productId) {
        return { error: 'Invalid arguments' };
    }
    try {
        const cartRef = adminDb.collection('carts').doc(userId);
        const cartDoc = await cartRef.get();
        if (cartDoc.exists) {
            const items = cartDoc.data()?.items as FirestoreCartItem[] || [];
            const updatedItems = items.filter(item => item.productId !== productId);
            await cartRef.update({ items: updatedItems });
        }
        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        console.error('Error removing from cart:', error);
        return { error: 'Failed to remove item from cart.' };
    }
}

export async function updateCartItemQuantity(userId: string, productId: string, quantity: number) {
     if (!userId || !productId || quantity <= 0) {
        return removeFromCart(userId, productId);
    }
    try {
        const cartRef = adminDb.collection('carts').doc(userId);
        const cartDoc = await cartRef.get();
        if (cartDoc.exists) {
            const items = cartDoc.data()?.items as FirestoreCartItem[] || [];
            const itemIndex = items.findIndex(item => item.productId === productId);
            if (itemIndex > -1) {
                items[itemIndex].quantity = quantity;
                await cartRef.update({ items });
            }
        }
        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        return { error: 'Failed to update item quantity.' };
    }
}

export async function clearCart(userId: string) {
    if (!userId) {
        return { error: 'User ID is required' };
    }
    try {
        const cartRef = adminDb.collection('carts').doc(userId);
        await cartRef.update({ items: [] });
        revalidatePath('/cart');
        return { success: true };
    } catch (error) {
        console.error('Error clearing cart:', error);
        return { error: 'Failed to clear cart.' };
    }
}

export async function mergeCarts(userId: string, localCart: CartItem[]) {
    if (!userId || !localCart || localCart.length === 0) {
        return { success: true };
    }

    try {
        const cartRef = adminDb.collection('carts').doc(userId);
        const cartDoc = await cartRef.get();
        let remoteItems: FirestoreCartItem[] = [];

        if (cartDoc.exists) {
            remoteItems = cartDoc.data()?.items as FirestoreCartItem[] || [];
        }

        const remoteItemsMap = new Map(remoteItems.map(item => [item.productId, item]));

        localCart.forEach(localItem => {
            const remoteItem = remoteItemsMap.get(localItem.product.id);
            if (remoteItem) {
                remoteItem.quantity += localItem.quantity;
            } else {
                remoteItemsMap.set(localItem.product.id, {
                    productId: localItem.product.id,
                    quantity: localItem.quantity
                });
            }
        });

        await cartRef.set({ items: Array.from(remoteItemsMap.values()) });
        return { success: true };
    } catch (error) {
        console.error('Error merging carts:', error);
        return { error: 'Failed to merge local and remote carts.' };
    }
}
