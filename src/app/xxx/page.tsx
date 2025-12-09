"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardAdminLayout from "@/app/ui/layout/ds-admin-layout";
import HeadSummary from "@/app/ui/headers/header-summary";
import StatsSection from "@/app/ui/section/seaction-stat";
import DemoTableRecentUMKm from "./table-recent-umk";
import Chart from "../ui/charts/line-chart";
import { umkmAPI, DashboardStats } from '@/lib/api';

const MainDsAdmin: React.FC = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeUmkm: 0,
    monthlyTransactions: 0,
    newUsers: 0,
    activeUmkmPercentage: 0,
    transactionsPercentage: 0,
    newUsersPercentage: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard stats dari API
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📊 Fetching dashboard stats...');
        const stats = await umkmAPI.getDashboardStats();
        
        console.log('✅ Dashboard stats loaded:', stats);
        setDashboardStats(stats);
      } catch (error: any) {
        console.error('❌ Error fetching dashboard stats:', error);
        setError(error.message || 'Failed to load dashboard stats');
        
        // Jika error unauthorized, redirect ke login
        if (error.message?.includes('Session expired') || error.message?.includes('UNAUTHORIZED')) {
          console.log('🔒 Session expired, redirecting to login...');
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [router]);

  const statsData = [
    {
      title: "Total UMKM Aktif",
      value: loading ? "..." : dashboardStats.activeUmkm,
      percentage: dashboardStats.activeUmkmPercentage,
      description: "Jumlah UMKM yang aktif menggunakan platform ini.",
    },
    {
      title: "Transaksi Bulan Ini",
      value: loading ? "..." : `Rp ${dashboardStats.monthlyTransactions.toLocaleString('id-ID')}`,
      percentage: dashboardStats.transactionsPercentage,
      description: "Total transaksi yang tercatat bulan ini.",
    },
    {
      title: "Pengguna Baru",
      value: loading ? "..." : dashboardStats.newUsers,
      percentage: dashboardStats.newUsersPercentage,
      description: "Jumlah pengguna baru dalam 1 bulan terakhir.",
    },
  ];

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  // Debounce search - tunggu 500ms setelah user berhenti mengetik
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Search query set to:", searchInput);
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const chartData = [
    { month: "Jan", umkm: 100, user_aff: 200 },
    { month: "Feb", umkm: 200, user_aff: 400 },
    { month: "Mar", umkm: 800, user_aff: 450 },
    { month: "Apr", umkm: 956, user_aff: 300 },
    { month: "May", umkm: 400, user_aff: 500 },
    { month: "Jun", umkm: 100, user_aff: 200 },
    { month: "Jul", umkm: 200, user_aff: 400 },
    { month: "Aug", umkm: 800, user_aff: 450 },
    { month: "Sep", umkm: 956, user_aff: 300 },
    { month: "Oct", umkm: 400, user_aff: 500 },
  ];

  const seriesNames = ['UMKM', 'User Affiliasi'];
  const fieldNames = ['umkm', 'user_aff'];
  const colors = ['#4D97FF', '#28A745'];
  const chartType: 'line' | 'column' = 'line';

  // Jika ada error, tampilkan error message
  if (error && !loading) {
    return (
      <DashboardAdminLayout path="xxx">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="mb-4 text-red-500">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Gagal Memuat Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </DashboardAdminLayout>
    );
  }

  return (
    <DashboardAdminLayout path="xxx">
      <HeadSummary
        title="Summary"
        updatedAt="Baru saja"
        mode="search"
        onSearchChange={handleSearch}
      />
      
      {loading ? (
        <div className="mt-5 space-y-4">
          {/* Loading skeleton untuk stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <StatsSection
          title="Ringkasan Aktivitas"
          stats={statsData}
          className="mt-5"
        />
      )}

      <Chart
        data={chartData}
        seriesNames={seriesNames}
        fieldNames={fieldNames}
        colors={colors}
        chartType={chartType}
      />
           
      <DemoTableRecentUMKm
        title="Recents UMKM"
        searchQuery={searchQuery}
      />
    </DashboardAdminLayout>
  );
};

export default MainDsAdmin;