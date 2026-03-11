'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface DecodedToken {
  user_id: string;
  email: string;
  name: string;
  client_id: string;
  scope?: string;
  exp: number;
}

// Helper function to decode JWT
function parseJwt(token: string): DecodedToken | null {
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

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  // Track current user_id to detect user changes
  const currentUserIdRef = useRef<string | null>(null);
  const lastCheckedPathRef = useRef<string>('');

  // Fix hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const checkAuth = useCallback(() => {
    console.log('=== AUTH CHECK START ===');
    console.log('Current pathname:', pathname);
    console.log('Last checked path:', lastCheckedPathRef.current);

    // Allow public routes immediately
    if (pathname === '/' || pathname === '/login') {
      console.log('Public route, allowing access');
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    // Check for access token (client-side only)
    const accessToken = localStorage.getItem('access_token');
    
    if (!accessToken) {
      console.warn('No token found, redirecting to login');
      currentUserIdRef.current = null;
      lastCheckedPathRef.current = '';
      setIsAuthorized(false);
      setIsChecking(false);
      localStorage.clear();
      router.replace('/');
      return;
    }

    try {
      // Decode and validate token
      const decoded = parseJwt(accessToken);
      
      if (!decoded) {
        console.warn('Invalid token format');
        currentUserIdRef.current = null;
        lastCheckedPathRef.current = '';
        localStorage.clear();
        setIsAuthorized(false);
        setIsChecking(false);
        router.replace('/');
        return;
      }
      
      console.log('Token decoded:', {
        user_id: decoded.user_id,
        email: decoded.email,
        scope: decoded.scope,
        exp: new Date(decoded.exp * 1000).toISOString()
      });

      // Detect user change - RESET everything when user changes
      if (currentUserIdRef.current !== null && currentUserIdRef.current !== decoded.user_id) {
        console.log('USER CHANGED:', {
          from: currentUserIdRef.current,
          to: decoded.user_id
        });
        // Reset state when user changes
        setIsAuthorized(false);
        setIsChecking(true);
        lastCheckedPathRef.current = '';
      }
      
      // Update current user ID
      currentUserIdRef.current = decoded.user_id;

      // Check token expiry
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.warn('Token expired');
        currentUserIdRef.current = null;
        lastCheckedPathRef.current = '';
        localStorage.clear();
        setIsAuthorized(false);
        setIsChecking(false);
        router.replace('/');
        return;
      }

      // Store user info
      const userInfo = {
        user_id: decoded.user_id,
        email: decoded.email,
        name: decoded.name,
        scope: decoded.scope || 'user'
      };
      localStorage.setItem('user_info', JSON.stringify(userInfo));
      console.log('User info stored:', userInfo);

      const userScope = decoded.scope || 'user';

      // Route access control
      const isAdminRoute = pathname.startsWith('/xxx') || pathname.startsWith('/admin');
      const isUserRoute = pathname.startsWith('/user');

      if (isAdminRoute) {
        if (userScope !== 'admin') {
          //console.error('Non-admin trying to access admin route');
          console.log('Redirecting to /user');
          setIsAuthorized(false);
          setIsChecking(false);
          lastCheckedPathRef.current = '';
          router.replace('/user');
          return;
        }
        console.log('Admin accessing admin route - GRANTED');
      } else if (isUserRoute) {
        if (userScope === 'admin') {
          console.log('Admin accessing user route');
          // Allow admin to access user routes
        } else {
          console.log('User accessing user route - GRANTED');
        }
      }

      // All checks passed - allow access
      lastCheckedPathRef.current = pathname;
      console.log('AUTH CHECK PASSED');
      console.log('=== AUTH CHECK END ===\n');
      setIsAuthorized(true);
      setIsChecking(false);
      
    } catch (error) {
      console.error('Token validation error:', error);
      currentUserIdRef.current = null;
      lastCheckedPathRef.current = '';
      localStorage.clear();
      setIsAuthorized(false);
      setIsChecking(false);
      router.replace('/');
    }
  }, [pathname, router]);

  useEffect(() => {
    // Don't run until component is mounted (client-side only)
    if (!isMounted) return;
    
    // Longer delay for public routes to prevent race condition with login
    const isPublicRoute = pathname === '/' || pathname === '/login';
    const delay = isPublicRoute ? 0 : 150; // No delay for public routes
    
    const timer = setTimeout(() => {
      checkAuth();
    }, delay);

    return () => clearTimeout(timer);
  }, [isMounted, pathname, checkAuth]);

  // Show loading during SSR and initial check
  if (!isMounted || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading ...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized message if not authorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600 mb-4">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <button 
            onClick={() => {
              const userInfo = localStorage.getItem('user_info');
              if (userInfo) {
                try {
                  const user = JSON.parse(userInfo);
                  const redirectPath = user.scope === 'admin' ? '/xxx' : '/user';
                  console.log('Redirecting to:', redirectPath);
                  router.replace(redirectPath);
                } catch {
                  router.replace('/');
                }
              } else {
                router.replace('/');
              }
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Only render children if fully authorized
  return <>{children}</>;
}

// Helper hook untuk menggunakan user info di component
export const useAuth = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (error) {
        console.error('Error parsing user info:', error);
        localStorage.removeItem('user_info');
      }
    }
  }, [isMounted]);

  const isAdmin = () => {
    return user?.scope === 'admin';
  };

  const hasScope = (scope: string) => {
    return user?.scope === scope;
  };

  return { user, isAdmin, hasScope, isLoading: !isMounted };
};