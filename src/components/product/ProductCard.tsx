"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { formatPKR, buildWhatsAppOrderUrl } from "@/lib/utils";
import {
  Star,
  ShoppingBag,
  Heart,
  Eye,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  layout?: "grid" | "list";
}

export function ProductCard({ product, layout = "grid" }: ProductCardProps) {
  const { addToCart, openQuickView } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(product.id);

  const defaultVariant = product.variants?.options[0]
    ? {
        type: product.variants.type,
        label: product.variants.options[0].label,
        value: product.variants.options[0].value,
        priceModifier: product.variants.options[0].priceModifier,
      }
    : undefined;

  const displayPrice = product.price + (defaultVariant?.priceModifier || 0);

  const whatsappUrl = buildWhatsAppOrderUrl(
    [
      {
        name: product.name,
        quantity: 1,
        price: displayPrice,
        variant: defaultVariant?.label,
      },
    ],
    displayPrice
  );

  if (layout === "list") {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-3xl border border-slate-200/80 hover:border-brand-900/40 shadow-sm hover:shadow-card-hover transition-all duration-300 group">
        <div className="relative w-full sm:w-48 aspect-square rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.discountPercent && (
            <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
              -{product.discountPercent}% OFF
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md uppercase">
                {product.category}
              </span>
              <div className="flex items-center text-amber-400 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                <span className="font-bold text-slate-800">{product.rating}</span>
                <span className="text-slate-400 ml-1">({product.reviewsCount})</span>
              </div>
            </div>

            <Link
              href={`/shop/${product.id}`}
              className="text-base font-bold text-slate-900 hover:text-brand-900 line-clamp-1 transition-colors font-display"
            >
              {product.name}
            </Link>

            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-brand-900">
                {formatPKR(displayPrice)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatPKR(product.originalPrice)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openQuickView(product)}
                className="p-2 text-slate-600 hover:text-brand-900 hover:bg-slate-100 rounded-xl transition-colors"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(product.id)}
                className={`p-2 rounded-xl border transition-colors ${
                  isWishlisted
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "border-slate-200 hover:bg-slate-100 text-slate-600"
                }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-600" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => addToCart(product, 1, defaultVariant)}
                className="bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow transition-colors flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 hover:border-brand-900/40 shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        <Link href={`/shop/${product.id}`} className="block w-full h-full">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.discountPercent && product.discountPercent > 0 && (
            <span className="bg-rose-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
              -{product.discountPercent}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Hot
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-md shadow-sm transition-transform active:scale-90 ${
            isWishlisted
              ? "bg-rose-50 text-rose-600"
              : "bg-white/80 hover:bg-white text-slate-600 hover:text-rose-600"
          }`}
          title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-600" : ""}`} />
        </button>

        {/* Quick View Button (hover reveal on desktop) */}
        <div className="absolute inset-x-3 bottom-3 z-10 hidden sm:flex opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 gap-2">
          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="flex-1 bg-white/95 hover:bg-white text-slate-900 text-xs font-bold py-2 px-3 rounded-xl shadow-lg backdrop-blur flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Preview</span>
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl shadow-lg transition-colors flex items-center justify-center"
            title="Order via WhatsApp"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Content & Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Pet Type Pill */}
          <div className="flex items-center justify-between gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md truncate max-w-[140px]">
              {product.category}
            </span>
            <span className="text-slate-400 capitalize">
              {product.petType === "all" ? "Dog & Cat" : product.petType}
            </span>
          </div>

          {/* Title */}
          <Link
            href={`/shop/${product.id}`}
            className="block text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-900 line-clamp-2 leading-snug font-display transition-colors"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating || 5)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] font-bold text-slate-700">{product.rating ?? 5.0}</span>
            <span className="text-[10px] text-slate-400">({product.reviewsCount ?? 0})</span>
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-black text-brand-900">
              {formatPKR(displayPrice)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-slate-400 line-through -mt-1">
                {formatPKR(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product, 1, defaultVariant)}
            className="bg-brand-900 hover:bg-brand-800 text-white p-2.5 sm:px-3 sm:py-2 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 text-xs font-bold group-active:scale-95"
            aria-label="Add to bag"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
