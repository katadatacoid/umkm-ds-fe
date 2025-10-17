"use client";
import DashboarUserLayout from "@/app/ui/layout/ds-user-layout";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";

const AddProductForm = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [formData, setFormData] = useState({
    namaProduk: "",
    hargaProduk: "",
    linkTokopedia: "",
    linkShopee: "",
    linkLazada: "",
    linkBukalapak: "",
    linkLainnya: "",
    deskripsi: "",
    image: null as File | null,
    status: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Show success modal
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    // Navigate back to products list
    router.push("/user/products-management");
  };

  return (
    <DashboarUserLayout path="user">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg mt-4 sm:mt-8">
        {/* Title & Breadcrumb */}
        <div className="mb-6">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center justify-center sm:justify-start text-sm text-gray-500 mb-2">
            <span
              onClick={() => router.push("/user/products-management")}
              className="text-[#30B280] hover:underline cursor-pointer"
            >
              Produk
            </span>
            <svg
              className="mx-2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-600 font-medium">Tambah Produk Baru</span>
          </nav>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-gray-800 text-center sm:text-left">
            Tambah Produk Baru
          </h2>
        </div>

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
                  {/* Image Preview */}
                  <div className="w-24 h-24 flex-shrink-0 mx-auto sm:mx-0">
                    {formData.image ? (
                      <img
                        src={URL.createObjectURL(formData.image)}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-md border border-gray-200"
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

                  {/* File Info and Controls */}
                  <div className="flex-1 w-full sm:w-auto">
                    <p className="text-xs text-gray-500 mb-3 text-center sm:text-left">
                      Please upload square image, size less than{" "}
                      <span className="font-semibold"> 100KB</span>
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
                            {formData.image.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image: null })}
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
                <option value="nonaktif">Nonaktif</option>
              </select>
            </div>
          </div>

          {/* Tombol */}
          <div className="flex flex-col md:flex-row justify-between mt-8 gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-white bg-gray-400 rounded-md hover:bg-gray-500 w-full md:w-auto"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 w-full md:w-auto"
            >
              Tambah Produk
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-[#30B280]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Produk berhasil ditambahkan!
              </h3>
              <p className="text-sm text-gray-500">
                Selamat! Produk telah siap tersedia dan siap untuk dipasarkan
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="w-full px-6 py-3 bg-[#30B280] text-white rounded-md hover:bg-[#28a070] transition-colors font-medium"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </DashboarUserLayout>
  );
};

export default AddProductForm;
