import React from "react";
import Link from "next/link";
import { Search, Home, ShoppingBag, ArrowRight, Sparkles, Package } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export default function NotFoundPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12" data-testid="not-found-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "404 Page Not Found" }]} />

        <div className="bg-white rounded-3xl sm:rounded-4xl border border-slate-200/80 p-8 sm:p-14 shadow-card text-center my-8 max-w-2xl mx-auto space-y-6">
          {/* Pet Themed 404 Visual */}
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-3xl bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center mx-auto text-4xl shadow-sm animate-bounce-soft">
              🦴
            </div>
            <span className="absolute -bottom-2 -right-2 bg-brand-900 text-white font-black text-xs px-2.5 py-1 rounded-full shadow">
              404
            </span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Lost In The Yard
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 font-display">
              This Treat Went Missing!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
              We searched high and low, but the pet page or product you are looking for has been moved or buried in the backyard.
            </p>
          </div>

          {/* Quick Links / Explore Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-left">
            <Link
              href="/shop?petType=dog"
              className="p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-2xl transition-all group"
            >
              <span className="text-lg">🐶</span>
              <p className="font-bold text-xs text-slate-900 mt-1 group-hover:text-amber-900">
                Dog Supplies
              </p>
              <p className="text-[10px] text-slate-400">Beds, food & collars</p>
            </Link>

            <Link
              href="/shop?petType=cat"
              className="p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-2xl transition-all group"
            >
              <span className="text-lg">🐱</span>
              <p className="font-bold text-xs text-slate-900 mt-1 group-hover:text-amber-900">
                Cat Essentials
              </p>
              <p className="text-[10px] text-slate-400">Scratchers, food & toys</p>
            </Link>

            <Link
              href="/shop?onSale=true"
              className="p-3 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-2xl transition-all group col-span-2 sm:col-span-1"
            >
              <span className="text-lg">🔥</span>
              <p className="font-bold text-xs text-rose-700 mt-1 group-hover:text-rose-800">
                Special Offers
              </p>
              <p className="text-[10px] text-rose-400">Up to 30% discount</p>
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <Link
              href="/shop"
              className="w-full sm:w-auto flex-1 bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Browse All Pet Products</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs py-3.5 px-6 rounded-2xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 text-slate-600" />
              <span>Return to Home</span>
            </Link>
          </div>

          <div className="text-[11px] text-slate-400">
            Need to track an existing order?{" "}
            <Link href="/track-order" className="text-brand-900 font-bold hover:underline">
              Track Parcel Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
