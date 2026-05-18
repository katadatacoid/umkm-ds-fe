"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import {
  ECOMMERCE_PLATFORMS,
  EcommerceLinkKey,
  Product,
  useUserProductsStore,
} from "@/stores/use-user-products-store";
import { useRouter } from "next/navigation";
import SuccessModal from "@/app/ui/modal/SuccessModal";
import ImageCropModal from "@/app/ui/modal/ImageCropModal";

interface ProductFormProps {
  mode: "add" | "edit";
  product?: Product;
  redirectTo?: string;
}

interface LinkRow {
  id: number;
  platform: EcommerceLinkKey | "";
  url: string;
}

const buildInitialLinks = (product?: Product): LinkRow[] => {
  if (!product) return [];
  let counter = 0;
  return ECOMMERCE_PLATFORMS.flatMap(({ key }) => {
    const url = product[key];
    if (!url) return [];
    counter += 1;
    return [{ id: counter, platform: key, url }];
  });
};

const ProductForm: React.FC<ProductFormProps> = ({ mode, product, redirectTo }) => {
  const router = useRouter();

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropFileName, setCropFileName] = useState<string>("product.jpg");

  const initialLinks = useMemo(() => buildInitialLinks(product), [product]);
  const baselinePlatforms = useMemo(
    () => new Set(initialLinks.map((row) => row.platform as EcommerceLinkKey)),
    [initialLinks],
  );

  const [formData, setFormData] = useState({
    namaProduk: product?.name || "",
    hargaProduk: product?.price?.toString() || "",
    deskripsi: product?.description || "",
    image: (product?.image as File | string | null) || null,
    status: product?.status || "non-aktif",
  });
  const [linkRows, setLinkRows] = useState<LinkRow[]>(initialLinks);
  const linkRowIdRef = React.useRef<number>(initialLinks.length);

  const usedPlatforms = useMemo(
    () => new Set(linkRows.map((row) => row.platform).filter(Boolean) as EcommerceLinkKey[]),
    [linkRows],
  );
  const hasAvailablePlatform = usedPlatforms.size < ECOMMERCE_PLATFORMS.length;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLinkRow = () => {
    linkRowIdRef.current += 1;
    setLinkRows((prev) => [...prev, { id: linkRowIdRef.current, platform: "", url: "" }]);
  };

  const handleLinkPlatformChange = (rowId: number, platform: EcommerceLinkKey | "") => {
    setLinkRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, platform } : row)));
  };

  const handleLinkUrlChange = (rowId: number, url: string) => {
    setLinkRows((prev) => prev.map((row) => (row.id === rowId ? { ...row, url } : row)));
  };

  const handleRemoveLinkRow = (rowId: number) => {
    setLinkRows((prev) => prev.filter((row) => row.id !== rowId));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    setCropFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setCropSrc(reader.result as string);
    reader.readAsDataURL(file);

    e.target.value = "";
  };

  const handleCropComplete = (croppedFile: File) => {
    if (croppedFile.size > 1 * 1024 * 1024) {
      alert("Ukuran foto setelah crop melebihi 1MB, coba gunakan gambar yang lebih kecil");
      setCropSrc(null);
      return;
    }
    setFormData((prev) => ({ ...prev, image: croppedFile }));
    setCropSrc(null);
  };

  const handleCropCancel = () => {
    setCropSrc(null);
  };

  const getImagePreviewUrl = () => {
    if (!formData.image) return null;
    if (formData.image instanceof File) return URL.createObjectURL(formData.image);
    if (typeof formData.image === "string") {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      return formData.image.startsWith("http") ? formData.image : `${API_URL}${formData.image}`;
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.namaProduk.trim()) {
      alert("Nama produk wajib diisi");
      return;
    }
    if (!formData.hargaProduk || parseFloat(formData.hargaProduk) <= 0) {
      alert("Harga produk harus lebih dari 0");
      return;
    }
    if (!formData.status) {
      alert("Status produk wajib dipilih");
      return;
    }

    const seenPlatforms = new Set<EcommerceLinkKey>();
    for (const row of linkRows) {
      if (!row.platform) {
        alert("Pilih platform untuk setiap baris link, atau hapus baris yang kosong.");
        return;
      }
      if (seenPlatforms.has(row.platform)) {
        const label = ECOMMERCE_PLATFORMS.find((p) => p.key === row.platform)?.label;
        alert(`Link untuk platform "${label}" sudah ditambahkan. Hapus duplikat terlebih dahulu.`);
        return;
      }
      seenPlatforms.add(row.platform);
    }

    setIsSubmitting(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Anda belum login");

      const submitData = new FormData();
      submitData.append("name", formData.namaProduk);
      submitData.append("price", formData.hargaProduk);
      submitData.append("description", formData.deskripsi);
      const backendStatus = formData.status === "aktif" ? "published" : "draft";
      submitData.append("status", backendStatus);

      const filledPlatforms = new Set<EcommerceLinkKey>();
      for (const row of linkRows) {
        if (!row.platform) continue;
        const trimmedUrl = row.url.trim();
        if (trimmedUrl) {
          submitData.append(row.platform, trimmedUrl);
          filledPlatforms.add(row.platform);
        } else if (mode === "edit" && baselinePlatforms.has(row.platform)) {
          // Field link sengaja dikosongkan oleh user → kirim "" agar BE hapus key tsb.
          submitData.append(row.platform, "");
          filledPlatforms.add(row.platform);
        }
      }

      if (mode === "edit") {
        // Link yang sebelumnya ada tapi barisnya dihapus user → kirim "" untuk hapus key di BE.
        for (const platform of baselinePlatforms) {
          if (!filledPlatforms.has(platform)) {
            submitData.append(platform, "");
          }
        }
      }

      if (formData.image instanceof File) submitData.append("image", formData.image);

      const url =
        mode === "add"
          ? `${API_URL}/user/products`
          : `${API_URL}/user/products/${product?.id}`;
      const method = mode === "add" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal menyimpan produk");
      }

      const { fetchProductsData } = useUserProductsStore.getState();
      await fetchProductsData();

      setShowSuccessModal(true);
    } catch (error) {
      console.error("Error submitting product:", error);
      alert(error instanceof Error ? error.message : "Gagal menyimpan produk");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.push(redirectTo || "/user/products-management");
  };

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

  const imagePreviewUrl = getImagePreviewUrl();

  return (
    <>
      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          originalFileName={cropFileName}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6 sm:space-y-5">
          {/* Nama Produk */}
          <div className="flex flex-col">
            <label htmlFor="namaProduk" className="text-sm font-medium text-gray-700">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="namaProduk"
              name="namaProduk"
              value={formData.namaProduk}
              onChange={handleChange}
              placeholder="Masukkan judul produk"
              className="mt-2 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          {/* Harga Produk */}
          <div className="flex flex-col">
            <label htmlFor="hargaProduk" className="text-sm font-medium text-gray-700">
              Harga Produk <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="hargaProduk"
              name="hargaProduk"
              value={formData.hargaProduk}
              onChange={handleChange}
              placeholder="50000"
              min="0"
              className="mt-2 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          {/* Link E-commerce */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Link E-commerce</label>
              <span className="text-xs text-gray-500">
                {linkRows.length}/{ECOMMERCE_PLATFORMS.length}
              </span>
            </div>

            {linkRows.length === 0 ? (
              <p className="mt-2 text-xs text-gray-500">
                Belum ada link. Tambahkan link toko online produk ini bila tersedia.
              </p>
            ) : (
              <div className="mt-2 space-y-2">
                {linkRows.map((row) => {
                  const platformOptions = ECOMMERCE_PLATFORMS.filter(
                    (p) => p.key === row.platform || !usedPlatforms.has(p.key),
                  );
                  return (
                    <div key={row.id} className="flex flex-col sm:flex-row gap-2">
                      <select
                        value={row.platform}
                        onChange={(e) =>
                          handleLinkPlatformChange(
                            row.id,
                            e.target.value as EcommerceLinkKey | "",
                          )
                        }
                        className="sm:w-44 px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 bg-white"
                      >
                        <option value="" disabled>
                          Pilih platform
                        </option>
                        {platformOptions.map((p) => (
                          <option key={p.key} value={p.key}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="url"
                        value={row.url}
                        onChange={(e) => handleLinkUrlChange(row.id, e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveLinkRow(row.id)}
                        className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 sm:w-auto"
                        title="Hapus link"
                      >
                        Hapus
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-3">
              <button
                type="button"
                onClick={handleAddLinkRow}
                disabled={!hasAvailablePlatform}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#30B280] border border-[#30B280] rounded-md hover:bg-[#30B280] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#30B280]"
              >
                + Tambah Link
              </button>
              {!hasAvailablePlatform && (
                <p className="mt-2 text-xs text-gray-500">
                  Semua platform sudah ditambahkan.
                </p>
              )}
            </div>
          </div>

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
              className="mt-2 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
            />
          </div>

          {/* Upload Gambar */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Foto Produk</label>
            <div className="border border-gray-200 rounded-md p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-24 h-24 flex-shrink-0 mx-auto sm:mx-0">
                  {imagePreviewUrl ? (
                    <Image
                      src={imagePreviewUrl}
                      alt="Preview"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover rounded-md border border-gray-200"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full sm:w-auto">
                  <p className="text-xs text-gray-500 mb-3 text-center sm:text-left">
                    Upload gambar produk (max <span className="font-semibold">1MB</span>). Gambar akan di-crop 1:1.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3">
                    <label className="cursor-pointer w-full sm:w-auto text-center sm:text-left">
                      <span className="inline-block w-full sm:w-auto px-6 py-2 text-sm font-medium text-[#30B280] border border-[#30B280] rounded-md hover:bg-[#30B280] hover:text-white transition-colors">
                        {formData.image ? "Ganti Foto" : "Pilih Foto"}
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
                          {formData.image instanceof File ? formData.image.name : "Gambar saat ini"}
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, image: null }))}
                          className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                          title="Hapus gambar"
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
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-2 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            >
              <option value="" disabled>
                Pilih status
              </option>
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
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Batalkan
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Menyimpan..." : mode === "add" ? "Tambah Produk" : "Simpan Perubahan"}
          </button>
        </div>

        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleCloseModal}
          title={modalContent.title}
          message={modalContent.message}
          buttonLabel="Tutup"
        />
      </form>
    </>
  );
};

export default ProductForm;
