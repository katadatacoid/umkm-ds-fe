"use client";
import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import DashboarUserLayout from "@/app/ui/layout/ds-user-layout";
import ProductForm from "@/app/ui/forms/product-form";
import { useUserProductsStore } from "@/stores/use-user-products-store";
import { useRouter } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const from = searchParams.get("from"); // "beranda" or null
  const product = useUserProductsStore((s) => s.products.find((p) => p.id === Number(id)));
  const router = useRouter();

  if (!product) return <div className="p-8 text-center">Produk tidak ditemukan.</div>;

  // If user came from Beranda, redirect back there. Otherwise, go to product management.
  const redirectTo = from === "beranda" ? "/user" : "/user/products-management";

  return (
    <DashboarUserLayout path="user">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Ubah Produk</h2>
        <ProductForm mode="edit" product={product} redirectTo={redirectTo} />
      </div>
    </DashboarUserLayout>
  );
}
