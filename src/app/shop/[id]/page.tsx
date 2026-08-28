"use client";

import React, { useState } from "react";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, TESTIMONIALS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { formatPKR, buildWhatsAppOrderUrl, VERIFIED_STORE_INFO } from "@/lib/utils";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ProductCard } from "@/components/product/ProductCard";
import {
  Star,
  ShoppingBag,
  Heart,
  Plus,
  Minus,
  MessageSquare,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  Share2,
  ChevronDown,
  Info,
  Sparkles,
} from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.id as string;

  const product = PRODUCTS.find((p) => p.id === productId || p.slug === productId);

  if (!product) {
    return notFound();
  }

  const { addToCart, toggleWishlist, isInWishlist, showToast } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "reviews">("overview");

  const selectedVariant = product.variants?.options[selectedVariantIndex]
    ? {
        type: product.variants.type,
        label: product.variants.options[selectedVariantIndex].label,
        value: product.variants.options[selectedVariantIndex].value,
        priceModifier: product.variants.options[selectedVariantIndex].priceModifier,
      }
    : undefined;

  const currentPrice = product.price + (selectedVariant?.priceModifier || 0);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link Copied! 🔗", "Product link copied to clipboard.");
    }
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

  // Related products from same category
  const relatedProducts = PRODUCTS.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            { label: product.category, href: `/shop?category=${product.categorySlug}` },
            { label: product.name },
          ]}
        />

        {/* Main Product Stage */}
        <div className="bg-white rounded-4xl border border-slate-200/80 p-6 sm:p-10 shadow-sm my-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner group">
                <img
                  src={product.images[selectedImgIndex] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                />

                {/* Sale Badge */}
                {product.discountPercent && product.discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-rose-600 text-white text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
                    -{product.discountPercent}% OFF
                  </span>
                )}

                {/* Share Button */}
                <button
                  type="button"
                  onClick={handleShare}
                  className="absolute top-4 right-4 p-2.5 bg-white/80 hover:bg-white text-slate-700 rounded-full shadow-md backdrop-blur transition-all"
                  title="Share product"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedImgIndex(i)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImgIndex === i
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

            {/* Right Column: Information, Pricing & Buying Options */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div>
                {/* Brand & SKU Header */}
                <div className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-500 mb-2">
                  <span className="text-amber-800 bg-amber-50 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    {product.brand || "CoCo & Candy Originals"}
                  </span>
                  <span>SKU: {product.sku}</span>
                </div>

                {/* Product Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight font-display leading-tight">
                  {product.name}
                </h1>

                {/* Ratings & Pet Type */}
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <div className="flex items-center text-amber-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 5)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-800">{product.rating ?? 5.0}</span>
                  <span className="text-xs text-slate-400">({product.reviewsCount ?? 0} verified reviews)</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {product.inStock ? "In Stock (Dispatching Daily)" : "Restocking Soon"}
                  </span>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 mt-4 pt-4 border-t border-slate-100">
                  <span className="text-3xl sm:text-4xl font-black text-brand-900 font-display">
                    {formatPKR(currentPrice)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-base text-slate-400 line-through font-semibold">
                      {formatPKR(product.originalPrice)}
                    </span>
                  )}
                  {product.discountPercent && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Save {product.discountPercent}%
                    </span>
                  )}
                </div>

                {/* Short Excerpt */}
                <p className="text-xs sm:text-sm text-slate-600 mt-4 leading-relaxed">
                  {product.description}
                </p>

                {/* Variant Selector */}
                {product.variants && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                      Select {product.variants.type}:
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {product.variants.options.map((opt, i) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setSelectedVariantIndex(i)}
                          className={`text-xs font-bold px-4 py-2.5 rounded-2xl border transition-all ${
                            selectedVariantIndex === i
                              ? "border-brand-900 bg-brand-900 text-white shadow-md"
                              : "border-slate-200 hover:border-slate-300 text-slate-700 bg-white"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Highlights Bullets */}
                <div className="mt-6 space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Key Highlights:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Quantity, Bag & WhatsApp CTA */}
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1 w-full sm:w-auto justify-between sm:justify-start">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2.5 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 text-sm font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2.5 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <button
                    type="button"
                    onClick={() => addToCart(product, quantity, selectedVariant)}
                    className="flex-1 w-full bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-brand-900/20 transition-all flex items-center justify-center gap-2 group active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Add to Bag ({formatPKR(currentPrice * quantity)})</span>
                  </button>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3.5 rounded-2xl border transition-colors ${
                      isWishlisted
                        ? "bg-rose-50 border-rose-200 text-rose-600"
                        : "border-slate-200 hover:bg-slate-100 text-slate-600"
                    }`}
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-rose-600" : ""}`} />
                  </button>
                </div>

                {/* Direct WhatsApp Order Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-md transition-all group"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-100 group-hover:scale-110 transition-transform" />
                  <span>Order Directly via WhatsApp</span>
                </a>

                {/* Delivery Guarantee Notes */}
                <div className="grid grid-cols-2 gap-3 pt-3 text-[11px] text-slate-600">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
                    <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>Free shipping on orders over Rs. 3,500</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50">
                    <RotateCcw className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>7-Day Hassle-Free Exchange</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Detailed Specifications */}
          <div className="mt-14 pt-10 border-t border-slate-100">
            <div className="flex items-center gap-4 border-b border-slate-200 mb-6">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 ${
                  activeTab === "overview"
                    ? "border-brand-900 text-brand-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Detailed Description
              </button>
              <button
                onClick={() => setActiveTab("specs")}
                className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 ${
                  activeTab === "specs"
                    ? "border-brand-900 text-brand-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Ingredients & Specifications
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 text-xs sm:text-sm font-bold transition-all border-b-2 ${
                  activeTab === "reviews"
                    ? "border-brand-900 text-brand-900"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Customer Reviews ({product.reviewsCount})
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === "overview" && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                <p>{product.description}</p>
                <p>
                  At <strong>CoCo & Candy</strong>, we prioritize the happiness and health of your pet. This item has undergone rigorous pet-safety and durability inspections to ensure your pet enjoys long-lasting comfort and enjoyment.
                </p>
                {product.usageInstructions && (
                  <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/60 mt-4">
                    <h5 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-1">
                      Feeding / Usage Guide:
                    </h5>
                    <p className="text-xs text-amber-800">{product.usageInstructions}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "specs" && (
              <div className="space-y-4 max-w-2xl text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-3 divide-y divide-slate-100">
                  <div className="py-2 text-slate-500 font-medium">Pet Category</div>
                  <div className="py-2 font-bold text-slate-900">{product.category}</div>

                  <div className="py-2 text-slate-500 font-medium">Suitable For</div>
                  <div className="py-2 font-bold text-slate-900 capitalize">
                    {product.petType === "all" ? "Dogs and Cats" : `${product.petType}s`}
                  </div>

                  {product.weightOrVolume && (
                    <>
                      <div className="py-2 text-slate-500 font-medium">Package Size / Volume</div>
                      <div className="py-2 font-bold text-slate-900">{product.weightOrVolume}</div>
                    </>
                  )}

                  <div className="py-2 text-slate-500 font-medium">Country of Distribution</div>
                  <div className="py-2 font-bold text-slate-900">Pakistan (Nationwide Dispatch)</div>
                </div>

                {product.ingredientsOrMaterials && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <h5 className="font-bold text-slate-900 mb-2">Ingredients & Materials:</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {product.ingredientsOrMaterials.map((ing, i) => (
                        <span
                          key={i}
                          className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-lg font-medium"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-6 max-w-3xl">
                <div className="p-5 bg-slate-50 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-black text-slate-900 font-display">
                      {product.rating} / 5.0
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Based on {product.reviewsCount} verified purchase reviews
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      showToast("Review Feature", "Reviews are enabled for verified delivered orders.")
                    }
                    className="bg-brand-900 text-white font-bold text-xs py-2 px-4 rounded-xl shadow"
                  >
                    Write a Review
                  </button>
                </div>

                <div className="space-y-4">
                  {TESTIMONIALS.map((t) => (
                    <div key={t.id} className="p-4 border border-slate-200 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{t.author}</span>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                            Verified Buyer
                          </span>
                        </div>
                        <div className="flex text-amber-400 text-xs">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <h5 className="text-xs font-bold text-slate-800">{t.title}</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">{t.comment}</p>
                      <span className="text-[10px] text-slate-400 block">{t.date} • {t.city}, Pakistan</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Recommendation */}
        {relatedProducts.length > 0 && (
          <div className="my-14">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Complete The Experience
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-display mt-1">
                  You May Also Like
                </h3>
              </div>
              <Link
                href={`/shop?category=${product.categorySlug}`}
                className="text-xs font-bold text-brand-900 hover:underline"
              >
                View more {product.category}
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
