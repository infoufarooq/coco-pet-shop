"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, ShoppingBag, MessageSquare } from "lucide-react";
import { VERIFIED_STORE_INFO } from "@/lib/utils";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to diagnostic service / console
    console.error("Root error boundary caught exception:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-card text-center space-y-6">
        {/* Playful Pet Alert Icon */}
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-sm animate-bounce-soft">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
            Something Went Paws-itively Sideways
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-display">
            Oops! An Unexpected Hiccup Occurred
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Our pet care team has been alerted. Don&apos;t worry—your cart and favorites are safely preserved in your browser!
          </p>
        </div>

        {/* Error Details (if available) */}
        {error.message && (
          <div className="p-3 bg-slate-50 rounded-2xl text-left border border-slate-100">
            <p className="text-[11px] font-mono text-slate-600 truncate">
              <strong>Error:</strong> {error.message}
            </p>
            {error.digest && (
              <p className="text-[10px] font-mono text-slate-400">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            data-testid="try-again-btn"
            className="w-full sm:w-auto flex-1 bg-brand-900 hover:bg-brand-800 text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs py-3.5 px-6 rounded-2xl border border-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-slate-600" />
            <span>Return to Home</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 text-center">
          <a
            href={`https://wa.me/${VERIFIED_STORE_INFO.whatsappNumber}?text=Salam%20CoCo%20%26%20Candy%20Support!%20I%20encountered%20an%20error%20on%20the%20website.`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Need Help? Contact WhatsApp Support ({VERIFIED_STORE_INFO.whatsappDisplay})</span>
          </a>
        </div>
      </div>
    </div>
  );
}
