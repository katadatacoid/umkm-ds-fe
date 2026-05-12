import { create } from "zustand";
import {
  landingV2API,
  resolveUserProductId,
  type LandingAggregateData,
  type LandingSectionInput,
  type LandingSectionV2,
  type LandingSingletonKind,
} from "@/lib/api";

const TEMPLATE_ID_LS_KEY = "storefront_template_id";
const DEFAULT_TEMPLATE_ID = 4;

const EMPTY: LandingAggregateData = {
  hero: null,
  cta: null,
  cta_product: null,
  cta_filosofi: null,
  key_unggulan: [],
};

function readSavedTemplateId(): number {
  if (typeof window === "undefined") return DEFAULT_TEMPLATE_ID;
  const v = window.localStorage.getItem(TEMPLATE_ID_LS_KEY);
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_TEMPLATE_ID;
}

function persistTemplateId(id: number) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(TEMPLATE_ID_LS_KEY, String(id));
  }
}

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
  templateId: DEFAULT_TEMPLATE_ID,
  loading: false,
  error: null,

  setTemplateId: (id) => {
    persistTemplateId(id);
    set({ templateId: id });
  },

  refresh: async () => {
    set({ loading: true, error: null });
    try {
      const upid = await resolveUserProductId();
      const tid = get().templateId || readSavedTemplateId();
      if (get().templateId !== tid) set({ templateId: tid });
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

export function initLandingTemplateId() {
  if (typeof window !== "undefined") {
    useLandingStore.setState({ templateId: readSavedTemplateId() });
  }
}
