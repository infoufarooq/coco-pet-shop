import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { VERIFIED_STORE_INFO } from "@/lib/utils";
import {
  Heart,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  Truck,
  Sparkles,
  MapPin,
} from "lucide-react";

export const metadata = {
  title: "About Us – CoCo & Candy Pet Accessories",
  description:
    "Learn about CoCo & Candy, Pakistan's dedicated pet accessories and nutrition shop. Our mission, values, and commitment to happy, healthy pets.",
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: "About Us" }]} />

        {/* Hero Section */}
        <div className="bg-white rounded-4xl border border-slate-200/80 p-8 sm:p-12 lg:p-16 shadow-sm my-6 overflow-hidden relative">
          <div className="max-w-2xl space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Our Story & Heritage
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-950 font-display tracking-tight leading-tight">
              Driven by Love for Every Paw & Purr
            </h1>
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
              Welcome to <strong>CoCo & Candy – Pet Accessories Shop</strong>. Born out of a deep affection for four-legged family members, we set out to build Pakistan&apos;s most reliable, premium, and friendly destination for pet accessories, nutrition, and everyday care essentials.
            </p>
          </div>

          <div className="absolute -bottom-10 -right-10 w-96 h-96 rounded-full bg-brand-50 pointer-events-none -z-0" />
        </div>

        {/* Brand Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 my-10">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Uncompromising Quality
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We rigorously curate each product—from medical-grade memory foam dog beds to veterinary-formulated nutrition and non-toxic cotton toys.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Pet-First Philosophy
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every design decision, fabric choice, and food ingredient is vetted with pet comfort, spine alignment, and digestive wellbeing at the forefront.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-900 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">
              Nationwide Accessibility
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Whether you reside in Lahore, Karachi, Islamabad, Faisalabad, or smaller towns across Pakistan, we deliver directly to your doorstep with Cash on Delivery.
            </p>
          </div>
        </div>

        {/* Narrative Section */}
        <div className="bg-white rounded-4xl border border-slate-200/80 p-8 sm:p-12 shadow-sm my-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-900 bg-brand-50 px-3 py-1 rounded-full">
                Why We Are Different
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                More Than Just a Pet Shop
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Finding reliable, authentic pet supplies in Pakistan used to be challenging. Low-quality knockoffs, harsh chemical plastics, and inconsistent sizing left pet parents frustrated.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                CoCo & Candy was founded to bridge this gap. We partner directly with verified suppliers to bring world-class pet products to Pakistan with transparent pricing, instant WhatsApp support, and genuine love for animals.
              </p>
              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-brand-900 hover:bg-brand-800 text-white font-bold text-xs py-3 px-6 rounded-full shadow transition-all"
                >
                  <span>Explore Our Collections</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-xl aspect-[4/3] bg-slate-100">
              <img
                src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80"
                alt="CoCo & Candy Store Vision"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
