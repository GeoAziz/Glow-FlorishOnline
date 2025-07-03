
import type { User as FirebaseUser } from "firebase/auth";
import type { UserRecord } from 'firebase-admin/auth';

export type UserRole = 'admin' | 'moderator' | 'user';

export interface AppUser extends FirebaseUser {
  role: UserRole;
}

export interface AdminAppUser extends UserRecord {
    role: UserRole;
}

export type User = AppUser;

export type Review = {
  id: string;
  rating: number;
  text: string;
  author: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
};

export type PendingReview = Review & {
  productId: string;
  productSlug: string;
  productName: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  ingredients: string[];
  price: number;
  images: string[];
  category: "Skin" | "Hair" | "Wellness" | "Makeup";
  tags?: string[];
  reviews: Review[];
  stock: number;
  createdAt: Date;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: Date;
  imageUrl: string;
  imageHint?: string;
  tags?: string[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type ShippingAddress = {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type OrderItem = {
  productId: string;
  name:string;
  price: number;
  quantity: number;
  image: string;
};

export type PaymentMethod = 'paypal' | 'delivery';

export type Order = {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    shippingAddress: ShippingAddress;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentMethod: PaymentMethod;
    paymentStatus: 'paid' | 'unpaid';
    paymentDetails?: {
      paypalOrderId?: string;
    };
    createdAt: Date;
};

export type AdminOrder = Order & {
    customer: {
        name: string;
        email: string | null;
    }
};
