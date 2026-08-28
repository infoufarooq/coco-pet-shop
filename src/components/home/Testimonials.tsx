"use client";

import React from "react";
import { TESTIMONIALS } from "@/data/products";
import { Star, CheckCircle2, Quote } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            Real Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-display mt-2">
            Loved by Pet Parents Across Pakistan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Read verified reviews from customers who pampered their dogs and cats with CoCo & Candy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {TESTIMONIALS.map((review) => (
            <div
              key={review.id}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-amber-300/40 absolute top-5 right-5 pointer-events-none" />

              <div>
                <div className="flex text-amber-400 mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <h3 className="text-sm font-bold text-slate-900 font-display">
                  &ldquo;{review.title}&rdquo;
                </h3>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <img
                  src={review.avatarUrl}
                  alt={review.author}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900">{review.author}</h4>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {review.city}, Pakistan • <span className="text-amber-800 font-medium">{review.petName}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
