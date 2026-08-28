"use client";

import React from "react";
import { CATEGORIES } from "@/data/categories";
import { formatPKR } from "@/lib/utils";
import { SlidersHorizontal, RotateCcw, Check, Sparkles } from "lucide-react";

export interface FilterState {
  category: string;
  subCategory: string;
  petType: string;
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  rating: number;
  sortBy: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export function ProductFilters({
  filters,
  onChange,
  onReset,
  totalResults,
}: ProductFiltersProps) {
  const handleCategorySelect = (catSlug: string) => {
    onChange({
      ...filters,
      category: catSlug,
      subCategory: "", // reset subcategory when category changes
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm font-display">
          <SlidersHorizontal className="w-4 h-4 text-brand-900" />
          <span>Filters ({totalResults})</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Pet Type Toggle (Dogs / Cats / All) */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Pet Type
        </label>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-2xl">
          {[
            { label: "All Pets", value: "all" },
            { label: "🐶 Dogs", value: "dog" },
            { label: "🐱 Cats", value: "cat" },
          ].map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => onChange({ ...filters, petType: type.value })}
              className={`py-1.5 text-xs font-bold rounded-xl transition-all ${
                filters.petType === type.value
                  ? "bg-white text-brand-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Categories
        </label>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => handleCategorySelect("all")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              filters.category === "all"
                ? "bg-brand-900 text-white"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span>All Categories</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              filters.category === "all" ? "bg-brand-800 text-white" : "bg-slate-100 text-slate-500"
            }`}>
              All
            </span>
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategorySelect(cat.slug)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                filters.category === cat.slug
                  ? "bg-brand-900 text-white"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="truncate">{cat.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                filters.category === cat.slug ? "bg-brand-800 text-white" : "bg-slate-100 text-slate-500"
              }`}>
                {cat.productCount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Price Range (PKR)
          </label>
          <span className="text-xs font-bold text-brand-900">
            Up to {formatPKR(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={15000}
          step={500}
          value={filters.maxPrice}
          onChange={(e) =>
            onChange({ ...filters, maxPrice: Number(e.target.value) })
          }
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-900"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
          <span>Rs. 500</span>
          <span>Rs. 7,500</span>
          <span>Rs. 15,000+</span>
        </div>
      </div>

      {/* Toggles (In Stock, On Sale) */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold text-slate-700">In Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="w-4 h-4 text-brand-900 rounded border-slate-300 focus:ring-brand-900 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Discounted / On Sale</span>
          </span>
          <input
            type="checkbox"
            checked={filters.onSaleOnly}
            onChange={(e) =>
              onChange({ ...filters, onSaleOnly: e.target.checked })
            }
            className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400 cursor-pointer"
          />
        </label>
      </div>

      {/* Minimum Rating */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Minimum Rating
        </label>
        <div className="grid grid-cols-4 gap-1">
          {[0, 4.0, 4.5, 4.8].map((ratingVal) => (
            <button
              key={ratingVal}
              type="button"
              onClick={() => onChange({ ...filters, rating: ratingVal })}
              className={`py-1.5 text-xs font-bold rounded-xl border transition-colors ${
                filters.rating === ratingVal
                  ? "border-amber-400 bg-amber-50 text-amber-900 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
              }`}
            >
              {ratingVal === 0 ? "All" : `${ratingVal}★+`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
