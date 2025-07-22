'use server';

import { adminDb } from '@/lib/firebase/admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import type { Order, OrderItem, ShippingAddress, PaymentMethod, AdminOrder } from '@/types';
import { getAuth } from 'firebase-admin/auth';

function toISOString(date: any): string {
  if (!date) return new Date().toISOString();
  if (date instanceof Date) return date.toISOString();
  if (typeof date.toDate === 'function') return date.toDate().toISOString();
  if (date._seconds) return new Date(date._seconds * 1000).toISOString();
  if (typeof date === 'string') return date;
  return new Date(date).toISOString();
}

interface CreateOrderArgs {
  userId: string;
  items: OrderItem[];
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    paypalOrderId?: string;
  };
}
export async function createOrder({
  userId,
  items,
  total,
  shippingAddress,
  paymentMethod,
  paymentDetails
}: CreateOrderArgs): Promise<{ orderId?: string; error?: string }> {
  try {
    const result = await adminDb.runTransaction(async transaction => {
      const productRefs = items.map(item => adminDb.collection('products').doc(item.productId));
      const productDocs = await transaction.getAll(...productRefs);

      // Check for stock and prepare updates
      for (const doc of productDocs) {
        if (!doc.exists) {
          throw new Error(`One of the products in your cart could not be found.`);
        }
        const productData = doc.data()!;
        const orderedItem = items.find(item => item.productId === doc.id);

        if (!orderedItem) {
          // This case should not be reachable if cart data is consistent
          throw new Error(`Inconsistency in cart data for product ID ${doc.id}`);
        }
        
        if (productData.stock < orderedItem.quantity) {
          throw new Error(`Sorry, "${productData.name}" is out of stock. Please remove it from your cart and try again.`);
        }
      }

      // If all checks pass, perform writes
      productDocs.forEach(doc => {
        const orderedItem = items.find(item => item.productId === doc.id)!;
        const newStock = doc.data()!.stock - orderedItem.quantity;
        transaction.update(doc.ref, { stock: newStock });
      });

      // Create the new order document
      const orderRef = adminDb.collection('orders').doc();
      const newOrder: Omit<Order, 'id' | 'createdAt'> = {
        userId,
        items,
        total,
        shippingAddress,
        status: 'pending',
        paymentMethod,
        paymentStatus: paymentMethod === 'paypal' ? 'paid' : 'unpaid',
        paymentDetails: paymentDetails || {},
      };
      transaction.set(orderRef, {
        ...newOrder,
        createdAt: FieldValue.serverTimestamp(),
      });

      return orderRef.id;
    });
    return { orderId: result };
  } catch (error: any) {
    // Return the specific error message from the transaction to the client
    return { error: error.message || 'Failed to create order due to an unexpected error.' };
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
            if (!data) return null;
            const createdAt = data.createdAt ? toISOString(data.createdAt) : new Date().toISOString();
            return {
                id: orderDoc.id,
                userId: data.userId,
                items: data.items,
                total: data.total,
                shippingAddress: data.shippingAddress,
                status: data.status,
                paymentMethod: data.paymentMethod,
                paymentStatus: data.paymentStatus,
                paymentDetails: data.paymentDetails,
                createdAt,
            } as Order;
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
            if (!data) {
                return {
                    id: doc.id,
                    userId: '',
                    items: [],
                    total: 0,
                    shippingAddress: {} as ShippingAddress,
                    status: 'pending',
                    paymentMethod: 'paypal',
                    paymentStatus: 'unpaid',
                    paymentDetails: {},
                    createdAt: new Date().toISOString(),
                } as Order;
            }
            return {
                id: doc.id,
                userId: data.userId,
                items: data.items,
                total: data.total,
                shippingAddress: data.shippingAddress,
                status: data.status,
                paymentMethod: data.paymentMethod,
                paymentStatus: data.paymentStatus,
                paymentDetails: data.paymentDetails,
                createdAt: data.createdAt ? toISOString(data.createdAt) : new Date().toISOString(),
            } as Order;
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
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

        return await Promise.all(ordersSnapshot.docs.map(async doc => {
            const data = doc.data();
            let customerInfo = null;
            if (data.userId) {
                try {
                    const userRecord = await getAuth().getUser(data.userId);
                    customerInfo = {
                        name: userRecord.displayName,
                        email: userRecord.email,
                    };
                } catch {
                    customerInfo = null;
                }
            }
            return {
                id: doc.id,
                userId: data.userId,
                items: data.items,
                total: data.total,
                shippingAddress: data.shippingAddress,
                status: data.status,
                paymentMethod: data.paymentMethod,
                paymentStatus: data.paymentStatus,
                paymentDetails: data.paymentDetails,
                createdAt: data.createdAt ? toISOString(data.createdAt) : new Date().toISOString(),
                customer: customerInfo,
            } as AdminOrder;
        }));
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
