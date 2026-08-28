"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPKR, buildWhatsAppOrderUrl } from "@/lib/utils";
import {
  X,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  MessageSquare,
  ArrowRight,
  Check,
} from "lucide-react";

export function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart, toggleWishlist, isInWishlist } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isWishlisted = isInWishlist(product.id);

  const selectedVariant =
    product.variants?.options[selectedVariantIndex]
      ? {
          type: product.variants.type,
          label: product.variants.options[selectedVariantIndex].label,
          value: product.variants.options[selectedVariantIndex].value,
          priceModifier: product.variants.options[selectedVariantIndex].priceModifier,
        }
      : undefined;

  const currentPrice =
    product.price + (selectedVariant?.priceModifier || 0);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
    closeQuickView();
  };

  const whatsappUrl = buildWhatsAppOrderUrl(
    [
      {
        name: product.name,
        quantity,
        price: currentPrice,
        variant: selectedVariant?.label,
      },
    ],
    currentPrice * quantity
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={closeQuickView}
      />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-900 bg-white/80 hover:bg-white backdrop-blur rounded-full shadow-sm transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Gallery */}
          <div className="p-6 sm:p-8 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-inner mb-4">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.discountPercent && product.discountPercent > 0 && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                  -{product.discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            {product.images.length > 1 && (
              <div className="flex gap-2 justify-center">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? "border-brand-900 shadow-md scale-105"
                        : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold text-amber-800 bg-amber-100/80 px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  {product.category}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    product.inStock
                      ? "text-emerald-700 bg-emerald-50"
                      : "text-rose-700 bg-rose-50"
                  }`}
                >
                  {product.inStock ? "● In Stock" : "Out of Stock"}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug font-display">
                {product.name}
              </h2>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                <span className="text-xs text-slate-400">({product.reviewsCount} verified reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mt-3.5">
                <span className="text-2xl font-black text-brand-900">
                  {formatPKR(currentPrice)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    {formatPKR(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Short Description */}
              <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                {product.description}
              </p>

              {/* Variant Selector */}
              {product.variants && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Select {product.variants.type}:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.options.map((opt, i) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSelectedVariantIndex(i)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                          selectedVariantIndex === i
                            ? "border-brand-900 bg-brand-900 text-white shadow-sm"
                            : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Features snippet */}
              <ul className="mt-4 space-y-1.5 text-xs text-slate-600">
                {product.features.slice(0, 2).map((feat, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag ({formatPKR(currentPrice * quantity)})</span>
                </button>

                {/* Wishlist toggle */}
                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isWishlisted
                      ? "bg-rose-50 border-rose-200 text-rose-600"
                      : "border-slate-200 hover:bg-slate-100 text-slate-600"
                  }`}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-600" : ""}`} />
                </button>
              </div>

              {/* WhatsApp direct order */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-sm transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant Order via WhatsApp</span>
              </a>

              {/* Full details link */}
              <div className="text-center">
                <Link
                  href={`/shop/${product.id}`}
                  onClick={closeQuickView}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-900 hover:text-brand-700 hover:underline"
                >
                  <span>View full product details & reviews</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
