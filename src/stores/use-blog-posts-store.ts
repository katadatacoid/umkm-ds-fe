import { create } from "zustand";
import { blogPostsAPI, resolveUserProductId, BlogPost, BlogStatus } from "@/lib/api";

export interface StatItem {
  title: string;
  value: number | string;
  description?: string;
}

type BlogPayload = {
  slug: string;
  title: string;
  body: string;
  category?: string | null;
  excerpt?: string | null;
  cover_image_url?: string | null;
  read_minutes?: number | null;
  status?: BlogStatus;
  is_featured?: boolean;
  published_at?: string | null;
};

interface FetchOptions {
  search?: string;
  status?: BlogStatus | "all";
  page?: number;
  limit?: number;
}

interface BlogPostsState {
  items: BlogPost[];
  statsData: StatItem[];
  loading: boolean;
  error: string | null;
  pagination: { page: number; limit: number; total: number; totalPages: number };

  fetchAll: (options?: FetchOptions) => Promise<void>;
  create: (body: BlogPayload) => Promise<void>;
  update: (id: string | number, body: Partial<BlogPayload>) => Promise<void>;
  remove: (id: string | number) => Promise<void>;
}

function buildStats(items: BlogPost[], total: number): StatItem[] {
  const published = items.filter((b) => b.status === "published").length;
  const draft = items.filter((b) => b.status === "draft").length;
  return [
    { title: "Total Artikel", value: total, description: "Total artikel sesuai filter." },
    { title: "Published", value: published, description: "Artikel terpublikasi (halaman ini)." },
    { title: "Draft", value: draft, description: "Artikel draft (halaman ini)." },
  ];
}

export const useBlogPostsStore = create<BlogPostsState>((set, get) => ({
  items: [],
  statsData: buildStats([], 0),
  loading: false,
  error: null,
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },

  fetchAll: async (options) => {
    set({ loading: true, error: null });
    try {
      const upid = await resolveUserProductId();
      const res = await blogPostsAPI.getAll({
        user_product_id: upid,
        status: options?.status ?? "all",
        search: options?.search,
        page: options?.page ?? 1,
        limit: options?.limit ?? 20,
      });
      const total = res.pagination?.total ?? res.count ?? res.data.length;
      set({
        items: res.data,
        statsData: buildStats(res.data, total),
        pagination: res.pagination ?? { page: 1, limit: 20, total, totalPages: 1 },
        loading: false,
      });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal memuat blog post", loading: false });
    }
  },

  create: async (body) => {
    set({ loading: true, error: null });
    try {
      await blogPostsAPI.create(body);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal menambah blog post", loading: false });
      throw e;
    }
  },

  update: async (id, body) => {
    set({ loading: true, error: null });
    try {
      await blogPostsAPI.update(id, body);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal memperbarui blog post", loading: false });
      throw e;
    }
  },

  remove: async (id) => {
    set({ loading: true, error: null });
    try {
      await blogPostsAPI.remove(id);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal menghapus blog post", loading: false });
      throw e;
    }
  },
}));
