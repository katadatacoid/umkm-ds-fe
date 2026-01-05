"use client";

import DataTable, { Column, classNames } from "@/app/ui/datatables/datatable";
import { useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import SafeImage from "@/components/SafeImage";
import { useUserProductsStore } from "@/stores/use-user-products-store";

type Product = {
  id: number;
  image: string;
  name: string;
  price: number;
  description?: string;
  date?: string;
  status: "aktif" | "non-aktif";
};

interface DemoTableRecentProductProps {
  title: string;
  description: string;
  searchQuery?: string;
}

function shortText(text: string, max = 30) {
  return text.length <= max ? text : text.slice(0, max) + "...";
}

export default function DemoTableRecentProduct({
  title,
  description,
  searchQuery = "",
}: DemoTableRecentProductProps) {
  const router = useRouter();
  
  // 🔥 GUNAKAN ZUSTAND STORE YANG SAMA
  const { products, fetchProductsData, deleteProduct, loading, error } = useUserProductsStore();

  // Fetch data when searchQuery changes
  useEffect(() => {
    console.log("DemoTableRecentProduct - fetching with search:", searchQuery);
    fetchProductsData({
      search: searchQuery.trim() || undefined
    });
  }, [searchQuery, fetchProductsData]);

  // Handler for delete
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
          const API_URL =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
          const imageUrl = v ? `${API_URL}${v}` : "/images/no-image.png";

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
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>

      {/* Debug info */}
      {searchQuery && (
        <div className="mb-2 text-sm text-gray-600 font-normal">
          {loading ? (
            <span className="italic">Mencari...</span>
          ) : (
            <span>
              Menampilkan {products.length} data{" "}
              {searchQuery && `(pencarian: "${searchQuery}")`}
            </span>
          )}
        </div>
      )}

      <DataTable<Product>
        key={`table-${searchQuery}-${products.length}`}
        rows={products}
        columns={columns}
        showToolbar={false}
        initialSort={{ key: "id", dir: "asc" }}
        selectable
        rowActions={[
          {
            label: "Ubah",
            onClick: (row) =>
              router.push(
                `/user/products-management/edit/${row.id}?from=beranda`
              ),
          },
          {
            label: "Hapus",
            onClick: handleDelete,
          },
        ]}
        getRowId={(row) => row.id}
        isLoading={loading}
        error={error}
        exportMode="filtered"
      />
    </div>
  );
}