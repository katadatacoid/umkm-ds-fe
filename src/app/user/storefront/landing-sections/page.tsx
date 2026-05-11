"use client";

import React, { useEffect, useMemo, useState } from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import HeadSummary from "@/app/ui/headers/header-summary";
import SectionEditor from "./section-editor";
import { userAPI, resolveUserProductId } from "@/lib/api";
import {
  initLandingSectionsTemplateId,
  useLandingSectionsStore,
} from "@/stores/use-landing-sections-store";

const KNOWN_SECTION_KEYS = [
  "hero",
  "who_we_are",
  "our_products",
  "marquee",
  "why_choose_us",
  "explore_products",
  "blog_insights",
];

const HIDDEN_SECTION_KEYS = new Set(["footer"]);

const FE_WEB_BASE = (process.env.NEXT_PUBLIC_FE_WEB || "https://demo.rumahdigitalku.id").replace(
  /\/+$/,
  ""
);

const LandingSectionsPage: React.FC = () => {
  const { sections, templateId, loading, error, fetchAll, upsert, setTemplateId } =
    useLandingSectionsStore();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [creatingKey, setCreatingKey] = useState<string>("");
  const [userProductId, setUserProductId] = useState<string | null>(null);

  useEffect(() => {
    initLandingSectionsTemplateId();
    let cancelled = false;
    (async () => {
      try {
        const [profileRes, upid] = await Promise.all([
          userAPI.getMe().catch(() => null),
          resolveUserProductId().catch(() => null),
        ]);
        if (cancelled) return;
        const tid = profileRes?.data?.umkm?.template_id;
        if (tid && tid !== templateId) setTemplateId(tid);
        setUserProductId(upid ?? null);
      } finally {
        if (!cancelled) fetchAll();
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const previewUrl = userProductId ? `${FE_WEB_BASE}/web/${userProductId}` : null;

  const handlePreview = () => {
    if (!previewUrl) {
      alert("user_product_id belum tersedia. Pastikan akun memiliki UMKM aktif.");
      return;
    }
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  const sortedSections = useMemo(
    () =>
      [...sections]
        .filter((s) => !HIDDEN_SECTION_KEYS.has(s.section_key))
        .sort((a, b) => a.sort_order - b.sort_order || Number(a.id) - Number(b.id)),
    [sections]
  );

  const activeSection = useMemo(
    () => sortedSections.find((s) => s.section_key === activeKey) || sortedSections[0] || null,
    [sortedSections, activeKey]
  );

  const handleCreateSection = async () => {
    const key = creatingKey.trim().toLowerCase().replace(/\s+/g, "_");
    if (!key) return;
    if (HIDDEN_SECTION_KEYS.has(key)) {
      alert(`Section "${key}" dikelola di menu Footer.`);
      return;
    }
    if (sortedSections.some((s) => s.section_key === key)) {
      alert(`Section "${key}" sudah ada.`);
      return;
    }
    try {
      await upsert(key, {
        template_id: templateId,
        content: {},
        is_visible: true,
        sort_order: sortedSections.length + 1,
      });
      setCreatingKey("");
      setActiveKey(key);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal membuat section");
    }
  };

  return (
    <DashboardUserLayout path="user">
      <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 md:px-6 lg:px-8 pb-6">
        <HeadSummary title="Landing Page" updatedAt="Baru saja" mode="search" />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap items-end gap-3">
          <button
            onClick={handlePreview}
            disabled={!previewUrl}
            title={previewUrl ?? "user_product_id belum tersedia"}
            className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400 inline-flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
            Preview
          </button>
          <div className="ml-auto flex items-end gap-2">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Tambah Section Baru (key)
              </label>
              <input
                type="text"
                placeholder="contoh: hero, footer, our_products..."
                value={creatingKey}
                onChange={(e) => setCreatingKey(e.target.value)}
                list="known-section-keys"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-64 focus:ring focus:ring-green-200 outline-none font-mono"
              />
              <datalist id="known-section-keys">
                {KNOWN_SECTION_KEYS.map((k) => (
                  <option key={k} value={k} />
                ))}
              </datalist>
            </div>
            <button
              onClick={handleCreateSection}
              disabled={!creatingKey.trim()}
              className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400"
            >
              Buat
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-2">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
          <aside className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 h-fit">
            <h4 className="px-2 pt-1 pb-2 text-xs font-semibold uppercase text-gray-500">
              Sections ({sortedSections.length})
            </h4>
            {loading && sortedSections.length === 0 && (
              <p className="px-2 py-3 text-sm text-gray-500">Memuat...</p>
            )}
            {!loading && sortedSections.length === 0 && (
              <p className="px-2 py-3 text-sm text-gray-500">
                Belum ada section untuk template ini.
              </p>
            )}
            <ul className="space-y-1">
              {sortedSections.map((s) => {
                const active = activeSection?.id === s.id;
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => setActiveKey(s.section_key)}
                      className={
                        "w-full text-left rounded-md px-3 py-2 text-sm transition " +
                        (active
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "hover:bg-gray-50 text-gray-700")
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs">{s.section_key}</span>
                        {!s.is_visible && (
                          <span className="text-[10px] text-gray-400">hidden</span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400">urutan {s.sort_order}</div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <div>
            {activeSection ? (
              <SectionEditor
                key={activeSection.id}
                section={activeSection}
                templateId={templateId}
                onSave={(body) => upsert(activeSection.section_key, body)}
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-sm text-gray-500">
                Pilih section di sebelah kiri, atau buat section baru dari panel di atas.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardUserLayout>
  );
};

export default LandingSectionsPage;
