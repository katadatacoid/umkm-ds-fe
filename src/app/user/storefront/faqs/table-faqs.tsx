"use client";

import DataTable, { Column, classNames, formatDate } from "@/app/ui/datatables/datatable";
import { useMemo } from "react";
import { useFaqsStore } from "@/stores/use-faqs-store";
import { Faq } from "@/lib/api";

function shortText(text: string, max = 60) {
  if (!text) return "-";
  return text.length <= max ? text : text.slice(0, max) + "...";
}

interface TableFaqsProps {
  onEdit: (row: Faq) => void;
}

export default function TableFaqs({ onEdit }: TableFaqsProps) {
  const { faqs, loading, error, remove } = useFaqsStore();

  const handleDelete = async (row: Faq) => {
    if (confirm(`Hapus FAQ "${row.question}"?`)) {
      try {
        await remove(row.id);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Gagal menghapus");
      }
    }
  };

  const columns = useMemo<Column<Faq>[]>(
    () => [
      { key: "sort_order", header: "Urutan", width: "80px" },
      { key: "question", header: "Pertanyaan" },
      {
        key: "answer",
        header: "Jawaban",
        render: (v) => shortText(String(v ?? ""), 80),
      },
      {
        key: "is_visible",
        header: "Status",
        width: "120px",
        render: (v) => (
          <span
            className={classNames(
              "rounded-full px-2 py-1 text-xs font-medium",
              v ? "bg-emerald-50 text-emerald-700" : "bg-gray-200 text-gray-600"
            )}
          >
            {v ? "Tampil" : "Tersembunyi"}
          </span>
        ),
      },
      {
        key: "updated_at",
        header: "Diperbarui",
        width: "140px",
        render: (v) => (v ? formatDate(String(v)) : "-"),
      },
    ],
    []
  );

  return (
    <div className="max-w-full px-0 py-5" style={{ width: "calc(100%)" }}>
      <DataTable<Faq>
        rows={faqs}
        columns={columns}
        showToolbar={false}
        initialSort={{ key: "sort_order", dir: "asc" }}
        rowActions={[
          { label: "Ubah", onClick: onEdit },
          { label: "Hapus", onClick: handleDelete },
        ]}
        getRowId={(row) => row.id}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}
