"use client";

import React, { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans antialiased text-slate-900">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto text-2xl font-bold">
            🐾
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900">
              CoCo & Candy Pet Shop
            </h1>
            <p className="text-sm font-bold text-rose-600">
              Application Critical Recovery
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              We encountered a critical runtime error. Please click below to reset the application session.
            </p>
          </div>

          {error?.message && (
            <p className="text-[11px] font-mono bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-600 truncate text-left">
              {error.message}
            </p>
          )}

          <div className="space-y-2 pt-2">
            <button
              onClick={() => reset()}
              data-testid="global-try-again-btn"
              className="w-full bg-[#093672] hover:bg-[#1d409d] text-white font-bold text-xs py-3 px-6 rounded-xl shadow transition-colors"
            >
              Reset Application & Try Again
            </button>

            <a
              href="/"
              className="block w-full text-center text-xs font-bold text-slate-600 hover:text-slate-900 py-2"
            >
              Reload Store Homepage
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
