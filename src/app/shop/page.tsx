"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductFilters, FilterState } from "@/components/product/ProductFilters";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  ChevronDown,
  X,
  Search,
  PackageOpen,
} from "lucide-react";

function ShopContent() {
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get("category") || "all";
  const initialSub = searchParams.get("sub") || "";
  const initialQuery = searchParams.get("q") || "";
  const initialSale = searchParams.get("onSale") === "true";

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    subCategory: initialSub,
    petType: "all",
    minPrice: 0,
    maxPrice: 15000,
    inStockOnly: false,
    onSaleOnly: initialSale,
    rating: 0,
    sortBy: "featured",
  });

  const [searchTerm, setSearchTerm] = useState(initialQuery);

  // Sync state if URL params change
  useEffect(() => {
    if (initialCategory) {
      setFilters((prev) => ({ ...prev, category: initialCategory }));
    }
    if (initialSub) {
      setFilters((prev) => ({ ...prev, subCategory: initialSub }));
    }
    if (initialQuery) {
      setSearchTerm(initialQuery);
    }
    if (initialSale) {
      setFilters((prev) => ({ ...prev, onSaleOnly: true }));
    }
  }, [initialCategory, initialSub, initialQuery, initialSale]);

  const handleResetFilters = () => {
    setFilters({
      category: "all",
      subCategory: "",
      petType: "all",
      minPrice: 0,
      maxPrice: 15000,
      inStockOnly: false,
      onSaleOnly: false,
      rating: 0,
      sortBy: "featured",
    });
    setSearchTerm("");
  };

  // Filter and Sort logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesDesc) return false;
      }

      // Category
      if (filters.category !== "all" && p.categorySlug !== filters.category) {
        return false;
      }

      // Subcategory
      if (filters.subCategory && p.subCategory !== filters.subCategory) {
        return false;
      }

      // Pet Type
      if (filters.petType !== "all" && p.petType !== "all" && p.petType !== filters.petType) {
        return false;
      }

      // Price Range
      if (p.price > filters.maxPrice) {
        return false;
      }

      // In Stock
      if (filters.inStockOnly && !p.inStock) {
        return false;
      }

      // On Sale
      if (filters.onSaleOnly && !p.isOnSale && (!p.discountPercent || p.discountPercent <= 0)) {
        return false;
      }

      // Rating
      if (filters.rating > 0 && (p.rating ?? 0) < filters.rating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price-low") return a.price - b.price;
      if (filters.sortBy === "price-high") return b.price - a.price;
      if (filters.sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
      if (filters.sortBy === "newest") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [filters, searchTerm]);

  // Current active category object
  const currentCategoryObj = CATEGORIES.find((c) => c.slug === filters.category);

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            ...(currentCategoryObj
              ? [{ label: currentCategoryObj.name, href: `/shop?category=${currentCategoryObj.slug}` }]
              : []),
          ]}
        />

        {/* Page Banner Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm my-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                {currentCategoryObj ? currentCategoryObj.name : "All Products"}
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-display mt-2">
                {currentCategoryObj ? currentCategoryObj.name : "Curated Pet Accessories & Food"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {currentCategoryObj
                  ? currentCategoryObj.description
                  : "Explore premium pet beds, wholesome nutrition, warm apparel, ergonomic feeding bowls, and dental chew toys across Pakistan."}
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search within shop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Filters + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Left Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <ProductFilters
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              totalResults={filteredProducts.length}
            />
          </div>

          {/* Right Product Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Control Bar: Total Count, Sorting & View Toggle */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Mobile Filter Button */}
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 text-brand-900" />
                <span>Filters ({filteredProducts.length})</span>
              </button>

              <div className="text-xs text-slate-600 font-medium hidden sm:block">
                Showing <strong className="text-slate-900">{filteredProducts.length}</strong> products
              </div>

              {/* Sorting and Grid Toggle */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 font-medium">Sort by:</span>
                  <div className="relative">
                    <select
                      value={filters.sortBy}
                      onChange={(e) =>
                        setFilters({ ...filters, sortBy: e.target.value })
                      }
                      className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-brand-900 cursor-pointer"
                    >
                      <option value="featured">Featured / Best Match</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Newest Additions</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* View Mode Buttons */}
                <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === "grid"
                        ? "bg-white text-brand-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                    title="Grid View"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === "list"
                        ? "bg-white text-brand-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Pill Bar */}
            {(filters.category !== "all" ||
              filters.petType !== "all" ||
              filters.onSaleOnly ||
              filters.inStockOnly ||
              searchTerm) && (
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">Active filters:</span>
                {filters.category !== "all" && (
                  <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-900 border border-brand-200 px-2.5 py-1 rounded-full font-semibold">
                    Category: {filters.category}
                    <button
                      onClick={() => setFilters({ ...filters, category: "all" })}
                      className="hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.petType !== "all" && (
                  <span className="inline-flex items-center gap-1 bg-brand-50 text-brand-900 border border-brand-200 px-2.5 py-1 rounded-full font-semibold">
                    Pet: {filters.petType}
                    <button
                      onClick={() => setFilters({ ...filters, petType: "all" })}
                      className="hover:text-rose-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {filters.onSaleOnly && (
                  <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full font-semibold">
                    On Sale Only
                    <button
                      onClick={() => setFilters({ ...filters, onSaleOnly: false })}
                      className="hover:text-rose-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-semibold">
                    Search: &ldquo;{searchTerm}&rdquo;
                    <button
                      onClick={() => setSearchTerm("")}
                      className="hover:text-amber-950"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-slate-500 hover:text-slate-800 underline ml-2 font-medium"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Render */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center text-3xl mx-auto mb-4 text-slate-400">
                  <PackageOpen className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  No products matched your selection
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                  Try adjusting your price range, pet type, or clear search queries to see available products.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs py-3 px-6 rounded-full shadow transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} layout="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} layout="list" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Filter Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col p-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="text-sm font-bold text-slate-900 font-display">
                Filter Products
              </h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <ProductFilters
              filters={filters}
              onChange={(f) => {
                setFilters(f);
              }}
              onReset={handleResetFilters}
              totalResults={filteredProducts.length}
            />
            <div className="pt-4 mt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full bg-brand-900 text-white font-bold text-xs py-3 rounded-xl shadow"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold text-slate-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
