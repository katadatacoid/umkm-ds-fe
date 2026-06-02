import { create } from "zustand";
import {
  aboutAPI,
  resolveUserProductId,
  About,
  AboutValue,
  AboutTeam,
  AboutSectionPayload,
  AboutValuePayload,
  AboutTeamPayload,
} from "@/lib/api";
import { decodeStringFieldsDeep } from "@/lib/utils";

interface AboutState {
  about: About | null;
  values: AboutValue[];
  team: AboutTeam[];
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  saveAbout: (body: AboutSectionPayload) => Promise<void>;

  createValue: (body: AboutValuePayload) => Promise<void>;
  updateValue: (
    id: string | number,
    body: Partial<AboutValuePayload>
  ) => Promise<void>;
  removeValue: (id: string | number) => Promise<void>;

  createTeam: (body: AboutTeamPayload) => Promise<void>;
  updateTeam: (
    id: string | number,
    body: Partial<AboutTeamPayload>
  ) => Promise<void>;
  removeTeam: (id: string | number) => Promise<void>;
}

export const useAboutStore = create<AboutState>((set, get) => ({
  about: null,
  values: [],
  team: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const upid = await resolveUserProductId();
      const res = await aboutAPI.getBundle({
        user_product_id: upid,
        include_hidden: true,
      });
      set({
        about: res.data.about ? decodeStringFieldsDeep(res.data.about) : null,
        values: decodeStringFieldsDeep(res.data.values || []),
        team: decodeStringFieldsDeep(res.data.team || []),
        loading: false,
      });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Gagal memuat about",
        loading: false,
      });
    }
  },

  saveAbout: async (body) => {
    set({ error: null });
    try {
      const res = await aboutAPI.upsertAbout(body);
      set({ about: decodeStringFieldsDeep(res.data) });
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal menyimpan about" });
      throw e;
    }
  },

  createValue: async (body) => {
    try {
      await aboutAPI.createValue(body);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal membuat nilai" });
      throw e;
    }
  },

  updateValue: async (id, body) => {
    try {
      await aboutAPI.updateValue(id, body);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal memperbarui nilai" });
      throw e;
    }
  },

  removeValue: async (id) => {
    try {
      await aboutAPI.removeValue(id);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal menghapus nilai" });
      throw e;
    }
  },

  createTeam: async (body) => {
    try {
      await aboutAPI.createTeam(body);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal membuat anggota team" });
      throw e;
    }
  },

  updateTeam: async (id, body) => {
    try {
      await aboutAPI.updateTeam(id, body);
      await get().fetchAll();
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : "Gagal memperbarui anggota team",
      });
      throw e;
    }
  },

  removeTeam: async (id) => {
    try {
      await aboutAPI.removeTeam(id);
      await get().fetchAll();
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Gagal menghapus anggota team" });
      throw e;
    }
  },
}));
