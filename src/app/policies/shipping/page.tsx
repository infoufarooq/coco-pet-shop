import React from "react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { VERIFIED_STORE_INFO } from "@/lib/utils";
import { Truck, CheckCircle2, MapPin, Clock } from "lucide-react";

export const metadata = {
  title: "Delivery & Shipping Information – CoCo & Candy",
  description: "Nationwide delivery rates, dispatch timelines, and Cash on Delivery terms across Pakistan.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: "FAQs & Policies", href: "/faq" },
            { label: "Delivery Information" },
          ]}
        />

        <div className="bg-white rounded-4xl border border-slate-200/80 p-8 sm:p-12 shadow-sm my-6 space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="border-b border-slate-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              Nationwide Delivery Information
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 font-display mt-2">
              Shipping Rates & Delivery Times (Pakistan)
            </h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 font-display">
              1. Delivery Timelines
            </h2>
            <p>
              We know how excited you and your furry friend are to receive your package! We dispatch all confirmed orders within 24 hours from our central fulfillment hub in Lahore:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Lahore:</strong> 24 Hours Express Delivery.</li>
              <li><strong>Karachi & Islamabad / Rawalpindi:</strong> 2 to 3 working days.</li>
              <li><strong>Other Cities (Faisalabad, Multan, Peshawar, Sialkot, Quetta, etc.):</strong> 2 to 4 working days.</li>
            </ul>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-display">
              2. Shipping Charges & Free Delivery Threshold
            </h2>
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900">
              <strong>FREE Nationwide Shipping:</strong> On all orders exceeding <strong>Rs. {VERIFIED_STORE_INFO.freeShippingThreshold.toLocaleString()}</strong>.
            </div>
            <p className="text-slate-600">
              For orders below Rs. {VERIFIED_STORE_INFO.freeShippingThreshold.toLocaleString()}, a nominal standard courier fee of <strong>Rs. {VERIFIED_STORE_INFO.standardShippingFee}</strong> is applied at checkout.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-base font-bold text-slate-900 font-display">
              3. Payment & Parcel Tracking
            </h2>
            <p>
              We provide <strong>Cash on Delivery (COD)</strong> throughout Pakistan. Once your order is dispatched, a tracking tracking link and SMS/WhatsApp notification will be sent so you can monitor your parcel in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
