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
      <body>
        <DataProvider>
          <CartProvider>{children}</CartProvider>
        </DataProvider>
      </body>
    </html>
  );
}
