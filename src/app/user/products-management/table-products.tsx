"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import DataTable, { Column, classNames, formatDate } from "@/app/ui/datatables/datatable";

type Product = {
  id: number;
  image: string;
  name: string;
  price: number;
  description: string;
  date: string;
  status: "Aktif" | "Nonaktif";
};

// Dummy data
const products: Product[] = [
  {
    id: 1,
    image: "/images/user/product-1.jpg",
    name: "Blazer Edith House",
    price: 455000,
    description:
      "Produk eksklusif dengan bahan premium dan desain elegan untuk tampilan modern sehari-hari.",
    date: "2025-09-01",
    status: "Aktif",
  },
  {
    id: 2,
    image: "/images/user/product-2.jpg",
    name: "Fendro Classic Bag",
    price: 515000,
    description:
      "Tas tangan bergaya klasik yang cocok untuk berbagai acara, terbuat dari kulit sintetis berkualitas.",
    date: "2025-09-03",
    status: "Nonaktif",
  },
  {
    id: 3,
    image: "/images/user/product-3.jpg",
    name: "Vintora Casual Shirt",
    price: 325000,
    description:
      "Kemeja santai berbahan katun lembut, memberikan kenyamanan maksimal sepanjang hari.",
    date: "2025-09-05",
    status: "Aktif",
  },
  {
    id: 4,
    image: "/images/user/product-4.jpg",
    name: "Lumina Watch",
    price: 735000,
    description:
      "Jam tangan elegan dengan tali stainless steel dan fitur water-resistant hingga 30 meter.",
    date: "2025-09-07",
    status: "Aktif",
  },
  {
    id: 5,
    image: "/images/user/product-5.jpg",
    name: "Calyra Sneakers",
    price: 595000,
    description:
      "Sepatu kasual dengan desain modern dan sol empuk yang cocok untuk aktivitas harian.",
    date: "2025-09-10",
    status: "Nonaktif",
  },
];

function shortText(text: string, max = 20) {
  return text.length <= max ? text : text.slice(0, max) + "...";
}

export default function DemoTableProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"Semua" | "Aktif" | "Nonaktif">("Semua");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedStatus, setAppliedStatus] = useState<"Semua" | "Aktif" | "Nonaktif">("Semua");

  // Filtering logic
  const filteredData = products.filter((p) => {
    const matchName = p.name.toLowerCase().includes(appliedSearch.toLowerCase());
    const matchStatus = appliedStatus === "Semua" ? true : p.status === appliedStatus;
    return matchName && matchStatus;
  });

  // Table columns
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
        key: "description",
        header: "Deskripsi",
        render: (v) => shortText(v, 30),
      },
      {
        key: "date",
        header: "Tanggal",
        render: (v) => formatDate(v),
      },
      {
        key: "status",
        header: "Status",
        width: "120px",
        render: (v) => (
          <span
            className={classNames(
              "rounded-full px-2 py-1 text-xs font-medium",
              v === "Aktif" && "bg-emerald-50 text-emerald-700",
              v === "Nonaktif" && "bg-gray-200 text-gray-600"
            )}
          >
            {v}
          </span>
        ),
      },
    ],
    []
  );

  return (
    <div className="max-w-full px-0 py-5" style={{ width: "calc(100%)" }}>
      {/*  Search & Filter */}
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
          onChange={(e) => setStatusFilter(e.target.value as "Semua" | "Aktif" | "Nonaktif")}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
        >
          <option value="Semua">Pilih Status (Semua)</option>
          <option value="Aktif">Aktif</option>
          <option value="Nonaktif">Nonaktif</option>
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

      {/*  Table */}
      <DataTable<Product>
        rows={filteredData}
        columns={columns}
        showToolbar={false}
        initialSort={{ key: "id", dir: "asc" }}
        selectable
        rowActions={[
          {
            label: (
              <button className="px-3 py-1 text-[13px] rounded-md bg-white cursor-pointer hover:bg-gray-50 transition">
                Ubah
              </button>
            ),
            onClick: (row) => alert(`Ubah produk ID ${row.id}`),
          },
          {
            label: (
              <button className="px-3 py-1 text-[13px] rounded-md bg-white cursor-pointer hover:bg-gray-50 transition">
                Lihat
              </button>
            ),
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
