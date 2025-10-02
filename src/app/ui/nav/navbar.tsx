'use client'

import { useState } from 'react';
import Image from 'next/image'; // Use Next.js Image for optimization
import { usePathname } from 'next/navigation'; // Use next/navigation for route path

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname(); // Hook to access the current path

  const isActive = (path: string) => {
    return pathname === path ? "bg-green-200" : ""; // Apply bg-green-200 if the path matches
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="shrink-0">
            <Image 
              src="/images/logo-rumah-umkm.png" 
              alt="Rumah UMKM Logo" 
              width={129} 
              height={48} 
              className="object-cover" 
            />
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="block lg:hidden">
            <button 
              className="text-gray-700 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex space-x-4">
            <a 
              href="/" 
              className={`text-gray-700 hover:bg-green-200 px-4 py-2 text-sm sm:text-base rounded ${isActive('/')}`}
            >
              Beranda
            </a>
            <a 
              href="/about" 
              className={`text-gray-700 hover:bg-green-200 px-4 py-2 text-sm sm:text-base rounded ${isActive('/about')}`}
            >
              Tentang Kami
            </a>
            <a 
              href="/umkm" 
              className={`text-gray-700 hover:bg-green-200 px-4 py-2 text-sm sm:text-base rounded ${isActive('/umkm')}`}
            >
              UMKM
            </a>
            <a 
              href="/product" 
              className={`text-gray-700 hover:bg-green-200 px-4 py-2 text-sm sm:text-base rounded ${isActive('/product')}`}
            >
              Produk
            </a>
            <a 
              href="/contact" 
              className={`text-gray-700 hover:bg-green-200 px-4 py-2 text-sm sm:text-base rounded ${isActive('/contact')}`}
            >
              Kontak
            </a>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation (hidden by default, show on hamburger click) */}
      <div className={isMenuOpen ? "lg:hidden bg-white shadow-md mt-4 block" : "lg:hidden bg-white shadow-md mt-4 hidden"}>
        <div className="flex flex-col px-6 py-4 space-y-2">
          <a 
            href="/" 
            className={`text-gray-700 hover:bg-green-200 px-4 py-2 text-sm rounded ${isActive('/')}`}
          >
            Beranda
          </a>
          <a 
            href="/about" 
            className={`text-gray-700 hover:bg-green-200 px-4 py-2 text-sm rounded ${isActive('/about')}`}
          >
            Tentang Kami
          </a>
          <a 
            href="/umkm" 
            className={`text-gray-700 hover:bg-green-200 px-4 py-2 text-sm rounded ${isActive('/umkm')}`}
          >
            UMKM
          </a>
          <a 
            href="/product" 
            className={`text-gray-700 hover:bg-green-200 px-4 py-2 text-sm rounded ${isActive('/product')}`}
          >
            Produk
          </a>
          <a 
            href="/contact" 
            className={`text-gray-700 hover:bg-green-200 px-4 py-2 text-sm rounded ${isActive('/contact')}`}
          >
            Kontak
          </a>
        </div>
      </div>
    </header>
  );
}
