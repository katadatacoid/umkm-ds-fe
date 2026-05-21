"use client";

import React, { useEffect, useState } from "react";
import { Faq } from "@/lib/api";

interface FaqFormModalProps {
  open: boolean;
  initial?: Faq | null;
  onClose: () => void;
  onSubmit: (data: {
    question: string;
    answer: string;
    sort_order: number;
    is_visible: boolean;
  }) => Promise<void>;
}

export default function FaqFormModal({ open, initial, onClose, onSubmit }: FaqFormModalProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [isVisible, setIsVisible] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setQuestion(initial?.question || "");
      setAnswer(initial?.answer || "");
      setSortOrder(initial?.sort_order ?? 0);
      setIsVisible(initial?.is_visible ?? true);
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      alert("Pertanyaan dan jawaban wajib diisi.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        question: question.trim(),
        answer: answer.trim(),
        sort_order: Number(sortOrder) || 0,
        is_visible: isVisible,
      });
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan FAQ");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {initial ? "Ubah FAQ" : "Tambah FAQ"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pertanyaan</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
              placeholder="Contoh: Berapa lama pengiriman?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jawaban</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
              placeholder="Tulis jawaban di sini..."
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 mt-6">
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
