"use client";

import React, { useEffect, useState } from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import StatsSection from "@/app/ui/section/seaction-stat";
import HeadSummary from "@/app/ui/headers/header-summary";
import TableFaqs from "./table-faqs";
import FaqFormModal from "./faq-form-modal";
import { useFaqsStore } from "@/stores/use-faqs-store";
import { Faq } from "@/lib/api";

const FaqsPage: React.FC = () => {
  const { statsData, fetchAll, create, update } = useFaqsStore();
  const [editing, setEditing] = useState<Faq | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

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
