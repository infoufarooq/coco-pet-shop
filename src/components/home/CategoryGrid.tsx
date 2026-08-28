"use client";

import React from "react";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { ArrowRight, Sparkles } from "lucide-react";

export function CategoryGrid() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Explore By Category
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display mt-2">
              Everything Your Pet Deserves
            </h2>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-900 hover:text-brand-700 hover:underline group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group flex flex-col items-center text-center p-4 rounded-3xl bg-slate-50 hover:bg-brand-50 border border-slate-200/80 hover:border-brand-900/30 shadow-sm hover:shadow-card-hover transition-all duration-300"
            >
              {/* Image Circle */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3.5 border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-300">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Count */}
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-brand-900 transition-colors leading-tight line-clamp-1 font-display">
                {cat.name}
              </h3>
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                {cat.productCount} Products
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
