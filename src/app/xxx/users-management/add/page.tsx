'use client'
import DashboardAdminLayout from '@/app/ui/layout/ds-admin-layout';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const TambahUMKMForm = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [formData, setFormData] = useState({
    name: '',
    namaUsaha: '',
    email: '',
    noHandphone: '',
    namaWebsite: '',
    namaDomain: '',
    template: 0,
    paketLangganan: 0,
    status: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert template dan paketLangganan ke number
    if (name === 'template' || name === 'paketLangganan') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi sederhana
    if (!formData.name || !formData.namaUsaha || !formData.email) {
      console.error('Field wajib belum diisi');
      alert('Mohon lengkapi Nama Lengkap, Nama Usaha, dan Email');
      return;
    }

    // Log ke console untuk melihat data
    console.log('=== FORM SUBMITTED ===');
    console.log('Data yang akan dikirim:', formData);
    console.log('====================');
    
    // Success message
    alert('Data berhasil disubmit! Lihat console untuk detail.');
    
    // Optional: Reset form setelah submit
    // setFormData({
    //   name: '',
    //   namaUsaha: '',
    //   email: '',
    //   noHandphone: '',
    //   namaWebsite: '',
    //   namaDomain: '',
    //   template: '',
    //   paketLangganan: '',
    //   status: '',
    // });
  };

  return (
    <DashboardAdminLayout path="xxx">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tambah UMKM Baru</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Masukkan nama pemilik usaha"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="namaUsaha" className="text-sm font-medium text-gray-700">
                Nama Usaha <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="namaUsaha"
                name="namaUsaha"
                value={formData.namaUsaha}
                onChange={handleChange}
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Contoh: Kopi Sejati, Toko Maju Jaya"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="contoh@email.com"
                required
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
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
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
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
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
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
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
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="0">Pilih Template</option>
                <option value="1">Savor the Freshness of Autumn</option>
                <option value="2">Discover Amazing Deals on Fresh Goods</option>
                <option value="3">What's Fresh for Your Cart?</option>
                <option value="4">Get Fresh Vegetables at Big Discounts</option>
                <option value="5">Snack Time, Anytime</option>
                <option value="6">Fresh, Healthy, and Ready for You</option>
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
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="0">Pilih paket berlangganan</option>
                <option value="1">Paket Basic, Bulanan</option>
                <option value="2">Pro – UMKM Naik Kelas, Bulanan</option>
                <option value="3">Premium – Full Power, Bulanan</option>
                <option value="4">Paket Basic, Tahunan</option>
                <option value="5">Pro – UMKM Naik Kelas, Tahunan</option>
                <option value="6">Premium – Full Power, Tahunan</option>
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
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Select</option>
                <option value="aktif">Aktif</option>
                <option value="non-aktif">Non-Aktif</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
            <button
              onClick={() => {
                router.back()
              }}
              type="button"
              className="px-6 py-2 text-white bg-gray-400 rounded-md hover:bg-gray-500 w-full md:w-auto"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 w-full md:w-auto"
            >
              Tambah UMKM
            </button>
          </div>
        </form>
      </div>
    </DashboardAdminLayout>
  );
};

export default TambahUMKMForm;