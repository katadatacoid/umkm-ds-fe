"use client";

import React, { useEffect, useMemo, useState } from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import HeadSummary from "@/app/ui/headers/header-summary";
import SectionEditor from "./section-editor";
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
  "footer",
];

const LandingSectionsPage: React.FC = () => {
  const { sections, templateId, loading, error, fetchAll, upsert, setTemplateId } =
    useLandingSectionsStore();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [templateInput, setTemplateInput] = useState<string>(String(templateId));
  const [creatingKey, setCreatingKey] = useState<string>("");

  useEffect(() => {
    initLandingSectionsTemplateId();
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    setTemplateInput(String(templateId));
  }, [templateId]);

  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.sort_order - b.sort_order || Number(a.id) - Number(b.id)),
    [sections]
  );

  const activeSection = useMemo(
    () => sortedSections.find((s) => s.section_key === activeKey) || sortedSections[0] || null,
    [sortedSections, activeKey]
  );

  const handleApplyTemplateId = () => {
    const n = Number(templateInput);
    if (!Number.isFinite(n) || n <= 0) {
      alert("Template ID harus angka positif");
      return;
    }
    setTemplateId(n);
    fetchAll();
  };

  const handleCreateSection = async () => {
    const key = creatingKey.trim().toLowerCase().replace(/\s+/g, "_");
    if (!key) return;
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
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Template ID</label>
            <input
              type="number"
              value={templateInput}
              onChange={(e) => setTemplateInput(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-32 focus:ring focus:ring-green-200 outline-none"
            />
          </div>
          <button
            onClick={handleApplyTemplateId}
            className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition"
          >
            Muat Template
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
