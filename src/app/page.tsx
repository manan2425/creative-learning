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
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import FloatingCartTrigger from '@/components/FloatingCartTrigger';
import RoboticsBackground from '@/components/RoboticsBackground';
import HudToast from '@/components/HudToast';

export default function Home() {
  return (
    <>
      {/* Animated Robotics Circuit & Laser Motion Background */}
      <RoboticsBackground />

      {/* Floating HUD Telemetry Notifications */}
      <HudToast />

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

      {/* Global Modals, Drawers & Widgets */}
      <ProductModal />
      <InquiryModal />
      <CartDrawer />
      <FloatingCartTrigger />
      <FloatingWhatsApp />
    </>
  );
}
