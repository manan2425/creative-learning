'use client';

import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustStrip from '@/components/TrustStrip';
import ProductCatalog from '@/components/ProductCatalog';
import KitsSection from '@/components/KitsSection';
import PracticalSection from '@/components/PracticalSection';
import ProjectsSection from '@/components/ProjectsSection';
import QuotesSection from '@/components/QuotesSection';
import Footer from '@/components/Footer';
import ProductModal from '@/components/ProductModal';
import InquiryModal from '@/components/InquiryModal';
import CartDrawer from '@/components/CartDrawer';

export default function Home() {
  return (
    <>
      <Header />
      <main id="home">
        <Hero />
        <TrustStrip />
        <ProductCatalog />
        <KitsSection />
        <PracticalSection />
        <ProjectsSection />
        <QuotesSection />
      </main>
      <Footer />

      {/* Global Modals & Drawers */}
      <ProductModal />
      <InquiryModal />
      <CartDrawer />
    </>
  );
}
