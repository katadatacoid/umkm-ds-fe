"use client";

import React from "react";
import Link from "next/link";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import TestimonialForm from "../testimonial-form";
import { useTestimonialsStore } from "@/stores/use-testimonials-store";

export default function NewTestimonialPage() {
  const { create } = useTestimonialsStore();

  return (
    <DashboardUserLayout path="user">
      <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 md:px-6 lg:px-8 pb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/user/storefront/testimonials" className="hover:text-emerald-600">
            Testimonial
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Tambah Testimonial</span>
        </nav>

        <TestimonialForm
          mode="create"
          onSubmit={async (data) => {
            await create({
              ...data,
              customer_role: data.customer_role || null,
              avatar_url: data.avatar_url || null,
            });
          }}
        />
      </div>
    </DashboardUserLayout>
  );
}
