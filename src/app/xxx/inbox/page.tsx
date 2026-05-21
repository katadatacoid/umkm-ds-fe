"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckDouble, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import DashboardAdminLayout from "@/app/ui/layout/ds-admin-layout";
import StatsSection from "@/app/ui/section/seaction-stat";
import { contactAPI, ContactStatsData, getUserInfo } from "@/lib/api";
import TableInbox from "./table-inbox";

const TOTAL_LABEL = {
  title: "Total Pesan",
  description: "Total seluruh pesan masuk dari form kontak.",
};

const STATUS_OPTIONS = [
  { value: "", label: "Semua status" },
  { value: "new", label: "Hanya yang belum dibaca" },
  { value: "read", label: "Sudah dibaca" },
  { value: "replied", label: "Sudah dibalas" },
  { value: "archived", label: "Diarsipkan" },
];

const InboxPage: React.FC = () => {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [stats, setStats] = useState<ContactStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [tableRefreshKey, setTableRefreshKey] = useState(0);
  const [markingAll, setMarkingAll] = useState(false);

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

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      const res = await contactAPI.getStats();
      setStats(res.data || {});
    } catch (e: any) {
      console.error("Failed to fetch contact stats:", e);
      setError(e.message || "Gagal memuat data inbox");
      if (e.message?.includes("Insufficient permissions")) {
        router.replace("/dashboard?error=unauthorized");
      }
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthorized || isCheckingAuth) return;
    setLoading(true);
    fetchStats().finally(() => setLoading(false));
  }, [isAuthorized, isCheckingAuth, fetchStats]);

  const handleAfterRowRead = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  const handleMarkAllRead = useCallback(async () => {
    if (markingAll) return;
    const newCount = (stats?.new as number | undefined) ?? 0;
    if (newCount === 0) return;
    if (!confirm(`Tandai ${newCount} pesan sebagai sudah dibaca?`)) return;

    try {
      setMarkingAll(true);
      await contactAPI.markAllRead();
      await fetchStats();
      setTableRefreshKey((k) => k + 1);
    } catch (e: any) {
      console.error("Failed to mark all read:", e);
      alert(e.message || "Gagal menandai semua pesan sebagai dibaca");
    } finally {
      setMarkingAll(false);
    }
  }, [markingAll, stats?.new, fetchStats]);

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

  const unreadCount = (stats?.new as number | undefined) ?? 0;

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
      {/* Header bar khusus inbox */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 sm:p-5 bg-white shadow-sm rounded-lg">
        <div className="flex items-center gap-3">
          <div className="text-base sm:text-xl font-semibold text-gray-800">
            Inbox
          </div>
          {unreadCount > 0 && (
            <span className="rounded-full bg-blue-50 text-blue-700 px-2.5 py-0.5 text-xs font-semibold">
              {unreadCount} belum dibaca
            </span>
          )}
          <span className="text-xs sm:text-sm text-gray-500">
            Last updated: Baru saja
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <input
              type="text"
              placeholder="Cari nama / email / pesan..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-9 pr-3 py-2 w-full border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-2.5 text-gray-400 h-4 w-4"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleMarkAllRead}
            disabled={markingAll || unreadCount === 0}
            className="flex items-center justify-center gap-2 bg-green-c hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-md transition-colors"
          >
            <FontAwesomeIcon icon={faCheckDouble} className="h-4 w-4" />
            {markingAll ? "Memproses..." : "Tandai semua dibaca"}
          </button>
        </div>
      </div>

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

      <TableInbox
        title="Daftar Pesan Masuk"
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        refreshKey={tableRefreshKey}
        onRowRead={handleAfterRowRead}
      />
    </DashboardAdminLayout>
  );
};

export default InboxPage;
