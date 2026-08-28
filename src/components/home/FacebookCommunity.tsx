"use client";

import React from "react";
import { VERIFIED_STORE_INFO } from "@/lib/utils";
import {
  Heart,
  Share2,
  ExternalLink,
  MessageCircle,
  ThumbsUp,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export function FacebookCommunity() {
  const facebookPosts = [
    {
      id: 1,
      author: "CoCo Pets Pakistan",
      time: "2 days ago",
      text: "Winter is here! Keep your furry friends warm and stylish with our padded fleece thermal jackets and orthopedic beds. Now shipping nationwide across Pakistan! 🐾🇵🇰",
      image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80",
      likes: 248,
      comments: 42,
    },
    {
      id: 2,
      author: "CoCo Pets Pakistan",
      time: "4 days ago",
      text: "Customer Spotlight: Meet Simba enjoying his new double stainless steel raised feeder in Karachi! Healthy digestion and happy meal times. 🐱✨",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80",
      likes: 312,
      comments: 58,
    },
    {
      id: 3,
      author: "CoCo Pets Pakistan",
      time: "1 week ago",
      text: "Pet Nutrition Tip: Ensure your cats drink sufficient clean water daily by pairing dry kibble with premium wet food pouches. Browse our Royal Canin & Gourmet cat collections!",
      image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80",
      likes: 189,
      comments: 27,
    },
  ];

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-white to-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#1877F2]/10 border border-[#1877F2]/20 px-3 py-1 rounded-full text-xs font-bold text-[#1877F2]">
              <span>Official Community</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-950 font-display tracking-tight mt-2">
              Join Our Facebook Pet Family
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connect with 15,000+ Pakistani pet parents on{" "}
              <strong className="text-slate-800">@cocopets</strong>.
            </p>
          </div>

          <a
            href={VERIFIED_STORE_INFO.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs sm:text-sm font-bold py-3 px-6 rounded-full shadow-md transition-all self-start sm:self-auto"
          >
            <span>Visit facebook.com/cocopets</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Facebook Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {facebookPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Author Bar */}
                <div className="p-4 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-black text-base shadow-sm">
                      f
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="text-xs font-bold text-slate-900">{post.author}</h4>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1877F2]" />
                      </div>
                      <span className="text-[10px] text-slate-400">{post.time} • 🌐 Public</span>
                    </div>
                  </div>
                </div>

                {/* Text */}
                <div className="p-4 text-xs text-slate-700 leading-relaxed">
                  <p>{post.text}</p>
                </div>

                {/* Image */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={post.image}
                    alt=""
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[10px]">
                    👍
                  </div>
                  <span>{post.likes} Likes</span>
                </div>

                <a
                  href={VERIFIED_STORE_INFO.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#1877F2] hover:underline flex items-center gap-1"
                >
                  <span>{post.comments} Comments</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}