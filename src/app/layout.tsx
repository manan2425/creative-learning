import './globals.css';
import type { Metadata, Viewport } from 'next';
import { DataProvider } from '@/context/DataContext';
import { CartProvider } from '@/context/CartContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'Creative Learning | Electronics, Robotics & Projects',
  description:
    'Creative Learning — authentic electronics components, starter kits, practical experiments and real-world projects for students, makers and innovators.',
  icons: {
    icon: '/images/branding/creative-learning-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <DataProvider>
          <CartProvider>{children}</CartProvider>
        </DataProvider>
      </body>
    </html>
  );
}
