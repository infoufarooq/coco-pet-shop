"use client";

import React from "react";
import Link from "next/link";
import { VERIFIED_STORE_INFO, formatPKR, buildWhatsAppInquiryUrl } from "@/lib/utils";
import { CATEGORIES } from "@/data/categories";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Heart,
  ExternalLink,
  Package,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 sm:pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl">
                🐾
              </div>
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight leading-none font-display block">
                  CoCo & Candy
                </span>
                <span className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase">
                  Pet Accessories Shop
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Pakistan&apos;s trusted pet store providing orthopedic memory foam beds, wholesome nutrition, cozy designer clothes, raised bowls, and interactive chew toys.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>{VERIFIED_STORE_INFO.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{VERIFIED_STORE_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{VERIFIED_STORE_INFO.email}</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              Shop Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              Help & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/track-order" className="hover:text-amber-400 text-amber-300 font-semibold transition-colors flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" />
                  <span>Track Your Order</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  About Our Brand
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-400 transition-colors">
                  FAQs & Sizing Guides
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-amber-400 transition-colors">
                  Nationwide Delivery Info
                </Link>
              </li>
              <li>
                <Link href="/policies/returns" className="hover:text-amber-400 transition-colors">
                  7-Day Return Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              Store Support
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Order directly through WhatsApp with instant confirmation.
            </p>

            <a
              href={buildWhatsAppInquiryUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors shadow"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Support</span>
            </a>

            <div className="pt-3">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-400/90 hover:text-amber-300 underline"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin CMS Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright & payment methods */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CoCo & Candy – Pet Accessories Shop. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold px-2.5 py-1 rounded-md">
              Cash on Delivery (COD)
            </span>
            <span className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold px-2.5 py-1 rounded-md">
              Direct Bank Transfer
            </span>
            <span className="bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-bold px-2.5 py-1 rounded-md">
              WhatsApp Orders
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}