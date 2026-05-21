import { create } from "zustand";
import { landingSectionsAPI, resolveUserProductId, LandingSection } from "@/lib/api";

const TEMPLATE_ID_LS_KEY = "storefront_template_id";
const DEFAULT_TEMPLATE_ID = 4;

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

interface LandingSectionsState {
  sections: LandingSection[];
  templateId: number;
  loading: boolean;
  error: string | null;

  setTemplateId: (id: number) => void;
  fetchAll: () => Promise<void>;
  upsert: (
    section_key: string,
    body: { template_id: number; content: unknown; is_visible?: boolean; sort_order?: number }
  ) => Promise<void>;
}

export const useLandingSectionsStore = create<LandingSectionsState>((set, get) => ({
  sections: [],
  templateId: DEFAULT_TEMPLATE_ID,
  loading: false,
  error: null,

  setTemplateId: (id) => {
    persistTemplateId(id);
    set({ templateId: id });
  },

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const upid = await resolveUserProductId();
      const tid = get().templateId || readSavedTemplateId();
      if (get().templateId !== tid) set({ templateId: tid });
      const res = await landingSectionsAPI.getAll({
        user_product_id: upid,
        template_id: tid,
        include_hidden: true,
      });
      set({ sections: res.data, loading: false });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal memuat sections", loading: false });
    }
  },

  upsert: async (section_key, body) => {
    set({ loading: true, error: null });
    try {
      await landingSectionsAPI.upsert(section_key, body);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal menyimpan section", loading: false });
      throw e;
    }
  },
}));

export function initLandingSectionsTemplateId() {
  if (typeof window !== "undefined") {
    useLandingSectionsStore.setState({ templateId: readSavedTemplateId() });
  }
}
