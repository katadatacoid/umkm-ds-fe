import { create } from "zustand";
import {
  footerAPI,
  resolveUserProductId,
  FooterBrand,
  FooterMenuGroup,
  FooterSocial,
  FooterBrandPayload,
  FooterMenuGroupPayload,
  FooterMenuItemPayload,
  FooterSocialPayload,
} from "@/lib/api";

interface FooterState {
  brand: FooterBrand | null;
  menuGroups: FooterMenuGroup[];
  socials: FooterSocial[];
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  saveBrand: (body: FooterBrandPayload) => Promise<void>;

  createMenuGroup: (body: FooterMenuGroupPayload) => Promise<void>;
  updateMenuGroup: (
    id: string | number,
    body: Partial<FooterMenuGroupPayload>
  ) => Promise<void>;
  removeMenuGroup: (id: string | number) => Promise<void>;

  createMenuItem: (
    groupId: string | number,
    body: FooterMenuItemPayload
  ) => Promise<void>;
  updateMenuItem: (
    id: string | number,
    body: Partial<FooterMenuItemPayload>
  ) => Promise<void>;
  removeMenuItem: (id: string | number) => Promise<void>;

  createSocial: (body: FooterSocialPayload) => Promise<void>;
  updateSocial: (
    id: string | number,
    body: Partial<FooterSocialPayload>
  ) => Promise<void>;
  removeSocial: (id: string | number) => Promise<void>;
}

export const useFooterStore = create<FooterState>((set, get) => ({
  brand: null,
  menuGroups: [],
  socials: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const upid = await resolveUserProductId();
      const res = await footerAPI.getBundle({
        user_product_id: upid,
        include_hidden: true,
      });
      set({
        brand: res.data.footer,
        menuGroups: res.data.menu_groups || [],
        socials: res.data.socials || [],
        loading: false,
      });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Gagal memuat footer",
        loading: false,
      });
    }
  },

  saveBrand: async (body) => {
    set({ error: null });
    try {
      const res = await footerAPI.upsertBrand(body);
      set({ brand: res.data });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal menyimpan brand" });
      throw e;
    }
  },

  createMenuGroup: async (body) => {
    try {
      await footerAPI.createMenuGroup(body);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal membuat menu group" });
      throw e;
    }
  },

  updateMenuGroup: async (id, body) => {
    try {
      await footerAPI.updateMenuGroup(id, body);
      await get().fetchAll();
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Gagal memperbarui menu group",
      });
      throw e;
    }
  },

  removeMenuGroup: async (id) => {
    try {
      await footerAPI.removeMenuGroup(id);
      await get().fetchAll();
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Gagal menghapus menu group",
      });
      throw e;
    }
  },

  createMenuItem: async (groupId, body) => {
    try {
      await footerAPI.createMenuItem(groupId, body);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal membuat menu item" });
      throw e;
    }
  },

  updateMenuItem: async (id, body) => {
    try {
      await footerAPI.updateMenuItem(id, body);
      await get().fetchAll();
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Gagal memperbarui menu item",
      });
      throw e;
    }
  },

  removeMenuItem: async (id) => {
    try {
      await footerAPI.removeMenuItem(id);
      await get().fetchAll();
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Gagal menghapus menu item",
      });
      throw e;
    }
  },

  createSocial: async (body) => {
    try {
      await footerAPI.createSocial(body);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal membuat social link" });
      throw e;
    }
  },

  updateSocial: async (id, body) => {
    try {
      await footerAPI.updateSocial(id, body);
      await get().fetchAll();
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Gagal memperbarui social link",
      });
      throw e;
    }
  },

  removeSocial: async (id) => {
    try {
      await footerAPI.removeSocial(id);
      await get().fetchAll();
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Gagal menghapus social link",
      });
      throw e;
    }
  },
}));
