"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import DataTable, { Column, classNames } from "@/app/ui/datatables/datatable";
import { useUserProductsStore } from "@/stores/use-user-products-store";
import { useRouter } from "next/navigation";

type Product = {
  id: number;
  image: string;
  name: string;
  price: number;
  description?: string;
  date?: string;
  status: "aktif" | "non-aktif";
};

function shortText(text: string, max = 20) {
  return text.length <= max ? text : text.slice(0, max) + "...";
}

export default function DemoTableProducts() {
  const { products, fetchProductsData } = useUserProductsStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | "aktif" | "non-aktif">("Semua");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedStatus, setAppliedStatus] = useState<"Semua" | "aktif" | "non-aktif">("Semua");
  const router = useRouter();

  // Fetch simulated data (from Zustand store)
  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  // Filtered data
  const filteredData = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(appliedSearch.toLowerCase());
    const matchStatus = appliedStatus === "Semua" ? true : p.status === appliedStatus;
    return matchName && matchStatus;
  });

  // Columns
  const columns = useMemo<Column<Product>[]>(
    () => [
      {
        key: "id",
        header: "No",
        width: "60px",
        render: (_, row) => row.id,
      },
      {
        key: "image",
        header: "Foto Produk",
        width: "100px",
        render: (v) => (
          <div className="flex justify-center">
            <Image
              src={v || "/images/no-image.png"}
              alt="Foto Produk"
              width={60}
              height={60}
              className="rounded-lg object-cover border border-gray-200"
            />
          </div>
        ),
      },
      { key: "name", header: "Nama Produk" },
      {
        key: "price",
        header: "Harga",
        render: (v) => `Rp ${v.toLocaleString("id-ID")}`,
      },
      {
        key: "date",
        header: "Tanggal",
        width: "120px",
        render: (v) => v || "-",
      },
      {
        key: "description",
        header: "Deskripsi",
        render: (v) => shortText(v, 30),
      },
      {
        key: "status",
        header: "Status",
        width: "120px",
        render: (v) => (
          <span
            className={classNames(
              "rounded-full px-2 py-1 text-xs font-medium",
              v === "aktif" && "bg-emerald-50 text-emerald-700",
              v === "non-aktif" && "bg-gray-200 text-gray-600"
            )}
          >
            {v === "aktif" ? "Aktif" : "Nonaktif"}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="max-w-full px-0 py-5" style={{ width: "calc(100%)" }}>
      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input
          type="text"
          placeholder="Cari nama produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 w-64 text-sm focus:ring focus:ring-green-200 outline-none"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "Semua" | "aktif" | "non-aktif")}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
        >
          <option value="Semua">Pilih Status (Semua)</option>
          <option value="aktif">Aktif</option>
          <option value="non-aktif">Nonaktif</option>
        </select>

        <button
          onClick={() => {
            setAppliedSearch(searchTerm);
            setAppliedStatus(statusFilter);
          }}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition"
        >
          Terapkan
        </button>

        <button
          onClick={() => {
            setSearchTerm("");
            setStatusFilter("Semua");
            setAppliedSearch("");
            setAppliedStatus("Semua");
          }}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <DataTable<Product>
        rows={filteredData}
        columns={columns}
        showToolbar={false}
        initialSort={{ key: "id", dir: "asc" }}
        selectable
        rowActions={[
          {
            label: "Ubah",
            onClick: (row) => router.push(`/user/products-management/edit/${row.id}`),
          },
          {
            label: "Lihat",
            onClick: (row) => alert(`Lihat produk ID ${row.id}`),
          },
        ]}
        getRowId={(row) => row.id}
        isLoading={false}
        error={null}
      />
    </div>
  );
}
