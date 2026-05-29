"use client";

import DataTable, { Column, classNames, formatDate } from "@/app/ui/datatables/datatable";
import { useMemo } from "react";
import { useTestimonialsStore } from "@/stores/use-testimonials-store";
import { Testimonial } from "@/lib/api";

function shortText(text: string, max = 60) {
  if (!text) return "-";
  return text.length <= max ? text : text.slice(0, max) + "...";
}

interface Props {
  onEdit: (row: Testimonial) => void;
}

export default function TableTestimonials({ onEdit }: Props) {
  const { items, loading, error, remove } = useTestimonialsStore();

  const handleDelete = async (row: Testimonial) => {
    if (confirm(`Hapus testimonial dari "${row.customer_name}"?`)) {
      try {
        await remove(row.id);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Gagal menghapus");
      }
    }
  };

  const columns = useMemo<Column<Testimonial>[]>(
    () => [
      { key: "sort_order", header: "Urutan", width: "80px" },
      { key: "customer_name", header: "Pelanggan" },
      { key: "customer_role", header: "Peran", render: (v) => v || "-" },
      {
        key: "rating",
        header: "Rating",
        width: "90px",
        render: (v) => `${Number(v ?? 0).toFixed(1)} / 5`,
      },
      {
        key: "body",
        header: "Testimoni",
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
      <DataTable<Testimonial>
        rows={items}
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
