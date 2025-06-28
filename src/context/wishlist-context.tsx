"use client";

import { createContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { getWishlist, addToWishlist as addAction, removeFromWishlist as removeAction } from "@/actions/wishlist";
import { useToast } from "@/hooks/use-toast";

export interface WishlistContextType {
  wishlistItems: string[];
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (user) {
      setLoading(true);
      const items = await getWishlist(user.uid);
      setWishlistItems(items);
      setLoading(false);
    } else {
      setWishlistItems([]);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
        fetchWishlist();
    }
  }, [user, authLoading, fetchWishlist]);

  const addToWishlist = async (productId: string) => {
    if (!user) {
        toast({ title: "Please log in", description: "You need to be logged in to add items to your wishlist.", variant: "destructive" });
        return;
    }
    setWishlistItems((prev) => [...prev, productId]);
    const result = await addAction(user.uid, productId);
    if (result.error) {
      setWishlistItems((prev) => prev.filter(id => id !== productId));
      toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "Added to Wishlist", description: "Item added to your wishlist." });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    setWishlistItems((prev) => prev.filter(id => id !== productId));
    const result = await removeAction(user.uid, productId);
    if (result.error) {
       setWishlistItems((prev) => [...prev, productId]);
       toast({ title: "Error", description: result.error, variant: "destructive" });
    } else {
        toast({ title: "Removed from Wishlist", description: "Item removed from your wishlist." });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, isInWishlist, loading: authLoading || loading }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
