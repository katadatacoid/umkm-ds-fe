import { create } from "zustand";

// ----------------------
// Types
// ----------------------

// Ringkasan Aktivitas
interface StatItem {
  title: string;
  value: number | string;
  percentage?: number; // Optional, e.g. 32 means +32%
  description?: string;
}

// Page Views Chart
type PageViewFilter = "week" | "month" | "year";

interface PageViewDataItem {
  label: string; // e.g. Mon, Tue, Wed...
  pageViews: number;
}

interface PageViewsChart {
  filter: PageViewFilter;
  data: PageViewDataItem[];
}

// Total Earnings Chart
type EarningsFilter = "week" | "month" | "year";

interface EarningsDataItem {
  label: string; // e.g. Week 1, Jan, Feb...
  amount: number;
}

interface EarningsChart {
  filter: EarningsFilter;
  data: EarningsDataItem[];
  percentage?: number; // Optional, e.g. +12%
}

// Produk Baru Ditambahkan
interface ProductItem {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
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
}

// ----------------------
// Store Implementation
// ----------------------
export const useUserDashboardStore = create<UserDashboardState>((set) => ({
  // Initial Dummy Data
  statsData: [
    {
      title: "Total Produk",
      value: 156,
      description: "Jumlah produk yang sudah tersedia di katalog",
    },
    {
      title: "Total Referall",
      value: 150,
      percentage: 32,
      description: "Total keseluruhan referral yang berhasil bergabung",
    },
    {
      title: "Page Views",
      value: 6.43,
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

  recentProducts: [
    {
      "id": 1,
      "name": "Kopi Arabika Aceh Gayo",
      "price": 65000,
      "image": "/images/user/product-1.jpg",
      "description": "Biji kopi arabika premium dari Gayo.",
    },
    {
      "id": 2,
      "name": "Keripik Pisang Lampung",
      "price": 25000,
      "image": "/images/products/snack1.png",
      "description": "Cemilan khas Lampung dengan rasa manis gurih.",
    },
    {
      "id": 3,
      "name": "Batik Pekalongan",
      "price": 120000,
      "image": "/images/products/batik1.png",
      "description": "Batik tulis khas Pekalongan dengan motif klasik.",
    },
    {
      "id": 4,
      "name": "Tahu Tempe Gembus",
      "price": 15000,
      "image": "/images/products/snack2.png",
      "description": "Cemilan tahu tempe khas Indonesia, renyah dan gurih.",
    },
    {
      "id": 5,
      "name": "Sate Padang",
      "price": 50000,
      "image": "/images/products/food1.png",
      "description": "Sate dengan kuah pedas khas Padang.",
    },
    {
      "id": 6,
      "name": "Kerupuk Jember",
      "price": 20000,
      "image": "/images/products/snack3.png",
      "description": "Kerupuk dari Jember dengan rasa gurih.",
    },
    {
      "id": 7,
      "name": "Tempe Mendoan",
      "price": 18000,
      "image": "/images/products/snack4.png",
      "description": "Tempe mendoan dengan tepung crispy.",
    },
    {
      "id": 8,
      "name": "Kopi Luwak",
      "price": 350000,
      "image": "/images/products/coffee1.png",
      "description": "Kopi premium yang diolah melalui proses unik Luwak.",
    },
    {
      "id": 9,
      "name": "Keris Madura",
      "price": 250000,
      "image": "/images/products/keris1.png",
      "description": "Keris tradisional Madura dengan ukiran halus.",
    },
    {
      "id": 10,
      "name": "Kain Songket Palembang",
      "price": 500000,
      "image": "/images/products/textile1.png",
      "description": "Songket tradisional Palembang, kain indah dengan benang emas.",
    },
    {
      "id": 11,
      "name": "Es Teh Manis",
      "price": 10000,
      "image": "/images/products/drink1.png",
      "description": "Minuman teh manis dingin khas Indonesia.",
    },
    {
      "id": 12,
      "name": "Lempung Bali",
      "price": 35000,
      "image": "/images/products/snack5.png",
      "description": "Cemilan ringan khas Bali dengan rasa manis gurih.",
    },
    {
      "id": 13,
      "name": "Rendang Padang",
      "price": 150000,
      "image": "/images/products/food2.png",
      "description": "Rendang daging sapi dengan bumbu khas Padang.",
    },
    {
      "id": 14,
      "name": "Kipas Batik",
      "price": 45000,
      "image": "/images/products/accessory1.png",
      "description": "Kipas tangan batik dengan motif tradisional.",
    },
    {
      "id": 15,
      "name": "Sambal Terasi",
      "price": 25000,
      "image": "/images/products/sauce1.png",
      "description": "Sambal terasi pedas dengan rasa khas.",
    },
    {
      "id": 16,
      "name": "Pisang Salai",
      "price": 40000,
      "image": "/images/products/snack6.png",
      "description": "Pisang yang diasapi dengan rasa manis alami.",
    },
    {
      "id": 17,
      "name": "Kacamata Sunglass",
      "price": 120000,
      "image": "/images/products/accessory2.png",
      "description": "Kacamata hitam stylish untuk melindungi mata dari sinar UV.",
    },
    {
      "id": 18,
      "name": "Perhiasan Emas Kalimantan",
      "price": 900000,
      "image": "/images/products/jewelry1.png",
      "description": "Perhiasan emas khas Kalimantan dengan desain elegan.",
    },
    {
      "id": 19,
      "name": "Kopi Toraja",
      "price": 80000,
      "image": "/images/products/coffee2.png",
      "description": "Kopi dari Toraja dengan rasa khas dan aroma kuat.",
    },
    {
      "id": 20,
      "name": "Ayam Penyet Surabaya",
      "price": 45000,
      "image": "/images/products/food3.png",
      "description": "Ayam penyet dengan sambal terasi khas Surabaya.",
    },
  ],

  search: "",
  setSearch: (value) => set({ search: value }),

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

  // Simulate fetch
  fetchDashboardData: async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));

    set({
      statsData: [
        {
          title: "Total Produk",
          value: 170,
          percentage: 8.1,
          description: "Jumlah produk yang sudah tersedia di katalog",
        },
        {
          title: "Total Referall",
          value: 160,
          percentage: 25,
          description: "Total keseluruhan referral yang berhasil bergabung",
        },
        {
          title: "Page Views",
          value: 7.2,
          percentage: 15,
          description: "Jumlah kunjungan yang tercatat",
        },
      ],
      earningsChart: {
        filter: "month",
        percentage: 10.4,
        data: [
          { label: "Week 1", amount: 450000 },
          { label: "Week 2", amount: 700000 },
          { label: "Week 3", amount: 630000 },
          { label: "Week 4", amount: 820000 },
        ],
      },
    });
  },
}));
