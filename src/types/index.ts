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

export type CartItem = {
  product: Product;
  quantity: number;
};
