'use client'
import { useRouter } from "next/navigation";
import React, { useState } from 'react';
import { authAPI } from '@/lib/api';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔐 Starting login process...');
      
      // Login akan set HttpOnly cookies otomatis di backend
      // TIDAK perlu simpan token di localStorage lagi
      await authAPI.login(email, password);
      
      console.log('✅ Login successful, cookies set by backend');
      
      // Redirect ke dashboard setelah login berhasil
      router.push('/xxx'); // Ganti dengan route dashboard Anda
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Left side image section */}
      <div 
        className="flex-1 md:flex-2 bg-cover bg-center" 
        style={{ backgroundImage: 'url(/images/image-login.webp)' }}
      ></div>
      
      {/* Right side form section */}
      <div className="flex-1 flex justify-center items-center rounded-t-3xl md:rounded-l-4xl shadow-lg bg-white py-8 md:py-0">
        <div className="w-full px-6 md:px-8">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4 md:mb-6">
            Selamat Datang Kembali 👋
          </h2>
          <p className="text-center text-gray-500 mb-4">
            Login dulu yuk untuk melihat perkembangan bisnismu.
          </p>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="yourname@example.com"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="********"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-green-c text-white rounded-md hover:bg-green-600 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Memproses...' : 'Sign In'}
            </button>
          </form>

          {/* Test Credentials */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-gray-600 text-center font-semibold mb-2">
              Akun Testing:
            </p>
            <p className="text-xs text-gray-600 text-center">
              Email: <span className="font-mono">bob@example.com</span>
            </p>
            <p className="text-xs text-gray-600 text-center">
              Password: <span className="font-mono">bob123</span>
            </p>
          </div>

          {/* Info HttpOnly Cookies */}
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-xs text-gray-600 text-center">
              🔒 Token disimpan di <strong>HttpOnly Cookies</strong> untuk keamanan maksimal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;