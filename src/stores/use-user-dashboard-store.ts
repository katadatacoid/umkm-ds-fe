import { create } from "zustand";
import { productAPI } from "@/lib/api";

// ----------------------
// Types
// ----------------------

// Ringkasan Aktivitas
interface StatItem {
  title: string;
  value: number | string;
  percentage?: number;
  description?: string;
}

// Monthly Stats untuk tracking persentase
interface MonthlyStats {
  month: string; // Format: "YYYY-MM"
  totalProduk: number;
  totalReferall: number;
  pageViews: number;
}

// Page Views Chart
type PageViewFilter = "week" | "month" | "year";

interface PageViewDataItem {
  label: string;
  pageViews: number;
}

interface PageViewsChart {
  filter: PageViewFilter;
  data: PageViewDataItem[];
}

// Total Earnings Chart
type EarningsFilter = "week" | "month" | "year";

interface EarningsDataItem {
  label: string;
  amount: number;
}

interface EarningsChart {
  filter: EarningsFilter;
  data: EarningsDataItem[];
  percentage?: number;
}

// Produk Baru Ditambahkan
interface ProductItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  status: "aktif" | "non-aktif";
  date?: string;
}

// ----------------------
// Zustand State Interface
// ----------------------
interface UserDashboardState {
  // Data
  statsData: StatItem[];
  pageViewsChart: PageViewsChart;
  earningsChart: EarningsChart;
  recentProducts: ProductItem[];
  loading: boolean;
  error: string | null;

  // Monthly stats for percentage calculation
  currentMonthStats: MonthlyStats | null;
  previousMonthStats: MonthlyStats | null;

  search: string;
  setSearch: (value: string) => void;

  // Actions
  setStatsData: (data: StatItem[]) => void;
  setPageViewsFilter: (filter: PageViewFilter) => void;
  setPageViewsData: (data: PageViewDataItem[]) => void;
  setEarningsFilter: (filter: EarningsFilter) => void;
  setEarningsData: (data: EarningsDataItem[]) => void;
  setRecentProducts: (data: ProductItem[]) => void;
  fetchDashboardData: () => Promise<void>;
  
  // Monthly stats helpers
  saveMonthlyStats: (stats: MonthlyStats) => void;
  calculatePercentageChange: (current: number, previous: number) => number;
}

// ----------------------
// Store Implementation
// ----------------------
export const useUserDashboardStore = create<UserDashboardState>((set) => ({
  // Initial State
  statsData: [
    {
      title: "Total Produk",
      value: 0,
      description: "Jumlah produk yang sudah tersedia di katalog",
    },
    {
      title: "Total Referall",
      value: 0,
      // percentage: 0, // TODO: Tambahkan logika perhitungan persentase pertumbuhan referral jika diperlukan
      description: "Total keseluruhan referral yang berhasil bergabung",
    },
    {
      title: "Page Views",
      value: 0,
      // percentage: 0, // TODO: Tambahkan logika perhitungan persentase pertumbuhan page views jika diperlukan
      description: "Jumlah kunjungan yang tercatat",
    },
  ],

  pageViewsChart: {
    filter: "week",
    data: [
      { label: "Mon", pageViews: 5 },
      { label: "Tue", pageViews: 7 },
      { label: "Wed", pageViews: 4 },
      { label: "Thu", pageViews: 8 },
      { label: "Fri", pageViews: 10 },
      { label: "Sat", pageViews: 6 },
      { label: "Sun", pageViews: 9 },
    ],
  },

  earningsChart: {
    filter: "month",
    percentage: 14.5,
    data: [
      { label: "Week 1", amount: 400000 },
      { label: "Week 2", amount: 600000 },
      { label: "Week 3", amount: 550000 },
      { label: "Week 4", amount: 800000 },
    ],
  },

  recentProducts: [],
  loading: false,
  error: null,

  currentMonthStats: null,
  previousMonthStats: null,

  search: "",
  setSearch: (value) => set({ search: value }),

  // ----------------------
  // Helpers
  // ----------------------
  
  // Fungsi untuk menyimpan stats bulanan
  saveMonthlyStats: (stats) => {
    const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
    
    // Jika bulan berubah, pindahkan current ke previous
    if (stats.month !== currentMonth) {
      set({
        previousMonthStats: stats,
        currentMonthStats: {
          month: currentMonth,
          totalProduk: 0,
          totalReferall: 0,
          pageViews: 0,
        },
      });
    } else {
      set({ currentMonthStats: stats });
    }
  },

  // Fungsi untuk menghitung persentase perubahan
  calculatePercentageChange: (current, previous) => {
    if (previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  },

  // ----------------------
  // Actions
  // ----------------------

  setStatsData: (data) => set({ statsData: data }),
  setPageViewsFilter: (filter) =>
    set((state) => ({
      pageViewsChart: { ...state.pageViewsChart, filter },
    })),
  setPageViewsData: (data) =>
    set((state) => ({
      pageViewsChart: { ...state.pageViewsChart, data },
    })),
  setEarningsFilter: (filter) =>
    set((state) => ({
      earningsChart: { ...state.earningsChart, filter },
    })),
  setEarningsData: (data) =>
    set((state) => ({
      earningsChart: { ...state.earningsChart, data },
    })),
  setRecentProducts: (data) => set({ recentProducts: data }),

  // Fetch data
  fetchDashboardData: async () => {
    set({ loading: true, error: null });

    try {
      const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM
      
      // Fetch dashboard stats
      const statsResponse = await productAPI.getDashboardStats();
      
      // Fetch products
      const productsResponse = await productAPI.getAll();

      // Get state to access previous stats
      const state = useUserDashboardStore.getState();
      
      // TODO: Fetch monthly stats dari API atau database
      // Untuk sekarang, kita simulasikan dengan data dari storage atau state
      const currentStats: MonthlyStats = {
        month: currentMonth,
        totalProduk: statsResponse.data.total,
        totalReferall: 0, // TODO: Ganti dengan data real dari API
        pageViews: 0, // TODO: Ganti dengan data real dari analytics
      };

      // Load previous month stats (misalnya dari API atau localStorage)
      // TODO: Implementasi fetch data bulan sebelumnya dari backend
      const previousStats = state.previousMonthStats || {
        month: new Date(new Date().setMonth(new Date().getMonth() - 1))
          .toISOString()
          .slice(0, 7),
        totalProduk: 0,
        totalReferall: 0,
        pageViews: 0,
      };

      // Calculate percentages
      const produkPercentage = state.calculatePercentageChange(
        currentStats.totalProduk,
        previousStats.totalProduk
      );
      const referallPercentage = state.calculatePercentageChange(
        currentStats.totalReferall,
        previousStats.totalReferall
      );
      const pageViewsPercentage = state.calculatePercentageChange(
        currentStats.pageViews,
        previousStats.pageViews
      );

      // Map stats with percentages
      const newStatsData: StatItem[] = [
        {
          title: "Total Produk",
          value: statsResponse.data.total,
          percentage: produkPercentage !== 0 ? produkPercentage : undefined,
          description: "Jumlah produk yang sudah tersedia di katalog",
        },
        {
          title: "Total Referall",
          value: currentStats.totalReferall,
          percentage: referallPercentage !== 0 ? referallPercentage : undefined,
          description: "Total keseluruhan referral yang berhasil bergabung",
        },
        {
          title: "Page Views",
          value: currentStats.pageViews,
          percentage: pageViewsPercentage !== 0 ? pageViewsPercentage : undefined,
          description: "Jumlah kunjungan yang tercatat",
        },
      ];

      // Map products - take last 5 products
      const recentProductsData: ProductItem[] = productsResponse.data
        .slice(0, 5)
        .map((p) => ({
          id: parseInt(p.id),
          name: p.name,
          price: p.current_price,
          image: p.catalog_photos && p.catalog_photos.length > 0
            ? p.catalog_photos[0].path
            : "/images/no-image.png",
          description: p.description || "",
          status: p.status === "published" ? "aktif" as const : "non-aktif" as const,
          date: new Date(p.created_at).toLocaleDateString("id-ID"),
        }));

      // Save current month stats
      state.saveMonthlyStats(currentStats);

      set({
        statsData: newStatsData,
        recentProducts: recentProductsData,
        loading: false,
      });

      // TODO: Implementasi penyimpanan stats ke backend untuk tracking bulanan
      // Contoh: await productAPI.saveMonthlyStats(currentStats);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      set({
        error: error instanceof Error ? error.message : "Gagal memuat data dashboard",
        loading: false,
      });
    }
  },
}));