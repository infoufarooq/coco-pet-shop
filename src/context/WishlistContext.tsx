"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { PRODUCTS } from "@/data/products";
import { CartContext } from "@/context/CartContext";

const WISHLIST_STORAGE_KEY = "coco_petshop_wishlist";

export interface WishlistContextType {
  wishlist: string[];
  wishlistCount: number;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  moveAllToCart: () => void;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const cartContext = useContext(CartContext);

  // Initialize wishlist from localStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved =
        localStorage.getItem(WISHLIST_STORAGE_KEY) ||
        localStorage.getItem("coco_wishlist");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setWishlist(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage:", error);
    }
  }, []);

  // Sync wishlist to localStorage whenever state changes
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage:", error);
    }
  }, [wishlist, isMounted]);

  const isInWishlist = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist]
  );

  const addToWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        if (prev.includes(productId)) return prev;
        const product = PRODUCTS.find((p) => p.id === productId);
        cartContext?.showToast(
          "Added to Wishlist ❤️",
          product ? `${product.name} saved to your favorites.` : "Item added to your wishlist.",
          "success"
        );
        return [...prev, productId];
      });
    },
    [cartContext]
  );

  const removeFromWishlist = useCallback(
    (productId: string) => {
      setWishlist((prev) => {
        if (!prev.includes(productId)) return prev;
        const product = PRODUCTS.find((p) => p.id === productId);
        cartContext?.showToast(
          "Removed from Wishlist",
          product ? `${product.name} removed from your favorites.` : "Item removed from your wishlist.",
          "info"
        );
        return prev.filter((id) => id !== productId);
      });
    },
    [cartContext]
  );

  const toggleWishlist = useCallback(
    (productId: string) => {
      if (wishlist.includes(productId)) {
        removeFromWishlist(productId);
      } else {
        addToWishlist(productId);
      }
    },
    [wishlist, addToWishlist, removeFromWishlist]
  );

  const clearWishlist = useCallback(() => {
    if (wishlist.length === 0) return;
    setWishlist([]);
    cartContext?.showToast(
      "Wishlist Cleared",
      "All saved items have been cleared from your wishlist.",
      "info"
    );
  }, [wishlist.length, cartContext]);

  const moveAllToCart = useCallback(() => {
    if (wishlist.length === 0) return;

    let addedCount = 0;
    wishlist.forEach((productId) => {
      const product = PRODUCTS.find((p) => p.id === productId);
      if (product && cartContext?.addToCart) {
        const defaultVariant = product.variants?.options[0]
          ? {
              type: product.variants.type,
              label: product.variants.options[0].label,
              value: product.variants.options[0].value,
              priceModifier: product.variants.options[0].priceModifier,
            }
          : undefined;
        cartContext.addToCart(product, 1, defaultVariant);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      cartContext?.showToast(
        "Wishlist Moved to Bag 🐾",
        `${addedCount} ${addedCount === 1 ? "item has" : "items have"} been moved to your shopping bag.`,
        "success"
      );
    }
  }, [wishlist, cartContext]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        moveAllToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
