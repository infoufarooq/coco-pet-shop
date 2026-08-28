"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem, Coupon } from "@/types";
import { COUPONS } from "@/data/products";
import { VERIFIED_STORE_INFO } from "@/lib/utils";

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning";
}

interface CartContextType {
  cart: CartItem[];
  wishlist: string[];
  appliedCoupon: Coupon | null;
  isCartOpen: boolean;
  quickViewProduct: Product | null;
  toasts: ToastMessage[];
  cartCount: number;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  total: number;
  freeShippingProgress: number;
  addToCart: (product: Product, quantity?: number, selectedVariant?: CartItem["selectedVariant"]) => void;
  removeFromCart: (productId: string, variantValue?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantValue?: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  openCart: () => void;
  closeCart: () => void;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;
  showToast: (title: string, message: string, type?: ToastMessage["type"]) => void;
  dismissToast: (id: string) => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedCart = localStorage.getItem("coco_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("coco_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedCoupon = localStorage.getItem("coco_coupon");
      if (savedCoupon) setAppliedCoupon(JSON.parse(savedCoupon));
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem("coco_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [cart, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem("coco_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Failed to save wishlist", e);
    }
  }, [wishlist, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      if (appliedCoupon) {
        localStorage.setItem("coco_coupon", JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem("coco_coupon");
      }
    } catch (e) {
      console.error("Failed to save coupon", e);
    }
  }, [appliedCoupon, isMounted]);

  const showToast = (title: string, message: string, type: ToastMessage["type"] = "success") => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: Product, quantity = 1, selectedVariant?: CartItem["selectedVariant"]) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          (item.selectedVariant?.value === selectedVariant?.value || (!item.selectedVariant && !selectedVariant))
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedVariant }];
      }
    });

    showToast("Added to Cart 🐾", `${product.name} (x${quantity}) was added to your bag.`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantValue?: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) => !(item.product.id === productId && (!variantValue || item.selectedVariant?.value === variantValue))
      )
    );
    showToast("Item Removed", "Product removed from your shopping bag.", "info");
  };

  const updateQuantity = (productId: string, quantity: number, variantValue?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantValue);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId && (!variantValue || item.selectedVariant?.value === variantValue)) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Wishlist Updated", "Item removed from your wishlist.", "info");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Added to Wishlist ❤️", "Item saved for later.", "success");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = COUPONS.find((c) => c.code.toUpperCase() === trimmed);

    if (!found) {
      return { success: false, message: "Invalid promo code. Try 'COCOFIRST' for 15% off!" };
    }

    if (found.minSpend && subtotal < found.minSpend) {
      return {
        success: false,
        message: `This coupon requires a minimum subtotal of Rs. ${found.minSpend.toLocaleString()}.`,
      };
    }

    setAppliedCoupon(found);
    showToast("Promo Code Applied! 🎉", `${found.discountPercent}% discount has been added to your order.`);
    return { success: true, message: `Promo code ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast("Coupon Removed", "Discount code has been removed.", "info");
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const openQuickView = (product: Product) => setQuickViewProduct(product);
  const closeQuickView = () => setQuickViewProduct(null);

  // Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.price + (item.selectedVariant?.priceModifier || 0);
    return sum + price * item.quantity;
  }, 0);

  const discountAmount = appliedCoupon ? (subtotal * appliedCoupon.discountPercent) / 100 : 0;

  const shippingAmount =
    subtotal === 0 || subtotal >= VERIFIED_STORE_INFO.freeShippingThreshold
      ? 0
      : VERIFIED_STORE_INFO.standardShippingFee;

  const total = Math.max(0, subtotal - discountAmount + shippingAmount);

  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / VERIFIED_STORE_INFO.freeShippingThreshold) * 100)
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        appliedCoupon,
        isCartOpen,
        quickViewProduct,
        toasts,
        cartCount,
        subtotal,
        discountAmount,
        shippingAmount,
        total,
        freeShippingProgress,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        openCart,
        closeCart,
        openQuickView,
        closeQuickView,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
