"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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

const toRow = (m: ContactMessage): InboxRow => ({
  id: m.id,
  name: m.name || "-",
  email: m.email || "-",
  message: m.message || "-",
  ip_address: m.ip_address || "-",
  user_agent: m.user_agent || "-",
  status: m.status || "-",
  created_at: m.created_at,
  updated_at: m.updated_at || "",
});

function useInboxData(
  searchQuery: string,
  statusFilter: string,
  refreshKey: number
) {
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
        const response = await contactAPI.getAllPaginated({
          search: debouncedSearch || undefined,
          status: statusFilter || undefined,
        });
        setData((response.data || []).map(toRow));
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
  }, [debouncedSearch, statusFilter, refreshKey]);

  const updateRow = useCallback((updated: ContactMessage) => {
    setData((prev) =>
      prev.map((r) => (String(r.id) === String(updated.id) ? toRow(updated) : r))
    );
  }, []);

  return { data, loading, error, updateRow };
}

const STATUS_STYLE: Record<string, { cls: string; label: string }> = {
  new: { cls: "bg-blue-50 text-blue-700", label: "Baru" },
  read: { cls: "bg-yellow-50 text-yellow-700", label: "Dibaca" },
  replied: { cls: "bg-emerald-50 text-emerald-700", label: "Dibalas" },
  archived: { cls: "bg-gray-100 text-gray-600", label: "Diarsipkan" },
};

interface TableInboxProps {
  title: string;
  searchQuery?: string;
  statusFilter?: string;
  refreshKey?: number;
  onRowRead?: () => void;
}

export default function TableInbox({
  title,
  searchQuery = "",
  statusFilter = "",
  refreshKey = 0,
  onRowRead,
}: TableInboxProps) {
  const { data, loading, error, updateRow } = useInboxData(
    searchQuery,
    statusFilter,
    refreshKey
  );

  const [detail, setDetail] = useState<ContactMessage | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const handleRowClick = useCallback(
    async (row: InboxRow) => {
      const wasNew = row.status === "new";
      try {
        setDetailLoading(true);
        setDetailError(null);
        setDetail(null);
        const res = await contactAPI.getById(row.id);
        setDetail(res.data);
        // Backend auto-mark new -> read; sync row di tabel.
        updateRow(res.data);
        if (wasNew) onRowRead?.();
      } catch (err: any) {
        console.error("Failed to load contact detail:", err);
        setDetailError(err.message || "Gagal memuat detail pesan");
      } finally {
        setDetailLoading(false);
      }
    },
    [updateRow, onRowRead]
  );

  const closeDetail = () => {
    setDetail(null);
    setDetailError(null);
  };

  const columns = useMemo<Column<InboxRow>[]>(
    () => [
      { key: "id", header: "ID", width: "70px" },
      {
        key: "name",
        header: "Nama",
        render: (v, row) => (
          <span
            className={
              row.status === "new" ? "font-semibold text-gray-900" : "text-gray-700"
            }
          >
            {String(v)}
          </span>
        ),
      },
      { key: "email", header: "Email" },
      {
        key: "message",
        header: "Pesan",
        render: (v, row) => {
          const text = String(v ?? "");
          return (
            <span
              className={`block max-w-[280px] truncate ${
                row.status === "new" ? "font-medium text-gray-900" : "text-gray-600"
              }`}
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
          const meta = STATUS_STYLE[status] ?? {
            cls: "bg-gray-50 text-gray-700",
            label: String(v) || "-",
          };
          return (
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${meta.cls}`}
            >
              {meta.label}
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

      {(searchQuery || statusFilter) && (
        <div className="mb-2 text-sm text-gray-600 font-normal">
          {loading ? (
            <span className="italic">Memuat...</span>
          ) : (
            <span>
              Menampilkan {data.length} pesan
              {searchQuery && ` (pencarian: "${searchQuery}")`}
              {statusFilter && ` (status: ${statusFilter})`}
            </span>
          )}
        </div>
      )}

      <DataTable<InboxRow>
        key={`inbox-${searchQuery}-${statusFilter}-${refreshKey}-${data.length}`}
        rows={data}
        columns={columns}
        showToolbar={false}
        initialSort={{ key: "created_at", dir: "desc" }}
        searchableKeys={["name", "email", "message"]}
        selectable
        onRowClick={handleRowClick}
        getRowId={(row) => row.id}
        isLoading={loading}
        error={error}
        exportMode="filtered"
        filename="inbox-data.csv"
      />

      {(detail || detailLoading || detailError) && (
        <DetailModal
          detail={detail}
          loading={detailLoading}
          error={detailError}
          onClose={closeDetail}
        />
      )}
    </div>
  );
}

function DetailModal({
  detail,
  loading,
  error,
  onClose,
}: {
  detail: ContactMessage | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h3 className="text-base font-semibold text-gray-800">Detail Pesan</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl leading-none"
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4 space-y-3 text-sm">
          {loading && (
            <div className="py-8 text-center text-gray-500">Memuat detail...</div>
          )}
          {error && (
            <div className="py-4 text-center text-red-600">{error}</div>
          )}
          {detail && !loading && !error && (
            <>
              <Field label="ID" value={String(detail.id)} />
              <Field label="Nama" value={detail.name} />
              <Field label="Email" value={detail.email} />
              <Field
                label="Status"
                value={
                  STATUS_STYLE[detail.status?.toLowerCase()]?.label ??
                  detail.status
                }
              />
              <Field label="IP Address" value={detail.ip_address || "-"} />
              <Field
                label="User Agent"
                value={detail.user_agent || "-"}
                mono
              />
              <Field
                label="Dibuat"
                value={detail.created_at ? formatDate(detail.created_at) : "-"}
              />
              <Field
                label="Diperbarui"
                value={detail.updated_at ? formatDate(detail.updated_at) : "-"}
              />
              <div>
                <div className="text-xs text-gray-500 mb-1">Pesan</div>
                <div className="whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 p-3 text-gray-800">
                  {detail.message}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-t px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="col-span-1 text-xs text-gray-500">{label}</div>
      <div
        className={`col-span-2 text-gray-800 break-words ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}
