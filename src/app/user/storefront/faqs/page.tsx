"use client";

import React, { useEffect, useState } from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import StatsSection from "@/app/ui/section/seaction-stat";
import HeadSummary from "@/app/ui/headers/header-summary";
import TableFaqs from "./table-faqs";
import FaqFormModal from "./faq-form-modal";
import { useFaqsStore } from "@/stores/use-faqs-store";
import { userAPI, Faq } from "@/lib/api";

// ─── Template ID yang boleh mengakses halaman FAQ ─────────────────────────────
const FAQ_ALLOWED_TEMPLATES = [4];

const FaqsPage: React.FC = () => {
  const { statsData, fetchAll, create, update } = useFaqsStore();
  const [editing, setEditing]     = useState<Faq | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [templateId, setTemplateId]   = useState<number | null>(null);
  const [templateLoading, setTemplateLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await userAPI.getMe();
        if (cancelled) return;
        const tid = res?.data?.umkm?.template_id;
        setTemplateId(tid ? Number(tid) : null);
      } catch (e) {
        console.error("[faqs] getMe error:", e);
        if (!cancelled) setTemplateId(null);
      } finally {
        if (!cancelled) setTemplateLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Fetch data hanya jika template diizinkan
  const isAllowed =
    templateId != null && FAQ_ALLOWED_TEMPLATES.includes(templateId);

  useEffect(() => {
    if (isAllowed) fetchAll();
  }, [isAllowed, fetchAll]);

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (row: Faq) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = async (data: {
    question: string;
    answer: string;
    sort_order: number;
    is_visible: boolean;
  }) => {
    if (editing) await update(editing.id, data);
    else await create(data);
  };

  if (templateLoading) {
    return (
      <DashboardUserLayout path="user">
        <div className="flex items-center justify-center min-h-[40vh]">
          <p className="text-sm text-gray-500">Memuat...</p>
        </div>
      </DashboardUserLayout>
    );
  }

  if (!isAllowed) {
    return (
      <DashboardUserLayout path="user">
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 px-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center max-w-md w-full">
            <p className="text-2xl mb-2">🔒</p>
            <h2 className="text-base font-semibold text-gray-800 mb-1">
              Fitur Tidak Tersedia
            </h2>
            <p className="text-sm text-gray-500">
              Halaman FAQ hanya tersedia untuk template tertentu.
              Template Anda saat ini tidak memiliki akses ke fitur ini.
            </p>
            {templateId && (
              <p className="text-xs text-gray-400 mt-3">
                Template ID: {templateId}
              </p>
            )}
          </div>
        </div>
      </DashboardUserLayout>
    );
  }

  // ─── Render: normal (hanya template 4) ───────────────────────────────────
  return (
    <DashboardUserLayout path="user">
      <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 md:px-6 lg:px-8 pb-6">
        <HeadSummary
          title="FAQ"
          updatedAt="Baru saja"
          mode="button"
          buttonLabel="Tambah FAQ"
          onButtonClick={handleAdd}
        />

        <div className="mt-1">
          <StatsSection stats={statsData} />
        </div>

        <div className="mt-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <TableFaqs onEdit={handleEdit} />
        </div>

        <FaqFormModal
          open={modalOpen}
          initial={editing}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </DashboardUserLayout>
  );
};

export default FaqsPage;