"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Testimonial } from "@/lib/api";
import ImageUploadField from "@/app/ui/file-upload/image-upload-field";

export type TestimonialFormPayload = {
  customer_name: string;
  body: string;
  customer_role: string;
  avatar_url: string;
  rating: number;
  is_visible: boolean;
  sort_order: number;
};

interface Props {
  mode: "create" | "edit";
  initial?: Testimonial | null;
  onSubmit: (data: TestimonialFormPayload) => Promise<void>;
}

export default function TestimonialForm({ mode, initial, onSubmit }: Props) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState(initial?.customer_name || "");
  const [body, setBody] = useState(initial?.body || "");
  const [customerRole, setCustomerRole] = useState(initial?.customer_role || "");
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatar_url || "");
  const [rating, setRating] = useState<number>(initial?.rating ?? 5);
  const [isVisible, setIsVisible] = useState(initial?.is_visible ?? true);
  const [sortOrder, setSortOrder] = useState<number>(initial?.sort_order ?? 0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !body.trim()) {
      alert("Nama pelanggan dan testimoni wajib diisi.");
      return;
    }
    if (rating < 0 || rating > 5) {
      alert("Rating harus antara 0–5.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        customer_name: customerName.trim(),
        body: body.trim(),
        customer_role: customerRole.trim(),
        avatar_url: avatarUrl.trim(),
        rating: Number(rating) || 0,
        is_visible: isVisible,
        sort_order: Number(sortOrder) || 0,
      });
      router.push("/user/storefront/testimonials");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4"
    >
      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-100">
        {mode === "edit" ? "Ubah Testimonial" : "Tambah Testimonial"}
      </h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pelanggan</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Peran / Profesi</label>
        <input
          type="text"
          value={customerRole}
          onChange={(e) => setCustomerRole(e.target.value)}
          placeholder="Contoh: Ibu rumah tangga"
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Testimoni</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
        />
      </div>

      <ImageUploadField
        label="Avatar (opsional)"
        value={avatarUrl}
        onChange={setAvatarUrl}
      />

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[120px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating (0–5)</label>
          <input
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
          />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="h-4 w-4 accent-emerald-600"
          />
          Tampilkan
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push("/user/storefront/testimonials")}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400"
        >
          {submitting ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}
