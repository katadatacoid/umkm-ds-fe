"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardAdminLayout from "@/app/ui/layout/ds-admin-layout";
import HeadSummary from "@/app/ui/headers/header-summary";
import StatsSection from "@/app/ui/section/seaction-stat";
import { contactAPI, ContactStatsData, getUserInfo } from "@/lib/api";
import TableInbox from "./table-inbox";

const TOTAL_LABEL = {
  title: "Total Pesan",
  description: "Total seluruh pesan masuk dari form kontak.",
};

const InboxPage: React.FC = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [stats, setStats] = useState<ContactStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const userInfo = getUserInfo();

    if (!userInfo) {
      setIsAuthorized(false);
      setIsCheckingAuth(false);
      router.replace("/");
      return;
    }

    if ((userInfo.scope || "user") !== "admin") {
      setIsAuthorized(false);
      setIsCheckingAuth(false);
      router.replace("/dashboard?error=unauthorized");
      return;
    }

    setIsAuthorized(true);
    setIsCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (!isAuthorized || isCheckingAuth) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await contactAPI.getStats();
        setStats(res.data || {});
      } catch (e: any) {
        console.error("Failed to fetch contact stats:", e);
        setError(e.message || "Gagal memuat data inbox");
        if (e.message?.includes("Insufficient permissions")) {
          router.replace("/dashboard?error=unauthorized");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [isAuthorized, isCheckingAuth, router]);

  const statsData = React.useMemo(() => {
    if (!stats) return [];
    const total = stats.total;
    if (typeof total !== "number") return [];
    return [
      {
        title: TOTAL_LABEL.title,
        value: total.toLocaleString("id-ID"),
        description: TOTAL_LABEL.description,
      },
    ];
  }, [stats]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memverifikasi akses admin...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600 mb-6">
            Halaman ini hanya dapat diakses oleh administrator.
          </p>
          <button
            onClick={() => router.replace("/dashboard")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardAdminLayout path="xxx">
      <HeadSummary
        title="Inbox"
        updatedAt="Baru saja"
        mode="search"
        onSearchChange={(v) => setSearchInput(v)}
      />

      {loading ? (
        <div className="mt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-7 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="mt-5 bg-white rounded-lg p-6 text-center border border-red-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Gagal Memuat Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Coba Lagi
          </button>
        </div>
      ) : statsData.length === 0 ? (
        <div className="mt-5 bg-white rounded-lg p-6 text-center text-gray-500 border border-gray-100">
          Belum ada data statistik inbox.
        </div>
      ) : (
        <StatsSection
          title="Ringkasan Inbox"
          stats={statsData}
          className="mt-5"
        />
      )}

      <TableInbox title="Daftar Pesan Masuk" searchQuery={searchQuery} />
    </DashboardAdminLayout>
  );
};

export default InboxPage;
