import { create } from "zustand";
import {
  landingV2API,
  resolveUserProductId,
  type LandingAggregateData,
  type LandingSectionInput,
  type LandingSectionV2,
  type LandingSingletonKind,
} from "@/lib/api";

const EMPTY: LandingAggregateData = {
  hero: null,
  cta: null,
  cta_product: null,
  cta_filosofi: null,
  key_unggulan: [],
};

interface LandingStoreState {
  data: LandingAggregateData;
  templateId: number;
  loading: boolean;
  error: string | null;

  setTemplateId: (id: number) => void;
  refresh: () => Promise<void>;
  upsertSingleton: (
    kind: LandingSingletonKind,
    body: LandingSectionInput
  ) => Promise<LandingSectionV2>;
  createKeyUnggulan: (body: LandingSectionInput) => Promise<LandingSectionV2>;
  updateKeyUnggulan: (id: string, body: LandingSectionInput) => Promise<LandingSectionV2>;
  deleteKeyUnggulan: (id: string) => Promise<void>;
  reorderKeyUnggulan: (orderedIds: string[]) => Promise<void>;
}

export const useLandingStore = create<LandingStoreState>((set, get) => ({
  data: EMPTY,
  templateId: 0,
  loading: false,
  error: null,

  setTemplateId: (id) => set({ templateId: id }),

  refresh: async () => {
    const tid = get().templateId;
    if (!tid) {
      set({ error: "template_id belum tersedia" });
      return;
    }
    set({ loading: true, error: null });
    try {
      const upid = await resolveUserProductId();
      const res = await landingV2API.getAggregate({
        user_product_id: upid,
        template_id: tid,
        include_hidden: true,
      });
      set({ data: res.data, loading: false });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Gagal memuat landing",
        loading: false,
      });
    }
  },

  upsertSingleton: async (kind, body) => {
    const res = await landingV2API.upsertSingleton(kind, {
      template_id: get().templateId,
      ...body,
    });
    set((s) => ({ data: { ...s.data, [kind]: res.data } }));
    return res.data;
  },

  createKeyUnggulan: async (body) => {
    const res = await landingV2API.createKeyUnggulan({
      template_id: get().templateId,
      ...body,
    });
    set((s) => ({
      data: { ...s.data, key_unggulan: [...s.data.key_unggulan, res.data] },
    }));
    return res.data;
  },

  updateKeyUnggulan: async (id, body) => {
    const res = await landingV2API.updateKeyUnggulan(id, body);
    set((s) => ({
      data: {
        ...s.data,
        key_unggulan: s.data.key_unggulan.map((x) => (x.id === id ? res.data : x)),
      },
    }));
    return res.data;
  },

  deleteKeyUnggulan: async (id) => {
    await landingV2API.removeKeyUnggulan(id);
    set((s) => ({
      data: { ...s.data, key_unggulan: s.data.key_unggulan.filter((x) => x.id !== id) },
    }));
  },

  reorderKeyUnggulan: async (orderedIds) => {
    const before = get().data.key_unggulan;
    const map = new Map(before.map((x) => [x.id, x]));
    const next = orderedIds
      .map((id, idx) => {
        const item = map.get(id);
        return item ? { ...item, sort_order: idx } : null;
      })
      .filter((x): x is LandingSectionV2 => x !== null);
    set((s) => ({ data: { ...s.data, key_unggulan: next } }));

    try {
      await landingV2API.reorderKeyUnggulan({
        template_id: get().templateId,
        order: next.map((x, idx) => ({ id: x.id, sort_order: idx })),
      });
    } catch (e) {
      set((s) => ({ data: { ...s.data, key_unggulan: before } }));
      throw e;
    }
  },
}));

