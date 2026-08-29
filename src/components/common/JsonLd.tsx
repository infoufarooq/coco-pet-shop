import React from "react";
import { Product } from "@/types";
import { VERIFIED_STORE_INFO } from "@/lib/utils";

/**
 * Organization & Store JSON-LD Structured Data (Schema.org)
 */
export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["PetStore", "OnlineStore", "Organization"],
    name: VERIFIED_STORE_INFO.name,
    alternateName: VERIFIED_STORE_INFO.shortName,
    url: "https://cocopetshop.pk",
    logo: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80",
    description:
      "CoCo & Candy is Pakistan's premier pet accessories & nutrition shop offering orthopedic beds, gourmet food, warm winter apparel, and nationwide delivery with WhatsApp order support.",
    telephone: VERIFIED_STORE_INFO.phoneFormatted,
    email: VERIFIED_STORE_INFO.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "DHA Phase 6",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      postalCode: "54000",
      addressCountry: "PK",
    },
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Direct Bank Transfer, Cash on Delivery",
    priceRange: "Rs. 450 - Rs. 25,000",
    sameAs: [
      VERIFIED_STORE_INFO.facebookUrl,
      `https://wa.me/${VERIFIED_STORE_INFO.whatsappNumber}`,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Product JSON-LD Structured Data (Schema.org)
 */
export function ProductJsonLd({ product }: { product: Product }) {
  if (!product) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images || [],
    sku: product.sku || product.id,
    brand: {
      "@type": "Brand",
      name: "CoCo & Candy",
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "PKR",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      url: `https://cocopetshop.pk/shop/${product.id}`,
      seller: {
        "@type": "Organization",
        name: VERIFIED_STORE_INFO.name,
      },
    },
    aggregateRating:
      (product.reviewsCount && product.reviewsCount > 0) || product.rating
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating || 5,
            reviewCount: product.reviewsCount || 1,
            bestRating: "5",
            worstRating: "1",
          }
        : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * BreadcrumbList JSON-LD Structured Data (Schema.org)
 */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  if (!items || items.length === 0) return null;

  const itemListElement = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://cocopetshop.pk",
    },
    ...items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 2,
      name: item.label,
      item: item.href
        ? `https://cocopetshop.pk${item.href.startsWith("/") ? "" : "/"}${item.href}`
        : undefined,
    })),
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
