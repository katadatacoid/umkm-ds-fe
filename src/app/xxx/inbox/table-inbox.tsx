"use client";

import { useEffect, useMemo, useState } from "react";
import DataTable, { Column, formatDate } from "@/app/ui/datatables/datatable";
import { contactAPI, ContactMessage } from "@/lib/api";

type InboxRow = {
  id: number | string;
  name: string;
  email: string;
  message: string;
  ip_address: string;
  user_agent: string;
  status: string;
  created_at: string;
  updated_at: string;
};

function useInboxData(searchQuery: string = "") {
  const [data, setData] = useState<InboxRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await contactAPI.getAll(
          debouncedSearch.trim() || undefined
        );

        const rows: InboxRow[] = (response.data || []).map(
          (m: ContactMessage) => ({
            id: m.id,
            name: m.name || "-",
            email: m.email || "-",
            message: m.message || "-",
            ip_address: m.ip_address || "-",
            user_agent: m.user_agent || "-",
            status: m.status || "-",
            created_at: m.created_at,
            updated_at: m.updated_at || "",
          })
        );

        setData(rows);
      } catch (err: any) {
        console.error("Error fetching inbox data:", err);
        setError(err.message || "Failed to fetch inbox data");
        if (err.message?.includes("Unauthorized")) {
          window.location.href = "/";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch]);

  return { data, loading, error };
}

interface TableInboxProps {
  title: string;
  searchQuery?: string;
}

export default function TableInbox({
  title,
  searchQuery = "",
}: TableInboxProps) {
  const { data, loading, error } = useInboxData(searchQuery);

  const columns = useMemo<Column<InboxRow>[]>(
    () => [
      { key: "id", header: "ID", width: "70px" },
      { key: "name", header: "Nama" },
      { key: "email", header: "Email" },
      {
        key: "message",
        header: "Pesan",
        render: (v) => {
          const text = String(v ?? "");
          return (
            <span
              className="block max-w-[280px] truncate"
              title={text}
            >
              {text}
            </span>
          );
        },
      },
      { key: "ip_address", header: "IP Address", width: "140px" },
      {
        key: "user_agent",
        header: "User Agent",
        render: (v) => {
          const text = String(v ?? "");
          return (
            <span
              className="block max-w-[220px] truncate text-xs text-gray-600"
              title={text}
            >
              {text}
            </span>
          );
        },
      },
      {
        key: "status",
        header: "Status",
        width: "120px",
        render: (v) => {
          const status = String(v ?? "").toLowerCase();
          let cls = "bg-gray-50 text-gray-700";
          if (status === "unread" || status === "new") {
            cls = "bg-blue-50 text-blue-700";
          } else if (status === "read") {
            cls = "bg-yellow-50 text-yellow-700";
          } else if (status === "replied") {
            cls = "bg-emerald-50 text-emerald-700";
          } else if (status === "archived") {
            cls = "bg-gray-100 text-gray-600";
          }
          return (
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${cls}`}
            >
              {String(v) || "-"}
            </span>
          );
        },
      },
      {
        key: "created_at",
        header: "Dibuat",
        width: "150px",
        render: (v) => (v ? formatDate(String(v)) : "-"),
      },
      {
        key: "updated_at",
        header: "Diperbarui",
        width: "150px",
        render: (v) => (v ? formatDate(String(v)) : "-"),
      },
    ],
    []
  );

  return (
    <div className="max-w-full px-0 py-5" style={{ width: "calc(100%)" }}>
      <h2 className="text-sm sm:text-base font-semibold text-gray-700 mt-3 sm:mb-4">
        {title}
      </h2>

      {searchQuery && (
        <div className="mb-2 text-sm text-gray-600 font-normal">
          {loading ? (
            <span className="italic">Mencari...</span>
          ) : (
            <span>
              Menampilkan {data.length} pesan
              {searchQuery && ` (pencarian: "${searchQuery}")`}
            </span>
          )}
        </div>
      )}

      <DataTable<InboxRow>
        key={`inbox-${searchQuery}-${data.length}`}
        rows={data}
        columns={columns}
        showToolbar={false}
        initialSort={{ key: "created_at", dir: "desc" }}
        searchableKeys={["name", "email", "message"]}
        selectable
        getRowId={(row) => row.id}
        isLoading={loading}
        error={error}
        exportMode="filtered"
        filename="inbox-data.csv"
      />
    </div>
  );
}
