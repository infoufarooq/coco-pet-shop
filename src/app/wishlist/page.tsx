"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlist } = useCart();

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Saved Wishlist" }]} />

        <div className="my-6">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
                Saved Favorites
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 font-display mt-2">
                Your Pet Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Save your favorite pet essentials and easily add them to your shopping bag anytime.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
              {wishlistedProducts.length} {wishlistedProducts.length === 1 ? "item" : "items"}
            </span>
          </div>

          {wishlistedProducts.length === 0 ? (
            <div className="bg-white rounded-4xl border border-slate-200/80 p-12 sm:p-16 text-center max-w-xl mx-auto my-10 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Your Wishlist is Empty
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                Tap the heart icon on any product in our store to save items for future purchases.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs py-3 px-6 rounded-full shadow transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Products</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
