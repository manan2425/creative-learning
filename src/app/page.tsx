'use client';

import React from 'react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from '@/components/home/HeroSection';
import { ProductsSection } from '@/components/home/ProductsSection';
import { KitsSection } from '@/components/home/KitsSection';
import { PracticalSection } from '@/components/home/PracticalSection';
import { ProjectsSection } from '@/components/home/ProjectsSection';
import { InspirationSection } from '@/components/home/InspirationSection';
import { WhyUsSection } from '@/components/home/WhyUsSection';
import { Footer } from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background text-navy">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Navigation */}
      <Navbar />

      {/* 3. Hero Section with Robot Showcase */}
      <HeroSection />

      {/* 4. Hardware Storefront (#products) */}
      <ProductsSection />

      {/* 5. Robotics Starter Kits (#kits) */}
      <KitsSection />

      {/* 6. Guided Labs & Practicals (#practical) */}
      <PracticalSection />

      {/* 7. Engineering Blueprints & DIY Projects (#projects) */}
      <ProjectsSection />

      {/* 8. Inspiration & Pioneer Quotes (#inspiration) */}
      <InspirationSection />

      {/* 9. Diagnostics & Why Us (#why-us) */}
      <WhyUsSection />

      {/* 10. Footer */}
      <Footer />
    </main>
  );
}

