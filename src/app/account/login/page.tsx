"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (user) {
    router.push("/account");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn(email, password);
    setLoading(false);

    if (res.success) {
      router.push("/account");
    } else {
      setError(res.error || "Failed to sign in.");
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await signIn("ayesha.malik@gmail.com");
    setLoading(false);
    router.push("/account");
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-md mx-auto px-4">
        <Breadcrumbs items={[{ label: "Sign In" }]} />

        <div className="bg-white rounded-4xl border border-slate-200/80 p-8 sm:p-10 shadow-xl my-6 space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 bg-amber-100 text-slate-900 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold shadow-inner">
              🐾
            </div>
            <h1 className="text-2xl font-black text-slate-950 font-display">
              Welcome Back
            </h1>
            <p className="text-xs text-slate-500">
              Sign in to track orders, manage pet profiles & access member deals.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">(Optional for demo)</span>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-900 hover:bg-brand-800 disabled:bg-slate-400 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? "Signing In..." : "Sign In to Account"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 font-bold text-xs py-2.5 px-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>1-Click Instant Demo Login</span>
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/account/register"
              className="font-bold text-brand-900 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}