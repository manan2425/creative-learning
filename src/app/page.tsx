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
import { SectionQuoteBanner } from '@/components/common/SectionQuoteBanner';

import { useStore } from '@/context/StoreContext';

export default function Home() {
  const { settings } = useStore();
  const sq = settings.sectionQuotes;
  const defaultGlobalQuote = sq?.globalQuoteText || settings.heroQuoteText || 'The future belongs to students and makers who build what they imagine with hands-on silicon.';
  const defaultGlobalAuthor = sq?.globalQuoteAuthor || settings.heroQuoteAuthor || 'Creative Learning Engineering Lab';

  const productsQuote = sq?.productsQuoteText || 'Every great invention starts with a single semiconductor, a spark of curiosity, and the courage to build.';
  const productsAuthor = sq?.productsQuoteAuthor || 'Creative Learning Silicon Lab';

  const kitsQuote = sq?.kitsQuoteText || 'Robotics is not just about building machines; it is about building the creative minds that will shape tomorrow.';
  const kitsAuthor = sq?.kitsQuoteAuthor || 'Creative Learning Robotics Team';

  const practicalsQuote = sq?.practicalsQuoteText || 'True understanding comes from connecting the wires, measuring the signals, and watching theoretical formulas come alive on the breadboard.';
  const practicalsAuthor = sq?.practicalsQuoteAuthor || 'Creative Learning Practical Division';

  const projectsQuote = sq?.projectsQuoteText || 'When hardware blueprints and firmware are shared openly, human innovation accelerates for every student across the nation.';
  const projectsAuthor = sq?.projectsQuoteAuthor || 'Creative Learning Open-Source Community';

  return (
    <main className="min-h-screen flex flex-col bg-background text-navy w-full max-w-full overflow-x-clip">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Main Navigation */}
      <Navbar />

      {/* 3. Hero Section with Robot Showcase */}
      <HeroSection />

      {/* 4. Hardware Storefront (#products - Electronics Components & ICs) */}
      <ProductsSection />

      {/* Quote after Electronics Components & ICs */}
      <SectionQuoteBanner quote={productsQuote} author={productsAuthor} />

      {/* 5. Robotics Starter Kits (#kits - Hands-On Robot Kits & STEM Bundles) */}
      <KitsSection />

      {/* Quote after Hands-On Robot Kits & STEM Bundles */}
      <SectionQuoteBanner quote={kitsQuote} author={kitsAuthor} />

      {/* 6. Guided Labs & Practicals (#practical - Interactive Hardware Practicals) */}
      <PracticalSection />

      {/* Quote after Interactive Hardware Practicals */}
      <SectionQuoteBanner quote={practicalsQuote} author={practicalsAuthor} />

      {/* 7. Engineering Blueprints & DIY Projects (#projects - Open-Source Robotics Blueprints) */}
      <ProjectsSection />

      {/* Quote after Open-Source Robotics Blueprints */}
      <SectionQuoteBanner quote={projectsQuote} author={projectsAuthor} />

      {/* 8. Inspiration & Pioneer Quotes (#inspiration) */}
      <InspirationSection />

      {/* 9. Diagnostics & Why Us (#why-us) */}
      <WhyUsSection />

      {/* 10. Footer */}
      <Footer />
    </main>
  );
}


