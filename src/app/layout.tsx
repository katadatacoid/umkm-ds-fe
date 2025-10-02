import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";


import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

// Using next/font to load the Inter font
const inter = Inter({
  weight: '500',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Rumah Digital",
  description: "Your digital solution for UMKM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.className}>
      <head>
        {/* Metadata and link to external resources should go here */}
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
