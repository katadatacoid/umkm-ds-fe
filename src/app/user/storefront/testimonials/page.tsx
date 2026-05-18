"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import StatsSection from "@/app/ui/section/seaction-stat";
import HeadSummary from "@/app/ui/headers/header-summary";
import TableTestimonials from "./table-testimonials";
import { useTestimonialsStore } from "@/stores/use-testimonials-store";
import { Testimonial } from "@/lib/api";

const TestimonialsPage: React.FC = () => {
  const router = useRouter();
  const { statsData, fetchAll } = useTestimonialsStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleAdd = () => {
    router.push("/user/storefront/testimonials/new");
  };

  const handleEdit = (row: Testimonial) => {
    router.push(`/user/storefront/testimonials/${row.id}/edit`);
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
      </div>
    </DashboardUserLayout>
  );
};

export default TestimonialsPage;
