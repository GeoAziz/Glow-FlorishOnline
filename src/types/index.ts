import type { User as FirebaseUser } from "firebase/auth";

export type User = FirebaseUser;

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
  reviews: {
    rating: number;
    text: string;
    author: string;
  }[];
  stock: number;
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

export type Order = {
    id: string;
    userId: string;
    items: OrderItem[];
    total: number;
    shippingAddress: ShippingAddress;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    createdAt: Date;
};
