"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import TestimonialForm from "../../testimonial-form";
import { useTestimonialsStore } from "@/stores/use-testimonials-store";

export default function EditTestimonialPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const { items, loading, error, fetchAll, update } = useTestimonialsStore();

  useEffect(() => {
    if (items.length === 0) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initial = useMemo(() => items.find((x) => x.id === id) ?? null, [items, id]);

  return (
    <DashboardUserLayout path="user">
      <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 md:px-6 lg:px-8 pb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/user/storefront/testimonials" className="hover:text-emerald-600">
            Testimonial
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Ubah Testimonial</span>
        </nav>

        {!initial && loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-sm text-gray-500">
            Memuat...
          </div>
        )}

        {!initial && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-sm text-gray-500">
            {error || "Testimonial tidak ditemukan."}
          </div>
        )}

        {initial && (
          <TestimonialForm
            mode="edit"
            initial={initial}
            onSubmit={async (data) => {
              await update(initial.id, {
                ...data,
                customer_role: data.customer_role || null,
                avatar_url: data.avatar_url || null,
              });
            }}
          />
        )}
      </div>
    </DashboardUserLayout>
  );
}
