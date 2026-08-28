"use client";

import React from "react";
import Link from "next/link";
import { formatPKR, buildWhatsAppInquiryUrl } from "@/lib/utils";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  MessageSquare,
  Star,
  CheckCircle2,
} from "lucide-react";

export function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-b from-brand-50 via-white to-slate-50 overflow-hidden py-10 sm:py-16 lg:py-20 border-b border-slate-200/60">
      {/* Decorative Blur Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-amber-300 shadow-sm px-4 py-1.5 rounded-full text-xs font-bold text-slate-800 animate-in fade-in-50 slide-in-from-top-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Verified Pakistan Pet Boutique & Accessories</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-950 font-display leading-[1.12]">
              Elevate Your Pet&apos;s Life with{" "}
              <span className="bg-gradient-to-r from-brand-900 via-brand-700 to-amber-500 bg-clip-text text-transparent">
                CoCo & Candy
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Discover gourmet nutrition, orthopedic memory foam beds, designer apparel, and interactive dental toys. Carefully curated for the unconditional love your furry companions give you.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-sm py-3.5 px-8 rounded-full shadow-lg shadow-brand-900/25 hover:shadow-brand-900/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/shop?onSale=true"
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm py-3.5 px-7 rounded-full shadow-md shadow-amber-400/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore 15% Off Deals</span>
              </Link>

              <a
                href={buildWhatsAppInquiryUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-sm py-3.5 px-6 rounded-full shadow-sm hover:border-slate-300 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Order</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-600 font-semibold">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>Fast Nationwide COD</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Authentic Quality</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-700" />
                <span>7-Day Easy Exchange</span>
              </div>
            </div>
          </div>

          {/* Right Visual Image & Floating Badges */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Main Visual Image Card */}
            <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1000&q=85"
                alt="CoCo & Candy Happy Pets"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <p className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                  Featured Collection
                </p>
                <h3 className="text-xl font-bold font-display">
                  Orthopedic Loungers & Winter Apparel
                </h3>
              </div>
            </div>

            {/* Floating Review Badge */}
            <div className="absolute -top-4 -left-4 sm:left-2 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 animate-float">
              <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-lg">
                🐾
              </div>
              <div>
                <div className="flex text-amber-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-bold text-slate-900 mt-0.5">
                  4.9 / 5.0 Rating
                </p>
                <span className="text-[10px] text-slate-500">Over 1,200+ Pet Parents</span>
              </div>
            </div>

            {/* Floating Promo Badge */}
            <div className="absolute -bottom-4 -right-4 sm:right-2 bg-brand-900 text-white p-3.5 rounded-2xl shadow-xl border border-brand-700 flex items-center gap-3">
              <span className="text-2xl">🎉</span>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold block">
                  Limited Offer
                </span>
                <p className="text-xs font-black text-white">
                  Flat 15% OFF Code: <span className="text-amber-400">COCOFIRST</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
