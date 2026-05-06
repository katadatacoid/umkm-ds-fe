"use client";

import React, { useEffect, useState } from "react";
import { Testimonial } from "@/lib/api";

interface Props {
  open: boolean;
  initial?: Testimonial | null;
  onClose: () => void;
  onSubmit: (data: {
    customer_name: string;
    body: string;
    customer_role: string;
    avatar_url: string;
    rating: number;
    is_featured: boolean;
    is_visible: boolean;
    sort_order: number;
  }) => Promise<void>;
}

export default function TestimonialFormModal({ open, initial, onClose, onSubmit }: Props) {
  const [customerName, setCustomerName] = useState("");
  const [body, setBody] = useState("");
  const [customerRole, setCustomerRole] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [rating, setRating] = useState<number>(5);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setCustomerName(initial?.customer_name || "");
      setBody(initial?.body || "");
      setCustomerRole(initial?.customer_role || "");
      setAvatarUrl(initial?.avatar_url || "");
      setRating(initial?.rating ?? 5);
      setIsFeatured(initial?.is_featured ?? false);
      setIsVisible(initial?.is_visible ?? true);
      setSortOrder(initial?.sort_order ?? 0);
    }
  }, [open, initial]);

  if (!open) return null;

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
        is_featured: isFeatured,
        is_visible: isVisible,
        sort_order: Number(sortOrder) || 0,
      });
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan testimonial");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-800">
            {initial ? "Ubah Testimonial" : "Tambah Testimonial"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
              placeholder="Contoh: Ibu rumah tangga"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Avatar (opsional)</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
            />
          </div>

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
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 accent-emerald-600"
              />
              Featured
            </label>
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

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
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
      </div>
    </div>
  );
}
