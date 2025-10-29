"use client";

import DataTable, { Column, classNames } from "@/app/ui/datatables/datatable";
import { useMemo, useEffect } from "react";
import Image from "next/image";
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

interface DemoTableRecentProductProps {
  title: string;
  description: string;
}

function shortText(text: string, max = 30) {
  return text.length <= max ? text : text.slice(0, max) + "...";
}

export default function DemoTableRecentProduct({
  title,
  description,
}: DemoTableRecentProductProps) {
  const router = useRouter();
  const { products, fetchProductsData } = useUserProductsStore();

  // Fetch data when this component mounts
  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

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
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>

      <DataTable<Product>
        rows={products}
        columns={columns}
        showToolbar={false}
        initialSort={{ key: "id", dir: "asc" }}
        selectable
        rowActions={[
          {
            label: "Ubah",
            onClick: (row) => router.push(`/user/products-management/edit/${row.id}?from=beranda`),
          },
          {
            label: "Hapus",
            onClick: (row) => alert(`Hapus produk id ${row.id}`),
          },
        ]}
        getRowId={(row) => row.id}
        isLoading={false}
        error={null}
        exportMode="filtered"
        filename="produk.csv"
      />
    </div>
  );
}
