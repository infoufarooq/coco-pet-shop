import React from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FlashSaleSection } from "@/components/home/FlashSaleSection";
import { FeaturedTabs } from "@/components/home/FeaturedTabs";
import { FacebookCommunity } from "@/components/home/FacebookCommunity";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsletterSection } from "@/components/home/NewsletterSection";

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <CategoryGrid />
      <FlashSaleSection />
      <FeaturedTabs />
      <FacebookCommunity />
      <WhyChooseUs />
      <Testimonials />
      <NewsletterSection />
    </div>
  );
}