"use client";

import DataTable, { Column, classNames, formatDate } from "@/app/ui/datatables/datatable";
import { useMemo } from "react";
import { useBlogPostsStore } from "@/stores/use-blog-posts-store";
import { BlogPost } from "@/lib/api";

interface Props {
  onEdit: (row: BlogPost) => void;
}

export default function TableBlogPosts({ onEdit }: Props) {
  const { items, loading, error, remove } = useBlogPostsStore();

  const handleDelete = async (row: BlogPost) => {
    if (confirm(`Hapus artikel "${row.title}"?`)) {
      try {
        await remove(row.id);
      } catch (err) {
        alert(err instanceof Error ? err.message : "Gagal menghapus");
      }
    }
  };

  const columns = useMemo<Column<BlogPost>[]>(
    () => [
      { key: "title", header: "Judul" },
      { key: "slug", header: "Slug", render: (v) => <span className="font-mono text-xs">{v}</span> },
      { key: "category", header: "Kategori", width: "140px", render: (v) => v || "-" },
      {
        key: "status",
        header: "Status",
        width: "120px",
        render: (v) => {
          const s = String(v);
          const cls =
            s === "published"
              ? "bg-emerald-50 text-emerald-700"
              : s === "draft"
              ? "bg-yellow-50 text-yellow-700"
              : "bg-gray-200 text-gray-600";
          return (
            <span className={classNames("rounded-full px-2 py-1 text-xs font-medium capitalize", cls)}>
              {s}
            </span>
          );
        },
      },
      // {
      //   key: "is_featured",
      //   header: "Featured",
      //   width: "100px",
      //   render: (v) => (v ? "Ya" : "-"),
      // },
      {
        key: "published_at",
        header: "Tayang",
        width: "140px",
        render: (v) => (v ? formatDate(String(v)) : "-"),
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
      <DataTable<BlogPost>
        rows={items}
        columns={columns}
        showToolbar={false}
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
