import { create } from "zustand";

// -----------------------------
// Types
// -----------------------------

interface EarningsData {
  month: string;
  value: number;
}

interface StatData {
  title: string;
  value: string | number;
  percentage?: number;
  description: string;
}

interface AffiliateStore {
  // Stats and user info
  statsData: StatData[];
  referralCode: string;
  totalReferrals: number;
  balance: number;
  minWithdraw: number;
  processDays: string;

  // Earnings data
  selectedYear: string;
  earnings: Record<string, EarningsData[]>;

  // Modal controls
  showWithdrawForm: boolean;
  isSuccess: boolean;

  // Actions
  toggleWithdrawForm: (show: boolean) => void;
  setSelectedYear: (year: string) => void;
  setIsSuccess: (value: boolean) => void;
}

// -----------------------------
// Store
// -----------------------------

export const useAffiliateStore = create<AffiliateStore>((set) => ({
  statsData: [
    { title: "Total Earnings", value: "175.000", percentage: 15, description: "dari bulan lalu" },
    { title: "Total Referral", value: 10, description: "Orang yang mendaftar dengan kode Anda." },
    { title: "Tingkat Konversi", value: "85%", description: "Presentase referral yang berhasil." },
  ],

  referralCode: "RUMAH2025-USER123",
  totalReferrals: 4,
  balance: 175000,
  minWithdraw: 100000,
  processDays: "1-3",

  selectedYear: "2025",
  earnings: {
    2024: [
      { month: "Jan", value: 80 },
      { month: "Feb", value: 120 },
      { month: "Mar", value: 350 },
      { month: "Apr", value: 280 },
      { month: "May", value: 220 },
      { month: "Jun", value: 150 },
      { month: "Jul", value: 180 },
      { month: "Aug", value: 200 },
      { month: "Sep", value: 240 },
      { month: "Okt", value: 180 },
      { month: "Nov", value: 100 },
      { month: "Des", value: 120 },
    ],
    2025: [
      { month: "Jan", value: 120 },
      { month: "Feb", value: 180 },
      { month: "Mar", value: 550 },
      { month: "Apr", value: 420 },
      { month: "May", value: 320 },
      { month: "Jun", value: 210 },
      { month: "Jul", value: 250 },
      { month: "Aug", value: 280 },
      { month: "Sep", value: 320 },
      { month: "Okt", value: 260 },
      { month: "Nov", value: 140 },
      { month: "Des", value: 160 },
    ],
  },

  // Modal state
  showWithdrawForm: false,
  isSuccess: false,

  // Actions
  toggleWithdrawForm: (show) => set({ showWithdrawForm: show }),
  setSelectedYear: (year) => set({ selectedYear: year }),
  setIsSuccess: (value) => set({ isSuccess: value }),
}));
