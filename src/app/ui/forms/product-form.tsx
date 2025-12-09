"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product, useUserProductsStore } from "@/stores/use-user-products-store";
import { useRouter } from "next/navigation";
import SuccessModal from "@/app/ui/modal/SuccessModal";

interface ProductFormProps {
  mode: "add" | "edit";
  product?: Product;
  redirectTo?: string;
}

const ProductForm: React.FC<ProductFormProps> = ({ mode, product, redirectTo }) => {
  const router = useRouter();
  const addProduct = useUserProductsStore((s) => s.addProduct);
  const updateProduct = useUserProductsStore((s) => s.updateProduct);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    namaProduk: product?.name || "",
    hargaProduk: product?.price?.toString() || "",
    linkTokopedia: product?.linkTokopedia || "",
    linkShopee: product?.linkShopee || "",
    linkLazada: product?.linkLazada || "",
    linkBukalapak: product?.linkBukalapak || "",
    linkLainnya: product?.linkLainnya || "",
    deskripsi: product?.description || "",
    image: (product?.image as File | string | null) || null,
    status: product?.status || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: Product = {
      id: product?.id || Date.now(),
      name: formData.namaProduk,
      price: Number(formData.hargaProduk),
      linkTokopedia: formData.linkTokopedia || undefined,
      linkShopee: formData.linkShopee || undefined,
      linkLazada: formData.linkLazada || undefined,
      linkBukalapak: formData.linkBukalapak || undefined,
      linkLainnya: formData.linkLainnya || undefined,
      description: formData.deskripsi,
      image:
        formData.image instanceof File
          ? URL.createObjectURL(formData.image)
          : typeof formData.image === "string"
          ? formData.image
          : product?.image || "/images/products/sample1.png",
      status: formData.status as "aktif" | "non-aktif",
    };

    if (mode === "add") await addProduct(payload);
    else await updateProduct(payload.id, payload);

    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.push(redirectTo || "/user/products-management");
  };

  // Choose modal content dynamically
  const modalContent =
    mode === "add"
      ? {
          title: "Produk berhasil ditambahkan!",
          message: "Selamat! Produk baru sudah tercatat dan siap untuk dipasarkan.",
        }
      : {
          title: "Perubahan berhasil disimpan!",
          message: "Produk Anda telah berhasil diperbarui.",
        };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6 sm:space-y-5">
        {/* Nama Produk */}
        <div className="flex flex-col">
          <label htmlFor="namaProduk" className="text-sm font-medium text-gray-700">
            Nama Produk
          </label>
          <input
            type="text"
            id="namaProduk"
            name="namaProduk"
            value={formData.namaProduk}
            onChange={handleChange}
            placeholder="Masukkan judul produk"
            className="mt-2 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
          />
        </div>

        {/* Harga Produk */}
        <div className="flex flex-col">
          <label htmlFor="hargaProduk" className="text-sm font-medium text-gray-700">
            Harga Produk
          </label>
          <input
            type="text"
            id="hargaProduk"
            name="hargaProduk"
            value={formData.hargaProduk}
            onChange={handleChange}
            placeholder="Rp xxxxxx"
            className="mt-2 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
          />
        </div>

        {/* Links */}
        {[
          { label: "Link Tokopedia", name: "linkTokopedia" },
          { label: "Link Shopee", name: "linkShopee" },
          { label: "Link Lazada", name: "linkLazada" },
          { label: "Link Bukalapak", name: "linkBukalapak" },
          { label: "Lainnya", name: "linkLainnya" },
        ].map((field) => (
          <div key={field.name} className="flex flex-col">
            <label htmlFor={field.name} className="text-sm font-medium text-gray-700">
              {field.label}
            </label>
            <input
              type="text"
              id={field.name}
              name={field.name}
              value={formData[field.name as keyof typeof formData] as string}
              onChange={handleChange}
              placeholder="Masukkan URL..."
              className="mt-2 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
            />
          </div>
        ))}

        {/* Deskripsi */}
        <div className="flex flex-col">
          <label htmlFor="deskripsi" className="text-sm font-medium text-gray-700">
            Deskripsi
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            placeholder="Masukkan deskripsi produk"
            rows={4}
            className="mt-2 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c resize-none"
          />
        </div>

        {/* Upload Gambar */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">Input Image</label>
          <div className="border border-gray-200 rounded-md p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-24 h-24 flex-shrink-0 mx-auto sm:mx-0">
                {formData.image ? (
                  typeof formData.image === "string" ? (
                    <Image
                      src={formData.image}
                      alt="Preview"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover rounded-md border border-gray-200"
                      unoptimized
                    />
                  ) : (
                    <Image
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover rounded-md border border-gray-200"
                      unoptimized
                    />
                  )
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* File Info */}
              <div className="flex-1 w-full sm:w-auto">
                <p className="text-xs text-gray-500 mb-3 text-center sm:text-left">
                  Please upload square image, size less than{" "}
                  <span className="font-semibold">100KB</span>
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3">
                  <label className="cursor-pointer w-full sm:w-auto text-center sm:text-left">
                    <span className="inline-block w-full sm:w-auto px-6 py-2 text-sm font-medium text-[#30B280] border border-[#30B280] rounded-md hover:bg-[#30B280] hover:text-white transition-colors">
                      Choose File
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {formData.image && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="truncate max-w-[150px] sm:max-w-[200px]">
                        {formData.image instanceof File
                          ? formData.image.name
                          : formData.image.split("/").pop()}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                        className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col">
          <label htmlFor="status" className="text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-2 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
          >
            <option value="">Pilih status</option>
            <option value="aktif">Aktif</option>
            <option value="non-aktif">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
        >
          Batalkan
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          {mode === "add" ? "Tambah Produk" : "Simpan Perubahan"}
        </button>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        title={modalContent.title}
        message={modalContent.message}
        buttonLabel="Tutup"
      />
    </form>
  );
};

export default ProductForm;
