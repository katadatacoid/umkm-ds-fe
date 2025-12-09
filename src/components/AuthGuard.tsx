'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Skip auth check for login page
      if (pathname === '/' || pathname === '/login') {
        setIsChecking(false);
        return;
      }

      // Check if user has access token
      const accessToken = localStorage.getItem('access_token');
      
      if (!accessToken) {
        // No token, redirect to login
        router.push('/');
      } else {
        // Has token, allow access
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}