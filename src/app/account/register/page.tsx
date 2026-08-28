"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import {
  Lock,
  Mail,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, requestWhatsAppOtp, user } = useAuth();

  const [step, setStep] = useState<"form" | "otp">("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    petName: "",
    petType: "dog" as "dog" | "cat" | "both" | "other",
    city: "Lahore",
    address: "",
  });

  const [otpCode, setOtpCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [waLink, setWaLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    router.push("/account");
  }

  // Step 1: Request OTP
  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      setError("Please fill in your name, email, and phone number.");
      return;
    }
    setError("");

    const otpData = requestWhatsAppOtp(formData.phone);
    setGeneratedCode(otpData.code);
    setWaLink(otpData.directStoreLink);
    setStep("otp");
  };

  // Step 2: Verify OTP and Register
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);
    const res = await signUp({
      ...formData,
      otpCode: otpCode.trim(),
    });
    setLoading(false);

    if (res.success) {
      router.push("/account");
    } else {
      setError(res.error || "Failed to verify OTP.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-lg mx-auto px-4">
        <Breadcrumbs items={[{ label: "Create Account" }]} />

        <div className="bg-white rounded-4xl border border-slate-200/80 p-8 sm:p-10 shadow-xl my-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 bg-amber-100 text-slate-900 rounded-2xl flex items-center justify-center mx-auto text-xl font-bold shadow-inner">
              🐾
            </div>
            <h1 className="text-2xl font-black text-slate-950 font-display">
              {step === "form" ? "Join CoCo & Candy Club" : "Verify WhatsApp Number"}
            </h1>
            <p className="text-xs text-slate-500">
              {step === "form"
                ? "Create your account with WhatsApp phone verification."
                : `We generated a 6-digit code for ${formData.phone}`}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-semibold text-rose-700">
              {error}
            </div>
          )}

          {step === "form" ? (
            <form onSubmit={handleProceedToOtp} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Malik"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    WhatsApp Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="0345 7913191"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-3 py-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Password (Optional for Demo)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Pet&apos;s Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Leo / Simba"
                    value={formData.petName}
                    onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Pet Type
                  </label>
                  <select
                    value={formData.petType}
                    onChange={(e: any) => setFormData({ ...formData, petType: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="dog">🐶 Dog</option>
                    <option value="cat">🐱 Cat</option>
                    <option value="both">🐾 Dogs & Cats</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Verify with WhatsApp (Receive 6-Digit OTP)</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndRegister} className="space-y-4 text-xs">
              {/* WhatsApp Code Callout Box */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-950">WhatsApp OTP Code:</span>
                  <span className="font-mono text-base font-black text-emerald-700 bg-white px-3 py-1 rounded-xl border border-emerald-200">
                    {generatedCode}
                  </span>
                </div>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors shadow-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Open WhatsApp Verification Chat</span>
                </a>
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Enter 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="e.g. 582914"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-widest font-mono text-lg font-black bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 focus:outline-none focus:bg-white focus:border-brand-900"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOtpCode(generatedCode)}
                  className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-200 font-bold text-xs py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Auto-Fill Code</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep("form")}
                  className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-colors"
                >
                  Back
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-900 hover:bg-brand-800 disabled:bg-slate-400 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                <span>{loading ? "Verifying..." : "Confirm & Create Account"}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{" "}
            <Link href="/account/login" className="font-bold text-brand-900 hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}