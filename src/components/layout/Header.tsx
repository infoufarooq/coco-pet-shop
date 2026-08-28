"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { CATEGORIES } from "@/data/categories";
import { PRODUCTS } from "@/data/products";
import { formatPKR, VERIFIED_STORE_INFO, buildWhatsAppInquiryUrl } from "@/lib/utils";
import { MobileNav } from "./MobileNav";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  Phone,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Truck,
  ShieldCheck,
  Package,
  User,
} from "lucide-react";

export function Header() {
  const router = useRouter();
  const { cartCount, wishlist, openCart, subtotal } = useCart();
  const { user } = useAuth();
  const wishlistCount = wishlist.length;

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof PRODUCTS>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search Autocomplete Handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matches = PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.petType.toLowerCase().includes(q)
    ).slice(0, 5);
    setSearchResults(matches);
  }, [searchQuery]);

  // Click outside to close search / dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoriesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/80 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-brand-900 text-white text-[11px] font-semibold py-1.5 px-4 tracking-wide">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase">
              Free Delivery
            </span>
            <span className="hidden sm:inline">
              Free shipping across Pakistan on orders above {formatPKR(VERIFIED_STORE_INFO.freeShippingThreshold)}!
            </span>
            <span className="sm:hidden">
              Free Shipping above {formatPKR(VERIFIED_STORE_INFO.freeShippingThreshold)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/track-order"
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <Package className="w-3 h-3 text-amber-400" />
              <span>Track Order</span>
            </Link>
            <span className="text-slate-500">•</span>
            <a
              href={VERIFIED_STORE_INFO.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors hidden sm:inline"
            >
              Facebook: @cocopets
            </a>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <a
              href={buildWhatsAppInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-300 transition-colors flex items-center gap-1"
            >
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp: {VERIFIED_STORE_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2 text-slate-700 hover:text-brand-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-brand-900 text-amber-400 flex items-center justify-center font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
                🐾
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-tight leading-none font-display">
                  CoCo & Candy
                </span>
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-700 tracking-wider uppercase mt-0.5">
                  Pet Accessories Shop
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar with Instant Autocomplete */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search dog beds, cat food, toys, apparel..."
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-full pl-10 pr-24 py-2.5 sm:py-3 border border-transparent focus:border-brand-900 focus:outline-none transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors"
              >
                Search
              </button>
            </form>

            {/* Search Dropdown */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 overflow-hidden animate-in fade-in-50 zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Suggested Products
                </div>
                {searchResults.map((p) => (
                  <Link
                    key={p.id}
                    href={`/shop/${p.id}`}
                    onClick={() => setIsSearchOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                      <p className="text-[11px] text-amber-700 font-semibold">{formatPKR(p.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Utilities (Account, Wishlist, Cart Badge, WhatsApp CTA) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Account Link */}
            <Link
              href={user ? "/account" : "/account/login"}
              className="p-2.5 text-slate-700 hover:text-brand-900 hover:bg-slate-100 rounded-full transition-colors flex items-center gap-1"
              title={user ? `Logged in as ${user.name}` : "Sign In / Register"}
            >
              <User className="w-5 h-5" />
              {user && (
                <span className="text-xs font-bold text-brand-900 hidden xl:inline">
                  {user.name.split(" ")[0]}
                </span>
              )}
            </Link>

            {/* Wishlist Link */}
            <Link
              href="/wishlist"
              className="relative p-2.5 text-slate-700 hover:text-brand-900 hover:bg-slate-100 rounded-full transition-colors"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-2 rounded-full transition-all group"
              aria-label="Open Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-800 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center justify-center shadow animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold hidden sm:inline text-brand-900">
                {formatPKR(subtotal)}
              </span>
            </button>

            {/* WhatsApp Quick Order Button */}
            <a
              href={buildWhatsAppInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-3.5 rounded-full shadow-sm transition-colors"
              title="Chat on WhatsApp (03457913191)"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden lg:block border-t border-slate-100 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11 text-xs font-bold text-slate-700">
            <div className="flex items-center gap-6">
              {/* Categories Dropdown Trigger */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
                  className="flex items-center gap-1.5 py-2 text-brand-900 hover:text-amber-600 font-extrabold transition-colors"
                >
                  <span>All Pet Categories</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {isCategoriesDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 mt-1 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-50 slide-in-from-top-2">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${cat.slug}`}
                        onClick={() => setIsCategoriesDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2 hover:bg-amber-50/80 hover:text-brand-900 transition-colors"
                      >
                        <span className="text-xs font-bold text-slate-800">{cat.name}</span>
                        <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                          {cat.productCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link href="/shop" className="hover:text-brand-900 transition-colors">
                Full Catalog
              </Link>
              <Link href="/shop?petType=dog" className="hover:text-brand-900 transition-colors flex items-center gap-1">
                <span>🐶 Dog Accessories</span>
              </Link>
              <Link href="/shop?petType=cat" className="hover:text-brand-900 transition-colors flex items-center gap-1">
                <span>🐱 Cat Essentials</span>
              </Link>
              <Link href="/shop?onSale=true" className="text-rose-600 hover:text-rose-700 transition-colors flex items-center gap-1 font-extrabold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Special Offers</span>
              </Link>
              <Link href="/about" className="hover:text-brand-900 transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="hover:text-brand-900 transition-colors">
                Contact & Support
              </Link>
            </div>

            <div className="flex items-center gap-4 text-slate-500 font-semibold">
              <Link href="/track-order" className="hover:text-brand-900 transition-colors flex items-center gap-1">
                <Package className="w-3.5 h-3.5 text-amber-500" />
                <span>Track Parcel</span>
              </Link>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Helpline: 0345-7913191</span>
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </header>
  );
}