'use client'
import { useRouter } from "next/navigation";
import React, { useState } from 'react';
import { authAPI } from '@/lib/api';

// Helper function to decode JWT
function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT:', error);
    return null;
  }
}

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
      console.log('Email:', email);
  
      // ✅ CRITICAL: Clear all previous session data FIRST
      console.log('🧹 Clearing previous session...');
      localStorage.clear();
      
      // Small delay to ensure cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
  
      // ✅ Login and get tokens
      const tokens = await authAPI.login(email, password);
      console.log('✅ Login successful, tokens received');
  
      // ✅ Decode token IMMEDIATELY after login
      const decoded = parseJwt(tokens.access_token);
      
      if (!decoded) {
        throw new Error('Failed to decode token');
      }
  
      console.log('👤 User info:', {
        user_id: decoded.user_id,
        email: decoded.email,
        scope: decoded.scope
      });
  
      // ✅ Store user info explicitly
      localStorage.setItem('user_info', JSON.stringify({
        user_id: decoded.user_id,
        email: decoded.email,
        name: decoded.name,
        scope: decoded.scope || 'user'
      }));
  
      const scope = decoded.scope || 'user';
  
      // ✅ Redirect based on scope
      if (scope === 'admin') {
        console.log('🔑 Admin detected, redirecting to /xxx');
        router.replace('/xxx');
      } else {
        console.log('👤 User detected, redirecting to /user');
        router.replace('/user');
      }
  
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Login gagal. Silakan coba lagi.');
      localStorage.clear(); // Clear on error
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

        </div>
      </div>
    </div>
  );
};

export default LoginPage;