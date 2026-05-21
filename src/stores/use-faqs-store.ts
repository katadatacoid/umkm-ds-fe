import { create } from "zustand";
import { faqsAPI, resolveUserProductId, Faq } from "@/lib/api";

export interface StatItem {
  title: string;
  value: number | string;
  description?: string;
}

interface FaqsState {
  faqs: Faq[];
  statsData: StatItem[];
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  create: (body: { question: string; answer: string; sort_order?: number; is_visible?: boolean }) => Promise<void>;
  update: (id: string | number, body: Partial<{ question: string; answer: string; sort_order: number; is_visible: boolean }>) => Promise<void>;
  remove: (id: string | number) => Promise<void>;
}

function buildStats(items: Faq[]): StatItem[] {
  const total = items.length;
  const visible = items.filter((f) => f.is_visible).length;
  return [
    { title: "Total FAQ", value: total, description: "Jumlah seluruh pertanyaan." },
    { title: "Tampil", value: visible, description: "FAQ yang ditampilkan ke pengunjung." },
    { title: "Tersembunyi", value: total - visible, description: "FAQ yang disembunyikan." },
  ];
}

export const useFaqsStore = create<FaqsState>((set, get) => ({
  faqs: [],
  statsData: buildStats([]),
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const upid = await resolveUserProductId();
      const res = await faqsAPI.getAll({ user_product_id: upid, include_hidden: true });
      set({ faqs: res.data, statsData: buildStats(res.data), loading: false });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal memuat FAQ", loading: false });
    }
  },

  create: async (body) => {
    set({ loading: true, error: null });
    try {
      await faqsAPI.create(body);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal menambah FAQ", loading: false });
      throw e;
    }
  },

  update: async (id, body) => {
    set({ loading: true, error: null });
    try {
      await faqsAPI.update(id, body);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal memperbarui FAQ", loading: false });
      throw e;
    }
  },

  remove: async (id) => {
    set({ loading: true, error: null });
    try {
      await faqsAPI.remove(id);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal menghapus FAQ", loading: false });
      throw e;
    }
  },
}));
