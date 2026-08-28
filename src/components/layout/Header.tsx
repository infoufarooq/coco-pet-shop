"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { VERIFIED_STORE_INFO, formatPKR, buildWhatsAppInquiryUrl } from "@/lib/utils";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Truck,
  Percent,
} from "lucide-react";
import { MobileNav } from "./MobileNav";

export function Header() {
  const router = useRouter();
  const { cartCount, subtotal, openCart, wishlist } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoriesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter products for search autocomplete
  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter((p) => {
        const matchesQuery =
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCat =
          selectedCategory === "all" || p.categorySlug === selectedCategory;
        return matchesQuery && matchesCat;
      }).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchFocused(false);
    router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}&category=${selectedCategory}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white shadow-sm transition-all">
        {/* Top Announcement Bar */}
        <div className="bg-brand-900 text-white text-xs py-2 px-4 border-b border-brand-800">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
            <div className="flex items-center gap-3 text-center sm:text-left font-medium">
              <span className="inline-flex items-center gap-1 bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px] tracking-wide uppercase">
                <Percent className="w-3 h-3" /> Sale
              </span>
              <span>
                Flat 15% OFF with code <strong className="text-amber-300">COCOFIRST</strong> | Free delivery on orders over Rs. 3,500
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4 text-slate-200">
              <a
                href={buildWhatsAppInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: {VERIFIED_STORE_INFO.whatsappDisplay}</span>
              </a>
              <span className="text-brand-700">•</span>
              <Link href="/about" className="hover:text-amber-300 transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-amber-300 transition-colors">
                Contact & Track
              </Link>
            </div>
          </div>
        </div>

        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Mobile Menu Trigger & Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMobileNavOpen(true)}
                className="lg:hidden p-2 text-slate-700 hover:text-brand-900 rounded-xl hover:bg-slate-100 transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-brand-900 via-brand-800 to-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-900/20 group-hover:scale-105 transition-transform">
                  <span className="text-2xl select-none">🐾</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl font-black tracking-tight text-brand-900 font-display">
                      CoCo <span className="text-amber-500">&</span> Candy
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-slate-500 uppercase -mt-1">
                    Pet Accessories Shop
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Search Bar with Category Select & Autocomplete */}
            <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-2xl relative mx-2">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center w-full bg-slate-50 border border-slate-200 rounded-full focus-within:border-brand-900 focus-within:ring-2 focus-within:ring-brand-900/10 focus-within:bg-white transition-all shadow-inner overflow-hidden"
              >
                <div className="relative border-r border-slate-200">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-transparent pl-4 pr-7 py-2.5 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                <input
                  type="text"
                  placeholder="Search premium food, beds, toys, clothes, bowls..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-full bg-transparent px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1.5 text-slate-400 hover:text-slate-600 mr-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="submit"
                  className="bg-brand-900 hover:bg-brand-800 text-white p-2.5 m-1 rounded-full transition-colors flex items-center justify-center flex-shrink-0"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in-50 slide-in-from-top-2">
                  <div className="p-2 border-b border-slate-100 bg-slate-50 text-[11px] font-semibold text-slate-500 flex justify-between">
                    <span>SUGGESTED PRODUCTS</span>
                    <span>{searchResults.length} RESULTS</span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        href={`/shop/${item.id}`}
                        onClick={() => setIsSearchFocused(false)}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors group"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-slate-900 truncate group-hover:text-brand-900">
                            {item.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-brand-900">
                              {formatPKR(item.price)}
                            </span>
                            {item.originalPrice && (
                              <span className="text-[11px] text-slate-400 line-through">
                                {formatPKR(item.originalPrice)}
                              </span>
                            )}
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
                              {item.category}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-900 group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                  <div className="p-2.5 bg-slate-50 text-center border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-xs font-bold text-brand-900 hover:text-brand-700 inline-flex items-center gap-1"
                    >
                      View all matching items <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative p-2.5 text-slate-700 hover:text-brand-900 rounded-full hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                title="View Wishlist"
              >
                <Heart className="w-5 h-5 text-slate-700 hover:text-rose-600 transition-colors" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {wishlist.length}
                  </span>
                )}
                <span className="hidden xl:inline text-xs font-semibold text-slate-700">Wishlist</span>
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="flex items-center gap-2.5 bg-brand-900 hover:bg-brand-800 text-white px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full shadow-md shadow-brand-900/15 transition-all group"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-400 text-slate-950 text-[11px] font-extrabold rounded-full flex items-center justify-center border-2 border-brand-900">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-[10px] font-medium text-slate-300 uppercase leading-none">Bag</span>
                  <span className="text-xs font-bold text-amber-300 leading-tight">
                    {formatPKR(subtotal)}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="mt-3 md:hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search dog food, beds, cat toys, clothes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-brand-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>
          </div>
        </div>

        {/* Secondary Navigation Menu Bar (Desktop) */}
        <div className="hidden lg:block bg-brand-900 text-white border-t border-brand-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Category Mega Trigger */}
            <div className="flex items-center gap-1">
              <div ref={categoryDropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                  className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-slate-950 px-5 py-3 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors"
                >
                  <Menu className="w-4 h-4" />
                  <span>Shop By Categories</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* Dropdown Menu */}
                {isCategoriesDropdownOpen && (
                  <div className="absolute top-full left-0 w-72 bg-white rounded-b-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in-50 slide-in-from-top-1">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${cat.slug}`}
                        onClick={() => setIsCategoriesDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-brand-50 hover:text-brand-900 text-xs font-semibold transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {cat.productCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="flex items-center space-x-1 pl-4 text-xs font-semibold">
                <Link
                  href="/"
                  className="px-3 py-3 hover:text-amber-300 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  className="px-3 py-3 hover:text-amber-300 transition-colors"
                >
                  All Products
                </Link>
                <Link
                  href="/shop?category=dogs-foods"
                  className="px-3 py-3 hover:text-amber-300 transition-colors"
                >
                  Pet Foods
                </Link>
                <Link
                  href="/shop?category=pet-beds-chairs"
                  className="px-3 py-3 hover:text-amber-300 transition-colors"
                >
                  Beds & Loungers
                </Link>
                <Link
                  href="/shop?category=pet-clothes"
                  className="px-3 py-3 hover:text-amber-300 transition-colors"
                >
                  Clothes & Apparel
                </Link>
                <Link
                  href="/shop?category=pet-toys"
                  className="px-3 py-3 hover:text-amber-300 transition-colors"
                >
                  Toys & Play
                </Link>
                <Link
                  href="/shop?onSale=true"
                  className="px-3 py-3 text-amber-300 hover:text-white transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Flash Sale</span>
                </Link>
              </nav>
            </div>

            {/* Quick Helpline */}
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Nationwide Shipping</span>
              </span>
              <span className="text-brand-700">•</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% Authentic Quality</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />
    </>
  );
}
