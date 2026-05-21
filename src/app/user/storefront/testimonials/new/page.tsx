"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import TestimonialForm from "../testimonial-form";
import { useTestimonialsStore } from "@/stores/use-testimonials-store";
import { userAPI } from "@/lib/api";

// ─── Template ID yang boleh mengakses halaman Testimonial ─────────────────────
const TESTIMONIAL_ALLOWED_TEMPLATES = [3];

export default function NewTestimonialPage() {
  const router = useRouter();
  const { create } = useTestimonialsStore();

  // ─── Template authorization ──────────────────────────────────────────────
  const [templateId, setTemplateId]           = useState<number | null>(null);
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
        console.error("[testimonials/new] getMe error:", e);
        if (!cancelled) setTemplateId(null);
      } finally {
        if (!cancelled) setTemplateLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const isAllowed =
    templateId != null && TESTIMONIAL_ALLOWED_TEMPLATES.includes(templateId);


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
              Halaman Testimonial hanya tersedia untuk template tertentu.
            </p>
            <button
              onClick={() => router.push("/user/storefront/testimonials")}
              className="mt-4 text-xs px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Kembali
            </button>
          </div>
        </div>
      </DashboardUserLayout>
    );
  }


  return (
    <DashboardUserLayout path="user">
      <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 md:px-6 lg:px-8 pb-6">
        <nav className="text-sm text-gray-500">
          <Link
            href="/user/storefront/testimonials"
            className="hover:text-emerald-600"
          >
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