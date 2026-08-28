import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { QuickViewModal } from "@/components/cart/QuickViewModal";
import { ToastContainer } from "@/components/common/Toast";
import { VERIFIED_STORE_INFO } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${VERIFIED_STORE_INFO.name} | Premium Pet Accessories Pakistan`,
    template: `%s | ${VERIFIED_STORE_INFO.shortName}`,
  },
  description:
    "CoCo & Candy is Pakistan's premier pet accessories & nutrition shop. Orthopedic pet beds, gourmet food, winter apparel, raised bowls, and interactive toys with nationwide delivery & WhatsApp ordering.",
  keywords: [
    "CoCo and Candy",
    "Coco Pet Shop Pakistan",
    "cocopets",
    "pet accessories shop",
    "dog food lahore",
    "cat food karachi",
    "pet beds pakistan",
    "dog clothes islamabad",
    "pet toys pakistan",
    "online pet store pakistan",
  ],
  authors: [{ name: VERIFIED_STORE_INFO.name }],
  metadataBase: new URL("https://cocopetshop.pk"),
  openGraph: {
    title: `${VERIFIED_STORE_INFO.name} – Premium Pet Shop`,
    description:
      "Gourmet foods, orthopedic beds, warm apparel, and interactive toys for dogs and cats across Pakistan. Fast dispatch & WhatsApp support.",
    url: "https://cocopetshop.pk",
    siteName: VERIFIED_STORE_INFO.name,
    locale: "en_PK",
    type: "website",
    images: [
      {
        url: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&h=630&q=85",
        width: 1200,
        height: 630,
        alt: "CoCo & Candy Pet Accessories",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col font-sans">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <QuickViewModal />
            <ToastContainer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}