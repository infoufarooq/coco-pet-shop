import React from "react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export const metadata = {
  title: "Privacy Policy – CoCo & Candy",
  description: "How CoCo & Candy securely handles customer data and order information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "FAQs & Policies", href: "/faq" },
            { label: "Privacy Policy" },
          ]}
        />

        <div className="bg-white rounded-4xl border border-slate-200/80 p-8 sm:p-12 shadow-sm my-6 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 font-display">
              Privacy & Data Policy
            </h1>
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 font-display">
              1. Information We Collect
            </h2>
            <p>
              When placing an order with <strong>CoCo & Candy</strong>, we collect your name, shipping address, phone/WhatsApp number, and email strictly for the purpose of processing, dispatching, and confirming your delivery.
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-display">
              2. Data Protection & No-Spam Guarantee
            </h2>
            <p>
              We do not sell, rent, or trade your personal information to third parties. Your details are shared only with our trusted courier delivery partners in Pakistan to execute doorstep fulfillment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
