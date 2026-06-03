"use client";

import React, { useEffect, useMemo, useState } from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import HeadSummary from "@/app/ui/headers/header-summary";
import SectionEditorV2 from "./v2/section-editor-v2";
import KeyUnggulanList from "./v2/key-unggulan-list";
import SectionTooltip from "@/components/SectionTooltip";
import { userAPI, resolveUserProductId, type LandingSingletonKind } from "@/lib/api";
import { useLandingStore } from "@/stores/use-landing-store";

const ALL_SINGLETON_KINDS: { kind: LandingSingletonKind; label: string }[] = [
  { kind: "hero",         label: "Banner cover utama"    },
  { kind: "cta",          label: "Banner tombol utama"   },
  { kind: "cta_product",  label: "Banner tombol produk"  },
  { kind: "cta_filosofi", label: "Banner tombol Filosofi"},
];

const KIND_ALLOWED_TEMPLATES: Partial<Record<LandingSingletonKind, number[]>> = {
  cta_filosofi: [4],
};

const KIND_EXCLUDED_TEMPLATES: Partial<Record<LandingSingletonKind, number[]>> = {
  cta: [4],
};

const KEY_UNGGULAN_ALLOWED_TEMPLATES = [4];

const FE_WEB_BASE = (
  process.env.NEXT_PUBLIC_FE_WEB || "https://demo.rumahdigitalku.id"
).replace(/\/+$/, "");

type Selection =
  | { type: "singleton"; kind: LandingSingletonKind }
  | { type: "key_unggulan"; id: string };

const LandingSectionsPage: React.FC = () => {
  const {
    data,
    templateId,
    loading,
    error,
    refresh,
    setTemplateId,
    upsertSingleton,
    createKeyUnggulan,
    updateKeyUnggulan,
    deleteKeyUnggulan,
    reorderKeyUnggulan,
  } = useLandingStore();

  const [selection, setSelection]         = useState<Selection | null>(null);
  const [userProductId, setUserProductId] = useState<string | null>(null);
  const [creating, setCreating]           = useState(false);

  const showKeyUnggulan =
    templateId != null && KEY_UNGGULAN_ALLOWED_TEMPLATES.includes(Number(templateId));

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [profileRes, upid] = await Promise.all([
        userAPI.getMe().catch((e) => { console.error("[landing] getMe error:", e); return null; }),
        resolveUserProductId().catch((e) => { console.error("[landing] resolveUserProductId error:", e); return null; }),
      ]);
      if (cancelled) return;
      const tid = profileRes?.data?.umkm?.template_id;
      if (tid) setTemplateId(tid);
      setUserProductId(upid ?? null);
      if (!cancelled) refresh();
    })();
    return () => { cancelled = true; };
  }, []);

  const allowedSingletonKinds = useMemo(() => {
    return ALL_SINGLETON_KINDS.filter(({ kind }) => {
      if (templateId != null) {
        const excludedTemplates = KIND_EXCLUDED_TEMPLATES[kind];
        if (excludedTemplates && excludedTemplates.includes(Number(templateId))) {
          return false;
        }
      }
      
      const allowedTemplates = KIND_ALLOWED_TEMPLATES[kind];
      if (!allowedTemplates) return true;
      if (templateId == null) return false;
      return allowedTemplates.includes(Number(templateId));
    });
  }, [templateId]);

  const previewUrl = userProductId ? `${FE_WEB_BASE}/web/${userProductId}` : null;

  const handlePreview = () => {
    if (!previewUrl) {
      alert("user_product_id belum tersedia. Pastikan akun memiliki UMKM aktif.");
      return;
    }
    window.open(previewUrl, "_blank", "noopener,noreferrer");
  };

  const singletonItems = useMemo(
    () =>
      allowedSingletonKinds.map(({ kind, label }) => ({
        kind,
        label,
        section: data[kind],
      })),
    [allowedSingletonKinds, data]
  );

  const totalCount =
    singletonItems.filter((s) => s.section).length +
    (showKeyUnggulan ? data.key_unggulan.length : 0);

  useEffect(() => {
    if (selection?.type === "singleton") {
      const stillAllowed = allowedSingletonKinds.some((k) => k.kind === selection.kind);
      if (!stillAllowed) setSelection(null);
    }
    if (selection?.type === "key_unggulan" && !showKeyUnggulan) setSelection(null);
  }, [allowedSingletonKinds, showKeyUnggulan, selection]);

  useEffect(() => {
    if (selection) return;
    const firstSingleton = singletonItems.find((s) => s.section);
    if (firstSingleton) {
      setSelection({ type: "singleton", kind: firstSingleton.kind });
    } else if (showKeyUnggulan && data.key_unggulan[0]) {
      setSelection({ type: "key_unggulan", id: data.key_unggulan[0].id });
    }
  }, [selection, singletonItems, data.key_unggulan, showKeyUnggulan]);

  const handleCreateSingleton = async (kind: LandingSingletonKind) => {
    setCreating(true);
    try {
      await upsertSingleton(kind, { is_visible: true, sort_order: 0 });
      setSelection({ type: "singleton", kind });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal membuat section");
    } finally {
      setCreating(false);
    }
  };

  const handleCreateKeyUnggulan = async () => {
    setCreating(true);
    try {
      const created = await createKeyUnggulan({ is_visible: true });
      setSelection({ type: "key_unggulan", id: created.id });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal membuat item");
    } finally {
      setCreating(false);
    }
  };

  const activeSection = useMemo(() => {
    if (!selection) return null;
    if (selection.type === "singleton") return data[selection.kind];
    return data.key_unggulan.find((x) => x.id === selection.id) ?? null;
  }, [selection, data]);

  return (
    <DashboardUserLayout path="user">
      <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 md:px-6 lg:px-8 pb-6">
        <HeadSummary title="Landing Page" updatedAt="Baru saja" mode="search" />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap items-center gap-3">
          <button
            onClick={handlePreview}
            disabled={!previewUrl}
            title={previewUrl ?? "user_product_id belum tersedia"}
            className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400 inline-flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
            Preview
          </button>
          <span className="text-xs text-gray-500">Template ID: {templateId}</span>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-2">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
          <aside className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 h-fit">
            <h4 className="px-2 pt-1 pb-2 text-xs font-semibold uppercase text-gray-500">
              Sections ({totalCount})
            </h4>

            {loading && totalCount === 0 && (
              <p className="px-2 py-3 text-sm text-gray-500">Memuat...</p>
            )}

            <div className="space-y-1">
              {singletonItems.map(({ kind, label, section }) => {
                const active =
                  selection?.type === "singleton" && selection.kind === kind;

                if (!section) {
                  return (
                    <button
                      key={kind}
                      onClick={() => handleCreateSingleton(kind)}
                      disabled={creating}
                      className="w-full text-left rounded-md px-3 py-2 text-sm text-gray-400 hover:bg-gray-50 border border-dashed border-gray-200"
                      title={`Buat section ${label}`}
                    >
                      <div className="flex items-center justify-between">
                        <SectionTooltip kind={kind} position="right">
                          <span>{label}</span>
                        </SectionTooltip>
                        <span className="text-[10px] text-emerald-600">+ buat</span>
                      </div>
                    </button>
                  );
                }

                return (
                  <div
                    key={kind}
                    className={
                      "flex items-stretch rounded-md transition " +
                      (active ? "bg-emerald-50" : "hover:bg-gray-50")
                    }
                  >
                    <button
                      onClick={() => setSelection({ type: "singleton", kind })}
                      className={
                        "flex-1 min-w-0 text-left px-3 py-2 text-sm " +
                        (active ? "text-emerald-700 font-medium" : "text-gray-700")
                      }
                    >
                      <div className="flex items-center gap-1 min-w-0 overflow-hidden">
                        <SectionTooltip kind={kind} position="right">
                          <span>{label}</span>
                        </SectionTooltip>
                        {!section.is_visible && (
                          <span className="ml-auto flex-shrink-0 text-[10px] text-gray-400">
                            hidden
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate mt-0.5">
                        {section.judul || "(tanpa judul)"}
                      </div>
                    </button>

                    <button
                      onClick={() =>
                        upsertSingleton(kind, { is_visible: !section.is_visible }).catch(
                          (err) => alert(err instanceof Error ? err.message : "Gagal mengubah")
                        )
                      }
                      title={section.is_visible ? "Sembunyikan" : "Tampilkan"}
                      className="px-2 text-gray-400 hover:text-gray-700 flex-shrink-0"
                      aria-label={section.is_visible ? "Sembunyikan" : "Tampilkan"}
                    >
                      {section.is_visible ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

           {showKeyUnggulan && (
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between px-2 mb-2">
                <SectionTooltip kind="key_unggulan_item" position="right">
                  <span className="text-xs font-semibold uppercase text-gray-500">
                    Keunggulan produk
                  </span>
                </SectionTooltip>
                <button
                  onClick={handleCreateKeyUnggulan}
                  disabled={creating}
                  className="text-xs px-2 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-400"
                >
                  + Tambah
                </button>
              </div>
              <KeyUnggulanList
                items={data.key_unggulan}
                activeId={selection?.type === "key_unggulan" ? selection.id : null}
                onSelect={(id) => setSelection({ type: "key_unggulan", id })}
                onReorder={reorderKeyUnggulan}
              />
            </div>
          )}
          </aside>

          <div>
            {activeSection && selection ? (
              <SectionEditorV2
                key={activeSection.id}
                kind={
                  selection.type === "singleton" ? selection.kind : "key_unggulan_item"
                }
                section={activeSection}
                templateId={templateId}
                onSave={async (body) => {
                  if (selection.type === "singleton") {
                    await upsertSingleton(selection.kind, body);
                  } else {
                    await updateKeyUnggulan(selection.id, body);
                  }
                }}
                onDelete={
                  selection.type === "key_unggulan"
                    ? async () => {
                        await deleteKeyUnggulan(selection.id);
                        setSelection(null);
                      }
                    : undefined
                }
              />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-sm text-gray-500">
                Pilih section di sebelah kiri, atau buat section baru.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardUserLayout>
  );
};

export default LandingSectionsPage;