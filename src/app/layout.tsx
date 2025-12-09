import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import './globals.css';
import AuthGuard from '@/components/AuthGuard';

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

const inter = Inter({
  weight: ['500'], 
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'UMKM Dashboard',
  description: 'Dashboard for UMKM Management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.className}>
      <head>
        {/* Metadata and link to external resources should go here */}
      </head>
      <body className="antialiased">
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}