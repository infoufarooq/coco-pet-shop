"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, wishlistCount, clearWishlist, moveAllToCart } = useWishlist();

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10" data-testid="wishlist-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "Saved Wishlist" }]} />

        <div className="my-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full flex items-center gap-1 w-fit">
                <Heart className="w-3.5 h-3.5 fill-rose-600" />
                <span>Saved Favorites</span>
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-950 font-display mt-2">
                Your Pet Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Save your favorite pet essentials and easily add them to your shopping bag anytime.
              </p>
            </div>

            {wishlistedProducts.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={moveAllToCart}
                  data-testid="move-all-to-cart-btn"
                  className="bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Move All to Bag</span>
                </button>

                <button
                  type="button"
                  onClick={clearWishlist}
                  data-testid="clear-wishlist-btn"
                  className="bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold text-xs py-2.5 px-4 rounded-xl border border-slate-200 hover:border-rose-200 transition-all flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>

                <span
                  data-testid="wishlist-badge-count"
                  className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm"
                >
                  {wishlistCount} {wishlistCount === 1 ? "item" : "items"}
                </span>
              </div>
            )}
          </div>

          {wishlistedProducts.length === 0 ? (
            <div
              data-testid="empty-wishlist"
              className="bg-white rounded-3xl border border-slate-200/80 p-12 sm:p-16 text-center max-w-xl mx-auto my-10 shadow-sm"
            >
              <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Your Wishlist is Empty
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6 leading-relaxed">
                Tap the heart icon on any product in our store to save items for future purchases.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs py-3 px-6 rounded-xl shadow transition-colors"
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
