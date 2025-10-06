'use client'
import DashboardAdminLayout from '@/app/ui/layout/ds-admin-layout';
import { usePathname, useRouter } from 'next/navigation';

import React, { useState } from 'react';

const TambahUMKMForm = () => {

      const router = useRouter();  // Call useRouter at the top level
      const pathname = usePathname(); // Hook to access the current path

  const [formData, setFormData] = useState({
    namaLengkap: '',
    namaUsaha: '',
    email: '',
    noHandphone: '',
    namaWebsite: '',
    namaDomain: '',
    template: '',
    paketLangganan: '',
    status: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (

    <DashboardAdminLayout path="xxx">
              <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tambah UMKM Baru</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="namaLengkap" className="text-sm font-medium text-gray-700">
              Nama Lengkap
            </label>
            <input
              type="text"
              id="namaLengkap"
              name="namaLengkap"
              value={formData.namaLengkap}
              onChange={handleChange}
              className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
              placeholder="Masukkan nama pemilik usaha"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="namaUsaha" className="text-sm font-medium text-gray-700">
              Nama Usaha
            </label>
            <input
              type="text"
              id="namaUsaha"
              name="namaUsaha"
              value={formData.namaUsaha}
              onChange={handleChange}
              className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
              placeholder="Contoh: Kopi Sejati, Toko Maju Jaya"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
              placeholder="contoh@email.com"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="noHandphone" className="text-sm font-medium text-gray-700">
              No Handphone
            </label>
            <input
              type="text"
              id="noHandphone"
              name="noHandphone"
              value={formData.noHandphone}
              onChange={handleChange}
              className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
              placeholder="Masukkan nomor aktif (contoh: 081234567890)"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="namaWebsite" className="text-sm font-medium text-gray-700">
              Nama Website
            </label>
            <input
              type="text"
              id="namaWebsite"
              name="namaWebsite"
              value={formData.namaWebsite}
              onChange={handleChange}
              className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
              placeholder="Contoh: kopisejati"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="namaDomain" className="text-sm font-medium text-gray-700">
              Nama Domain
            </label>
            <select
              id="namaDomain"
              name="namaDomain"
              value={formData.namaDomain}
              onChange={handleChange}
              className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
            >
              <option value="">Pilih domain</option>
              <option value="domain1">Domain 1</option>
              <option value="domain2">Domain 2</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="template" className="text-sm font-medium text-gray-700">
              Template
            </label>
            <select
              id="template"
              name="template"
              value={formData.template}
              onChange={handleChange}
              className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
            >
              <option value="">Pilih Template</option>
              <option value="template1">Template 1</option>
              <option value="template2">Template 2</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="paketLangganan" className="text-sm font-medium text-gray-700">
              Paket Langganan
            </label>
            <select
              id="paketLangganan"
              name="paketLangganan"
              value={formData.paketLangganan}
              onChange={handleChange}
              className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
            >
              <option value="">Pilih paket berlangganan</option>
              <option value="paket1">Paket 1</option>
              <option value="paket2">Paket 2</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c"
            >
              <option value="">Select</option>
              <option value="aktif">Aktif</option>
              <option value="non-aktif">Non-Aktif</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between mt-6">
          <button
            onClick={()=>{
                router.back()
            }}
            type="button"
            className="px-6 py-2 text-white bg-gray-400 rounded-md hover:bg-gray-2000 w-full md:w-auto"
          >
            Batalkan
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 w-full md:w-auto mt-4 md:mt-0"
          >
            Tambah Produk
          </button>
        </div>
      </form>
    </div>
    </DashboardAdminLayout>
  
  );
};

export default TambahUMKMForm;
