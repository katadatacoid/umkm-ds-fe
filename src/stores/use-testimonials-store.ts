import { create } from "zustand";
import { testimonialsAPI, resolveUserProductId, Testimonial } from "@/lib/api";

export interface StatItem {
  title: string;
  value: number | string;
  description?: string;
}

type TestimonialPayload = {
  customer_name: string;
  body: string;
  customer_role?: string | null;
  avatar_url?: string | null;
  rating?: number;
  is_featured?: boolean;
  is_visible?: boolean;
  sort_order?: number;
};

interface TestimonialsState {
  items: Testimonial[];
  statsData: StatItem[];
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  create: (body: TestimonialPayload) => Promise<void>;
  update: (id: string | number, body: Partial<TestimonialPayload>) => Promise<void>;
  remove: (id: string | number) => Promise<void>;
}

function buildStats(items: Testimonial[]): StatItem[] {
  const total = items.length;
  const featured = items.filter((t) => t.is_featured).length;
  const visible = items.filter((t) => t.is_visible).length;
  return [
    { title: "Total Testimonial", value: total, description: "Jumlah seluruh testimonial." },
    { title: "Tampil", value: visible, description: "Testimonial yang ditampilkan." },
    { title: "Featured", value: featured, description: "Testimonial unggulan." },
  ];
}

export const useTestimonialsStore = create<TestimonialsState>((set, get) => ({
  items: [],
  statsData: buildStats([]),
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const upid = await resolveUserProductId();
      const res = await testimonialsAPI.getAll({ user_product_id: upid, include_hidden: true });
      set({ items: res.data, statsData: buildStats(res.data), loading: false });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal memuat testimonial", loading: false });
    }
  },

  create: async (body) => {
    set({ loading: true, error: null });
    try {
      await testimonialsAPI.create(body);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal menambah testimonial", loading: false });
      throw e;
    }
  },

  update: async (id, body) => {
    set({ loading: true, error: null });
    try {
      await testimonialsAPI.update(id, body);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal memperbarui testimonial", loading: false });
      throw e;
    }
  },

  remove: async (id) => {
    set({ loading: true, error: null });
    try {
      await testimonialsAPI.remove(id);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal menghapus testimonial", loading: false });
      throw e;
    }
  },
}));
