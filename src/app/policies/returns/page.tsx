import React from "react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { RotateCcw, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Return & Exchange Policy – CoCo & Candy",
  description: "7-Day hassle-free return and sizing exchange policy for pet apparel, beds, and accessories.",
};

export default function ReturnsPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "FAQs & Policies", href: "/faq" },
            { label: "Returns & Exchanges" },
          ]}
        />

        <div className="bg-white rounded-4xl border border-slate-200/80 p-8 sm:p-12 shadow-sm my-6 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Peace of Mind Guarantee
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 font-display mt-2">
              7-Day Returns & Exchange Policy
            </h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              1. Sizing Exchange Guarantee
            </h2>
            <p>
              We understand that pet clothes and harness sizing can sometimes vary between breeds. If the item you ordered is too small or too large, simply notify us via WhatsApp within <strong>7 days</strong> of delivery, and we will coordinate an exchange for the correct size.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-display">
              2. Eligibility Criteria
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Item must be in its original, unwashed, and undamaged condition with original tags attached.</li>
              <li>For hygienic reasons, open/consumed pet foods or treats cannot be returned once unsealed.</li>
              <li>Manufacturing defects or wrong items sent are replaced with 100% free delivery.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
