"use client";

import DataTable, { Column, classNames } from "@/app/ui/datatables/datatable";
import { useMemo, useState } from "react";
// import Image from "next/image";
import { useUserProductsStore } from "@/stores/use-user-products-store";
import { useRouter } from "next/navigation";
import SafeImage from "@/components/SafeImage";


type Product = {
  id: number;
  image: string;
  name: string;
  price: number;
  description?: string;
  date?: string;
  status: "aktif" | "non-aktif";
};

function shortText(text: string, max = 30) {
  return text.length <= max ? text : text.slice(0, max) + "...";
}

export default function DemoTableProducts() {
  const router = useRouter();
  const { products, fetchProductsData, deleteProduct, loading, error } =
    useUserProductsStore();

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "published" | "draft">("");

  // Apply filters
  const applyFilters = async () => {
    console.log("=== APPLY FILTERS (FRONTEND) ===");
    console.log("Search term:", searchTerm);
    console.log("Status filter:", statusFilter);

    // Prepare parameters
    const searchParam = searchTerm.trim() || undefined;
    const statusParam = statusFilter || undefined;

    console.log("Calling fetchProductsData with:", { search: searchParam, status: statusParam });

    // Call fetch
    await fetchProductsData({
      search: searchParam,
      status: statusParam
    });
  };

  // Reset filters
  const resetFilters = async () => {
    console.log("=== RESET FILTERS ===");
    setSearchTerm("");
    setStatusFilter("");
    await fetchProductsData();
  };

  // Use products directly from store
  const filteredProducts = products;

  // Delete handler
  const handleDelete = async (row: Product) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${row.name}"?`)) {
      try {
        await deleteProduct(row.id);
        alert("Produk berhasil dihapus");
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus produk");
      }
    }
  };

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
        render: (v) => {
          const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
          const imageUrl = v ? `${API_URL}${v}` : '/images/no-image.png';

          return (
            <div className="flex justify-center">
              <SafeImage
                src={imageUrl}
                alt="Foto Produk"
                width={60}
                height={60}
                className="rounded-lg object-cover border border-gray-200"
              />
            </div>
          );
        },
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
        render: (v) => shortText(v || "", 30),
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
          placeholder="Cari nama produk atau ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              applyFilters();
            }
          }}
          className="border border-gray-300 rounded-md px-3 py-2 w-64 text-sm focus:ring focus:ring-green-200 outline-none"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            const newValue = e.target.value as "" | "published" | "draft";
            console.log("Status filter changed to:", newValue);
            setStatusFilter(newValue);
          }}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
        >
          <option value="">Semua Status</option>
          <option value="published">Aktif</option>
          <option value="draft">Nonaktif</option>
        </select>

        <button
          onClick={applyFilters}
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Memuat..." : "Terapkan"}
        </button>

        <button
          onClick={resetFilters}
          disabled={loading}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <DataTable<Product>
        rows={filteredProducts}
        columns={columns}
        showToolbar={false}
        initialSort={{ key: "id", dir: "asc" }}
        selectable
        rowActions={[
          {
            label: "Ubah",
            onClick: (row) =>
              router.push(`/user/products-management/edit/${row.id}`),
          },
          {
            label: "Hapus",
            onClick: handleDelete,
          },
        ]}
        getRowId={(row) => row.id}
        isLoading={loading}
        error={error}
      />
    </div>
  );
}