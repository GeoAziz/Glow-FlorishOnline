
"use client";

import { createContext, useState, useEffect, type ReactNode, useCallback } from "react";
import type { CartItem, Product } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import * as CartActions from "@/actions/cart";

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  loading: boolean;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const getLocalCart = (): CartItem[] => {
    try {
      const storedCart = localStorage.getItem("cart");
      return storedCart ? JSON.parse(storedCart) : [];
    } catch {
      return [];
    }
  };
  
  const setLocalCart = (cartItems: CartItem[]) => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }

  // Effect to handle user login/logout
  useEffect(() => {
    const syncCarts = async () => {
      if (user) {
        setLoading(true);
        const localCart = getLocalCart();
        if (localCart.length > 0) {
            await CartActions.mergeCarts(user.uid, localCart);
            localStorage.removeItem("cart"); // Clear local cart after merge
        }
        const remoteCart = await CartActions.getCart(user.uid);
        setCart(remoteCart);
        setLoading(false);
      } else if (!authLoading) {
        // User is logged out
        setCart(getLocalCart());
        setLoading(false);
      }
    };
    syncCarts();
  }, [user, authLoading]);

  const addToCart = useCallback(async (product: Product, quantity = 1) => {
    if (user) {
        const currentCart = [...cart];
        const existingItemIndex = currentCart.findIndex(item => item.product.id === product.id);
        if (existingItemIndex > -1) {
            currentCart[existingItemIndex].quantity += quantity;
        } else {
            currentCart.push({ product, quantity });
        }
        setCart(currentCart);

        const result = await CartActions.addToCart(user.uid, product.id, quantity);
        if (result?.error) {
            toast({ title: "Error", description: result.error, variant: "destructive" });
            const remoteCart = await CartActions.getCart(user.uid);
            setCart(remoteCart); // Revert to server state
        }
    } else {
        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.product.id === product.id);
            let newCart: CartItem[];
            if (existingItem) {
                newCart = prevCart.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                newCart = [...prevCart, { product, quantity }];
            }
            setLocalCart(newCart);
            return newCart;
        });
    }
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  }, [user, cart, toast]);
  

  const removeFromCart = useCallback(async (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
    if (user) {
        await CartActions.removeFromCart(user.uid, productId);
    } else {
        const newCart = getLocalCart().filter(item => item.product.id !== productId);
        setLocalCart(newCart);
    }
     toast({
      title: "Item Removed",
      description: `An item has been removed from your cart.`,
    });
  }, [user, toast]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
     if (user) {
        await CartActions.updateCartItemQuantity(user.uid, productId, quantity);
    } else {
        const newCart = getLocalCart().map(item => item.product.id === productId ? {...item, quantity} : item);
        setLocalCart(newCart);
    }
  }, [user, removeFromCart]);

  const clearCart = useCallback(async () => {
    setCart([]);
    if (user) {
        await CartActions.clearCart(user.uid);
    } else {
        localStorage.removeItem("cart");
    }
  }, [user]);

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        loading: loading || authLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
