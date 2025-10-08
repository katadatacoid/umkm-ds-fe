'use client'
import Link from "next/link";
import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission (e.g., authentication)
    console.log('Logging in with', email, password);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Left side image section */}
      <div className="flex-1 md:flex-2 bg-cover bg-center" style={{ backgroundImage: 'url(/images/image-login.webp)' }}></div>
      
      {/* Right side form section */}
      <div className="flex-1 flex justify-center items-center rounded-t-3xl md:rounded-l-4xl shadow-lg bg-white py-8 md:py-0">
        <div className="w-full px-6 md:px-8">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4 md:mb-6">Selamat Datang Kembali 👋</h2>
          <p className="text-center text-gray-500 mb-4">Login dulu yuk untuk melihat perkembangan bisnismu.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
                placeholder="yourname@example.com"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
                placeholder="********"
              />
            </div>

            <Link href={'/xxx'}>
              <button
                type="submit"
                className="w-full py-2 bg-green-c text-white rounded-md hover:bg-green-600 focus:outline-none"
              >
                Sign In
              </button>
            </Link>
        
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
