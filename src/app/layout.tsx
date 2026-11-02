import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import { ToastContainer } from "@/components/common/ToastContainer";
import { CartDrawer } from "@/components/modals/CartDrawer";
import { WhatsAppCheckoutModal } from "@/components/modals/WhatsAppCheckoutModal";
import { ProductQuickViewModal } from "@/components/modals/ProductQuickViewModal";
import { KitQuickViewModal } from "@/components/modals/KitQuickViewModal";
import { ProjectQuickViewModal } from "@/components/modals/ProjectQuickViewModal";
import { PracticalDetailModal } from "@/components/modals/PracticalDetailModal";
import { SearchModal } from "@/components/modals/SearchModal";
import { WhatsAppFloatingBtn } from "@/components/layout/WhatsAppFloatingBtn";
import { RoboticsBackground } from "@/components/layout/RoboticsBackground";

export const metadata: Metadata = {
  title: "Creative Learning | Robotics Hardware, Starter Kits & STEM Labs",
  description: "High-precision electronics components, DIY robotics kits, guided labs, and engineering blueprints with direct 1-click WhatsApp checkout and express dispatch.",
  keywords: ["robotics kits", "electronics components", "ESP32", "Arduino Uno", "STEM practicals", "robotics starter kits", "science fair projects"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/logo-emblem.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-navy antialiased selection:bg-cyan/20 selection:text-navy relative">
        <RoboticsBackground />
        <StoreProvider>
          <div className="relative z-10 min-h-screen">
            {children}
          </div>
          <CartDrawer />
          <WhatsAppCheckoutModal />
          <ProductQuickViewModal />
          <KitQuickViewModal />
          <ProjectQuickViewModal />
          <PracticalDetailModal />
          <SearchModal />
          <WhatsAppFloatingBtn />
          <ToastContainer />
        </StoreProvider>
      </body>
    </html>
  );
}
