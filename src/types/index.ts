import type { User as FirebaseUser } from "firebase/auth";
import type { UserInfo } from 'firebase-admin/auth';

export type UserRole = 'admin' | 'moderator' | 'user';

export interface AppUser extends FirebaseUser {
  role: UserRole;
  id: string; // Added id property
}

export interface AdminAppUser extends UserInfo {
    role: UserRole;
}

export type User = AppUser;

export type Review = {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  text: string;
  author: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string; // Changed to string for serialization
};

export type PendingReview = Review & {
  productSlug: string;
  productName: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  longDescription: string;
  ingredients: string[];
  price: number;
  images: string[];
  category: "Face Care" | "Hair Care" | "Body Care" | "Fragrance & Wellness";
  tags?: string[];
  skinType?: string[];
  rating?: number; // Average rating, can be updated periodically
  stock: number;
  createdAt: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
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
    createdAt: string;
};

export type AdminOrder = Order & {
    customer: {
        name: string;
        email: string | null;
    }
};

export type Testimonial = {
    name: string;
    text: string;
    rating: number;
};
