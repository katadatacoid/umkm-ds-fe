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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    status: product?.status || "non-aktif",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validate tipe file
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar');
        return;
      }

      // Validate ukuran file (max 1MB)
      if (file.size > 1 * 1024 * 1024) {
        alert('Ukuran file maksimal 1MB');
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  // Helper function to get image preview URL
  const getImagePreviewUrl = () => {
    if (!formData.image) return null;
    
    // If it's a File object (newly uploaded)
    if (formData.image instanceof File) {
      return URL.createObjectURL(formData.image);
    }
    
    // If it's a string URL from backend
    if (typeof formData.image === 'string') {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      // Check if it's already a full URL or just a path
      if (formData.image.startsWith('http')) {
        return formData.image;
      }
      return `${API_URL}${formData.image}`;
    }
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.namaProduk.trim()) {
      alert('Nama produk wajib diisi');
      return;
    }

    if (!formData.hargaProduk || parseFloat(formData.hargaProduk) <= 0) {
      alert('Harga produk harus lebih dari 0');
      return;
    }

    if (!formData.status) {
      alert('Status produk wajib dipilih');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('=== SUBMITTING PRODUCT ===');
      console.log('Mode:', mode);
      console.log('Form data:', formData);

      if (mode === "add") {
        // CREATE NEW PRODUCT - Kirim langsung ke API dengan FormData
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const token = localStorage.getItem('access_token');

        if (!token) {
          throw new Error('Anda belum login');
        }

        // Prepare FormData
        const submitData = new FormData();
        submitData.append('name', formData.namaProduk);
        submitData.append('price', formData.hargaProduk);
        submitData.append('description', formData.deskripsi);
        
        // Convert status: aktif -> published, non-aktif -> draft
        const backendStatus = formData.status === 'aktif' ? 'published' : 'draft';
        submitData.append('status', backendStatus);

        // Add ecommerce links if filled
        if (formData.linkTokopedia) submitData.append('linkTokopedia', formData.linkTokopedia);
        if (formData.linkShopee) submitData.append('linkShopee', formData.linkShopee);
        if (formData.linkLazada) submitData.append('linkLazada', formData.linkLazada);
        if (formData.linkBukalapak) submitData.append('linkBukalapak', formData.linkBukalapak);
        if (formData.linkLainnya) submitData.append('linkLainnya', formData.linkLainnya);

        // Add image if selected
        if (formData.image instanceof File) {
          submitData.append('image', formData.image);
        }

        console.log('Sending FormData to API...');

        const response = await fetch(`${API_URL}/user/products`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: submitData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal menambahkan produk');
        }

        const result = await response.json();
        console.log('Product created:', result);

        // Refresh product list in store
        const { fetchProductsData } = useUserProductsStore.getState();
        await fetchProductsData();

      } else {
        // UPDATE EXISTING PRODUCT
        if (!product?.id) {
          throw new Error('Product ID tidak ditemukan');
        }

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const token = localStorage.getItem('access_token');

        if (!token) {
          throw new Error('Anda belum login');
        }

        // Prepare FormData for update
        const submitData = new FormData();
        submitData.append('name', formData.namaProduk);
        submitData.append('price', formData.hargaProduk);
        submitData.append('description', formData.deskripsi);
        
        // Convert status: aktif -> published, non-aktif -> draft
        const backendStatus = formData.status === 'aktif' ? 'published' : 'draft';
        submitData.append('status', backendStatus);

        // Add ecommerce links
        submitData.append('linkTokopedia', formData.linkTokopedia || '');
        submitData.append('linkShopee', formData.linkShopee || '');
        submitData.append('linkLazada', formData.linkLazada || '');
        submitData.append('linkBukalapak', formData.linkBukalapak || '');
        submitData.append('linkLainnya', formData.linkLainnya || '');

        // Add image only if it's a new File
        if (formData.image instanceof File) {
          submitData.append('image', formData.image);
        }

        console.log('Updating product:', product.id);

        const response = await fetch(`${API_URL}/user/products/${product.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: submitData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal memperbarui produk');
        }

        const result = await response.json();
        console.log('Product updated:', result);

        // Refresh product list in store
        const { fetchProductsData } = useUserProductsStore.getState();
        await fetchProductsData();
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error submitting product:', error);
      alert(error instanceof Error ? error.message : 'Gagal menyimpan produk');
    } finally {
      setIsSubmitting(false);
    }
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

  const imagePreviewUrl = getImagePreviewUrl();

  return (
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
              type="url"
              id={field.name}
              name={field.name}
              value={formData[field.name as keyof typeof formData] as string}
              onChange={handleChange}
              placeholder="https://..."
              className="mt-2 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
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
                  Upload gambar produk (max <span className="font-semibold">1MB</span>)
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3">
                  <label className="cursor-pointer w-full sm:w-auto text-center sm:text-left">
                    <span className="inline-block w-full sm:w-auto px-6 py-2 text-sm font-medium text-[#30B280] border border-[#30B280] rounded-md hover:bg-[#30B280] hover:text-white transition-colors">
                      {formData.image ? 'Ganti Foto' : 'Pilih Foto'}
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
                          : 'Gambar saat ini'}
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
            <option value="" disabled>Pilih status</option>
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
          {isSubmitting ? 'Menyimpan...' : mode === "add" ? "Tambah Produk" : "Simpan Perubahan"}
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