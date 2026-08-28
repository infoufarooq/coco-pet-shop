"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";
import { ArrowRight, Sparkles, Flame, Star, Award } from "lucide-react";

export function FeaturedTabs() {
  const [activeTab, setActiveTab] = useState<"best" | "new" | "featured" | "sale">("best");

  let displayedProducts = PRODUCTS;
  if (activeTab === "best") {
    displayedProducts = PRODUCTS.filter((p) => p.isBestSeller);
  } else if (activeTab === "new") {
    displayedProducts = PRODUCTS.filter((p) => p.isNew || p.featured);
  } else if (activeTab === "featured") {
    displayedProducts = PRODUCTS.filter((p) => p.featured);
  } else if (activeTab === "sale") {
    displayedProducts = PRODUCTS.filter((p) => p.isOnSale || (p.discountPercent && p.discountPercent > 0));
  }

  // Display top 8
  const itemsToShow = displayedProducts.slice(0, 8);

  return (
    <section className="py-12 sm:py-16 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            Curated Collections
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display mt-2">
            Most Loved By Pets & Parents
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Explore our highest rated luxury beds, wholesome pet food, cute apparel, and active toys.
          </p>

          {/* Tab Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 p-1.5 bg-slate-200/70 rounded-full max-w-md mx-auto">
            <button
              onClick={() => setActiveTab("best")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === "best"
                  ? "bg-white text-brand-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Best Sellers</span>
            </button>

            <button
              onClick={() => setActiveTab("new")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === "new"
                  ? "bg-white text-brand-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>New In</span>
            </button>

            <button
              onClick={() => setActiveTab("featured")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === "featured"
                  ? "bg-white text-brand-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>Featured</span>
            </button>

            <button
              onClick={() => setActiveTab("sale")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeTab === "sale"
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span className="text-xs">🏷️</span>
              <span>On Sale</span>
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {itemsToShow.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-extrabold text-xs sm:text-sm py-3 px-8 rounded-full shadow-sm hover:border-slate-400 transition-all group"
          >
            <span>Explore All 20+ Products in Store</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
