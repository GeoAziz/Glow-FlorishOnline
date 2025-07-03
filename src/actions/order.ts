
'use server';

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import type { Order, OrderItem, ShippingAddress, AdminOrder } from '@/types';
import { getAuth } from 'firebase-admin/auth';

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
    
    const newOrder: Omit<Order, 'id' | 'createdAt'> = {
      userId,
      items,
      total,
      shippingAddress,
      status: 'pending',
      createdAt: FieldValue.serverTimestamp() as any, // Firestore handles the timestamp
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


export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  if (!userId) {
    return [];
  }
  try {
    const ordersSnapshot = await adminDb.collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .get();
      
    if (ordersSnapshot.empty) {
      return [];
    }

    return ordersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to JS Date
      } as Order;
    });
  } catch (error) {
    console.error('Error fetching orders for user:', error);
    return [];
  }
}

export async function getOrders(): Promise<AdminOrder[]> {
    try {
        const ordersSnapshot = await adminDb.collection('orders')
            .orderBy('createdAt', 'desc')
            .get();

        if (ordersSnapshot.empty) {
            return [];
        }

        const userIds = [...new Set(ordersSnapshot.docs.map(doc => doc.data().userId))];

        const userResults = await getAuth().getUsers(userIds.map(uid => ({ uid })));
        const usersMap = new Map(userResults.users.map(user => [user.uid, { name: user.displayName, email: user.email }]));

        return ordersSnapshot.docs.map(doc => {
            const data = doc.data();
            const userId = data.userId;
            const customerInfo = usersMap.get(userId);

            const customer = {
                name: customerInfo?.name || data.shippingAddress.fullName,
                email: customerInfo?.email || null
            };

            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt.toDate(),
                customer,
            } as AdminOrder;
        });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        return [];
    }
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
    if (!orderId || !status) {
        return { success: false, error: 'Order ID and status are required.' };
    }
    try {
        const orderRef = adminDb.collection('orders').doc(orderId);
        await orderRef.update({ status });
        
        revalidatePath('/dashboard/admin/orders');
        revalidatePath(`/order-confirmation/${orderId}`);
        
        return { success: true };
    } catch (error) {
        console.error('Error updating order status:', error);
        return { success: false, error: 'Failed to update order status.' };
    }
}
