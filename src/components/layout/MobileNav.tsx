"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/data/categories";
import { VERIFIED_STORE_INFO, buildWhatsAppInquiryUrl } from "@/lib/utils";
import {
  X,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Heart,
  Phone,
  MessageSquare,
  Home,
  Percent,
  Sparkles,
  Info,
  HelpCircle,
  FileText,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleCat = (slug: string) => {
    setExpandedCat(expandedCat === slug ? null : slug);
  };

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-left duration-300">
        {/* Header */}
        <div className="p-4 bg-brand-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg">
              🐾
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight text-white font-display">
                CoCo & Candy
              </h3>
              <p className="text-[10px] text-slate-300 uppercase tracking-wider">
                Pet Accessories
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-brand-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Tabs */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold">
          <Link
            href="/cart"
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200 text-slate-800 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-brand-900" />
            <span>Bag ({cartCount})</span>
          </Link>
          <Link
            href="/wishlist"
            onClick={onClose}
            className="flex items-center justify-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200 text-slate-800 shadow-sm"
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Wishlist ({wishlistCount})</span>
          </Link>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {/* Main Links */}
          <div className="py-2 space-y-1">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-800 rounded-xl hover:bg-slate-100"
            >
              <Home className="w-4 h-4 text-brand-900" />
              <span>Home</span>
            </Link>
            <Link
              href="/shop"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-800 rounded-xl hover:bg-slate-100"
            >
              <ShoppingBag className="w-4 h-4 text-brand-900" />
              <span>All Products Catalog</span>
            </Link>
            <Link
              href="/shop?onSale=true"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-amber-700 bg-amber-50 rounded-xl hover:bg-amber-100"
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Special Offers & Deals</span>
              </div>
              <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-bold uppercase">
                Sale
              </span>
            </Link>
          </div>

          {/* Categories Accordion */}
          <div className="py-2">
            <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Product Categories
            </p>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <div key={cat.id} className="rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 hover:bg-slate-100">
                    <Link
                      href={`/shop?category=${cat.slug}`}
                      onClick={onClose}
                      className="text-xs font-semibold text-slate-800 flex-1 truncate"
                    >
                      {cat.name}
                    </Link>
                    {cat.subCategories && cat.subCategories.length > 0 && (
                      <button
                        onClick={() => toggleCat(cat.slug)}
                        className="p-1 text-slate-400 hover:text-slate-700"
                        aria-label="Expand subcategories"
                      >
                        {expandedCat === cat.slug ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Subcategories list */}
                  {expandedCat === cat.slug && cat.subCategories && (
                    <div className="pl-6 pr-3 py-1 bg-slate-50 space-y-1 border-l-2 border-brand-900 ml-3">
                      {cat.subCategories.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/shop?category=${cat.slug}&sub=${sub.slug}`}
                          onClick={onClose}
                          className="block py-1 text-[11px] font-medium text-slate-600 hover:text-brand-900"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Info & Policies */}
          <div className="py-2 space-y-1">
            <p className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Store & Support
            </p>
            <Link
              href="/about"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              <Info className="w-4 h-4 text-slate-400" />
              <span>About CoCo & Candy</span>
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              <Phone className="w-4 h-4 text-slate-400" />
              <span>Contact & Store Hours</span>
            </Link>
            <Link
              href="/faq"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>FAQs & Policies</span>
            </Link>
          </div>
        </div>

        {/* WhatsApp Help CTA at bottom of drawer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200">
          <a
            href={buildWhatsAppInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
