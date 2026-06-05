"use client";

import React, { useEffect, useState } from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import HeadSummary from "@/app/ui/headers/header-summary";
import { useFooterStore } from "@/stores/use-footer-store";
import BrandPanel from "./brand-panel";
import MenuGroupsPanel from "./menu-groups-panel";
import SocialsPanel from "./socials-panel";
import { userAPI } from "@/lib/api";

const TEMPLATE_ID_CACHE_KEY = "umkm_template_id";

const FooterPage: React.FC = () => {
  const { fetchAll, loading, error } = useFooterStore();

  // ─── Baca templateId dari cache dulu, lalu sync dari API ─────────────────
  const [templateId, setTemplateId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem(TEMPLATE_ID_CACHE_KEY);
    return cached ? Number(cached) : null;
  });

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await userAPI.getMe();
        if (cancelled) return;
        const tid = res?.data?.umkm?.template_id;
        if (tid) {
          const numTid = Number(tid);
          setTemplateId(numTid);
          localStorage.setItem(TEMPLATE_ID_CACHE_KEY, String(numTid));
        }
      } catch (e) {
        console.error("[FooterPage] getMe error:", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // ─── Template 1 → mode "Sidebar": judul berubah, BrandPanel & MenuGroupsPanel disembunyikan
  const isSidebarMode = templateId === 1;
  const pageTitle    = isSidebarMode ? "Sidebar" : "Footer";
  const loadingLabel = isSidebarMode ? "Memuat data sidebar..." : "Memuat data footer...";

  return (
    <DashboardUserLayout path="user">
      <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 md:px-6 lg:px-8 pb-6">
        <HeadSummary title={pageTitle} updatedAt="Baru saja" mode="search" />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-2">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-sm text-gray-500">{loadingLabel}</div>
        )}
        {!isSidebarMode && <BrandPanel />}
        {!isSidebarMode && <MenuGroupsPanel />}
        <SocialsPanel />
      </div>
    </DashboardUserLayout>
  );
};

export default FooterPage;