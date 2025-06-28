'use server';

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import type { Order, OrderItem, ShippingAddress } from '@/types';

interface CreateOrderArgs {
  userId: string;
  items: OrderItem[];
  total: number;
  shippingAddress: ShippingAddress;
}

export async function createOrder({ userId, items, total, shippingAddress }: CreateOrderArgs) {
  if (!userId || !items || items.length === 0 || !shippingAddress) {
    return { error: 'Missing required order information.' };
  }

  try {
    const orderRef = adminDb.collection('orders').doc();
    
    const newOrder = {
      userId,
      items,
      total,
      shippingAddress,
      status: 'pending' as const,
      createdAt: FieldValue.serverTimestamp(),
    };

    await orderRef.set(newOrder);
    
    // In a real app, you would also decrement stock here in a transaction.
    // For now, we'll skip that part.

    revalidatePath('/checkout');
    return { success: true, orderId: orderRef.id };
  } catch (error) {
    console.error('Error creating order:', error);
    return { error: 'Failed to create order.' };
  }
}

export async function getOrder(orderId: string): Promise<Order | null> {
    if (!orderId) {
        return null;
    }
    try {
        const orderDoc = await adminDb.collection('orders').doc(orderId).get();
        if (orderDoc.exists) {
            const data = orderDoc.data();
            // Convert Firestore Timestamp to JS Date
            const createdAt = data?.createdAt.toDate();
            return { id: orderDoc.id, ...data, createdAt } as Order;
        }
        return null;
    } catch (error) {
        console.error('Error fetching order:', error);
        return null;
    }
}
