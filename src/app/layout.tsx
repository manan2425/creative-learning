import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
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

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

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
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}>
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
