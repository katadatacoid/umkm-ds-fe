"use client";

import React, { useEffect, useState } from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import StatsSection from "@/app/ui/section/seaction-stat";
import HeadSummary from "@/app/ui/headers/header-summary";
import TableTestimonials from "./table-testimonials";
import TestimonialFormModal from "./testimonial-form-modal";
import { useTestimonialsStore } from "@/stores/use-testimonials-store";
import { Testimonial } from "@/lib/api";

const TestimonialsPage: React.FC = () => {
  const { statsData, fetchAll, create, update } = useTestimonialsStore();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (row: Testimonial) => {
    setEditing(row);
    setModalOpen(true);
  };

  const handleSubmit = async (data: {
    customer_name: string;
    body: string;
    customer_role: string;
    avatar_url: string;
    rating: number;
    is_featured: boolean;
    is_visible: boolean;
    sort_order: number;
  }) => {
    const payload = {
      ...data,
      customer_role: data.customer_role || null,
      avatar_url: data.avatar_url || null,
    };
    if (editing) await update(editing.id, payload);
    else await create(payload);
  };

  return (
    <DashboardUserLayout path="user">
      <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 md:px-6 lg:px-8 pb-6">
        <HeadSummary
          title="Testimonial"
          updatedAt="Baru saja"
          mode="button"
          buttonLabel="Tambah Testimonial"
          onButtonClick={handleAdd}
        />

        <div className="mt-1">
          <StatsSection stats={statsData} />
        </div>

        <div className="mt-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <TableTestimonials onEdit={handleEdit} />
        </div>

        <TestimonialFormModal
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

export default TestimonialsPage;
