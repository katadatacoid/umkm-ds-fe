// for Client component
"use client";

import DataTable, { Column } from "@/app/ui/datatables/datatable";
import { useMemo } from "react";
import Image from "next/image";

type Product = {
  id: number;
  image: string;
  name: string;
  price: number;
  description: string;
};

// Kamu bisa ubah / tambah produk di sini nanti
const products: Product[] = [
  {
    id: 1,
    image: "/images/user/product-1.jpg", // gunakan path lokal public/images/user
    name: "Biazer Edith House",
    price: 455000,
    description:
      "Produk eksklusif dengan bahan premium dan desain elegan untuk tampilan modern sehari-hari.",
  },
  {
    id: 2,
    image: "/images/user/product-2.jpg",
    name: "Fendro Classic Bag",
    price: 515000,
    description:
      "Tas tangan bergaya klasik yang cocok untuk berbagai acara, terbuat dari kulit sintetis berkualitas.",
  },
  {
    id: 3,
    image: "/images/user/product-3.jpg",
    name: "Vintora Casual Shirt",
    price: 325000,
    description:
      "Kemeja santai berbahan katun lembut, memberikan kenyamanan maksimal sepanjang hari.",
  },
  {
    id: 4,
    image: "/images/user/product-4.jpg",
    name: "Lumina Watch",
    price: 735000,
    description:
      "Jam tangan elegan dengan tali stainless steel dan fitur water-resistant hingga 30 meter.",
  },
  {
    id: 5,
    image: "/images/user/product-5.jpg",
    name: "Calyra Sneakers",
    price: 595000,
    description:
      "Sepatu kasual dengan desain modern dan sol empuk yang cocok untuk aktivitas harian.",
  },
];

interface DemoTableRecentProductProps {
  title: string;
}

function shortText(text: string, max = 50) {
  return text.length <= max ? text : text.slice(0, max) + "...";
}

export default function DemoTableRecentProduct({ title }: DemoTableRecentProductProps) {
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
        render: (v) => shortText(v, 60),
      },
    ],
    []
  );

  return (
    <div className="max-w-full px-0 py-5" style={{ width: "calc(100%)" }}>
      <h2 className="text-sm sm:text-base font-semibold text-gray-700 mt-3 sm:mb-4">{title}</h2>

      <DataTable<Product>
        rows={products}
        columns={columns}
        showToolbar={false}
        initialSort={{ key: "id", dir: "asc" }}
        selectable
        rowActions={[
          {
            label: (
              <button
                className="px-3 py-1 text-[13px] rounded-md bg-white transition cursor-pointer"
                onClick={() => {}}
              >
                Ubah
              </button>
            ),
            onClick: (row) => alert(`Ubah produk id ${(row as any).id}`),
          },
          {
            label: (
              <button
                className="px-3 py-1 text-[13px] rounded-md bg-white transition cursor-pointer"
                onClick={() => {}}
              >
                Hapus
              </button>
            ),
            onClick: (row) => alert(`Hapus produk id ${(row as any).id}`),
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
