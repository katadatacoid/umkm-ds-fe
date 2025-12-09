'use client'
import DashboardAdminLayout from '@/app/ui/layout/ds-admin-layout';
import { useRouter, useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { umkmAPI, authAPI } from '@/lib/api';

export default function EditUMKMForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '', // Nama lengkap dari tabel users
    businessName: '', // Nama usaha dari tabel user_products
    email: '',
    phoneNumber: '',
    websiteName: '',
    domainName: '',
    template: 0,
    packageSubscription: '',
    packagePrice: 0,
    status: '',
  });

  // Fetch data UMKM berdasarkan ID dengan subscription dan user data
  useEffect(() => {
    const fetchUMKMData = async () => {
      try {
        setLoading(true);
        
        // Gunakan getByIdWithSubscription untuk mendapatkan data subscription dan user
        const response = await umkmAPI.getByIdWithSubscription(parseInt(id));
        
        console.log('Data dari API getByIdWithSubscription:', response);
        
        if (response.success && response.data) {
          const umkmData = response.data;
          
          // Parse domain untuk mendapatkan nama website
          let websiteName = '';
          if (umkmData.domain_name) {
            websiteName = umkmData.domain_name.split('.')[0] || '';
          }

          // Ambil nama lengkap dari data user
          let fullName = umkmData.name || ''; // Default dari nama usaha
          if (umkmData.user && umkmData.user.name) {
            fullName = umkmData.user.name; // Nama dari tabel users
          }

          // Ambil paket langganan dari subscription
          let packageName = '';
          let packagePrice = 0;
          
          if (umkmData.subscription?.transaction?.product_subscription) {
            const productSub = umkmData.subscription.transaction.product_subscription;
            packageName = `${productSub.name} (${productSub.duration})`;
            packagePrice = umkmData.subscription.transaction.total_price || 0;
          }

          let displayStatus = 'non-aktif'; // Default
        
          console.log('Status dari database:', umkmData.status); // Debug
          
          if (umkmData.status) {
            const statusLower = umkmData.status.toLowerCase();
            // Map semua varian "aktif" ke 'aktif'
            if (['active', 'published', 'aktif'].includes(statusLower)) {
              displayStatus = 'aktif';
            } else if (['draft', 'inactive', 'non-aktif'].includes(statusLower)) {
              displayStatus = 'non-aktif';
            }
          }
          
          setFormData({
            fullName: fullName, // Nama lengkap dari tabel users
            businessName: umkmData.name || '', // Nama usaha dari tabel user_products
            email: umkmData.user?.email || umkmData.email || '',
            phoneNumber: umkmData.user?.phone || umkmData.phone || '',
            websiteName: websiteName,
            domainName: umkmData.domain_name || '',
            template: Number(umkmData.template_id) || 0,
            packageSubscription: packageName,
            packagePrice: packagePrice,
            status: displayStatus,
          });
        } else {
          alert('Data UMKM tidak ditemukan');
          router.back();
        }
      } catch (error: any) {
        console.error('Error fetching UMKM data:', error);
        alert(`Gagal mengambil data UMKM: ${error.message}`);
        
        if (error.message.includes('Unauthorized')) {
          await authAPI.logout();
          window.location.href = '/';
        } else {
          router.back();
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUMKMData();
    }
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'template') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0,
      });
    } else if (name === 'websiteName') {
      // Jika nama website berubah, nama domain ikut berubah
      setFormData({
        ...formData,
        websiteName: value,
        domainName: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi
    if (!formData.fullName || !formData.businessName || !formData.email || !formData.phoneNumber) {
      alert('Mohon lengkapi Nama Lengkap, Nama Usaha, Email, dan No Handphone');
      return;
    }

    try {
      console.log('=== UPDATE FORM SUBMITTED ===');
      console.log('ID UMKM:', id);
      console.log('Data yang akan diupdate:', formData);
      
      // Siapkan data untuk backend sesuai struktur database
      const updateData = {
        // Data untuk tabel user_products
        name: formData.businessName, // Nama usaha
        email: formData.email,
        phone: formData.phoneNumber,
        domain_name: formData.domainName,
        template_id: formData.template,
        status: formData.status === 'aktif' ? 'active' : 'draft',
        
        // Data untuk tabel users (nama lengkap)
        user_name: formData.fullName, // Backend akan handle update ke tabel users
      };
      
      console.log('Data yang dikirim ke API:', updateData);
      
      // Panggil API dengan format baru (id, data)
      const response = await umkmAPI.update(parseInt(id), updateData);
      
      console.log('Response update:', response);
      
      if (response.success) {
        alert('Data UMKM berhasil diupdate!');
        router.back();
      } else {
        alert('Gagal mengupdate data');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      alert(`Gagal mengupdate data: ${error.message}`);
      
      if (error.message.includes('Unauthorized')) {
        await authAPI.logout();
        window.location.href = '/';
      }
    }
  };

  if (loading) {
    return (
      <DashboardAdminLayout path="xxx">
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Loading data...</div>
          </div>
        </div>
      </DashboardAdminLayout>
    );
  }

  return (
    <DashboardAdminLayout path="xxx">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit UMKM - ID #{id}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Nama Lengkap - dari tabel users */}
            <div className="flex flex-col">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Masukkan nama pemilik usaha"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Nama lengkap pemilik/pengelola usaha
              </p>
            </div>

            {/* Nama Usaha - dari tabel user_products */}
            <div className="flex flex-col">
              <label htmlFor="businessName" className="text-sm font-medium text-gray-700">
                Nama Usaha <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Contoh: Kopi Sejati, Toko Maju Jaya"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                Nama brand atau usaha yang akan ditampilkan di website
              </p>
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
              <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                No Handphone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Masukkan nomor aktif (contoh: 081234567890)"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="websiteName" className="text-sm font-medium text-gray-700">
                Nama Website
              </label>
              <input
                type="text"
                id="websiteName"
                name="websiteName"
                value={formData.websiteName}
                onChange={handleChange}
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Contoh: kopisejati"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="domainName" className="text-sm font-medium text-gray-700">
                Nama Domain
              </label>
              <input
                type="text"
                id="domainName"
                name="domainName"
                value={formData.domainName}
                readOnly
                disabled
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                placeholder="Otomatis mengikuti Nama Website"
              />
              <p className="mt-1 text-xs text-gray-500">
                Nama domain otomatis sama dengan nama website
              </p>
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
                <option value="0" disabled>Pilih Template</option>
                <option value="1">Savor the Freshness of Autumn</option>
                <option value="2">Discover Amazing Deals on Fresh Goods</option>
                <option value="3">What's Fresh for Your Cart?</option>
                <option value="4">Get Fresh Vegetables at Big Discounts</option>
                <option value="5">Snack Time, Anytime</option>
                <option value="6">Fresh, Healthy, and Ready for You</option>
              </select>
            </div>

            {/* Paket Langganan - Read Only (dari subscription) */}
            <div className="flex flex-col">
              <label htmlFor="packageSubscription" className="text-sm font-medium text-gray-700">
                Paket Langganan
              </label>
              <input
                type="text"
                id="packageSubscription"
                name="packageSubscription"
                value={formData.packageSubscription || 'Belum berlangganan'}
                readOnly
                disabled
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                Paket langganan tidak dapat diubah dari halaman ini
              </p>
            </div>

            {/* Harga Paket - Read Only */}
            <div className="flex flex-col">
              <label htmlFor="packagePrice" className="text-sm font-medium text-gray-700">
                Harga Paket
              </label>
              <input
                type="text"
                id="packagePrice"
                name="packagePrice"
                value={formData.packagePrice > 0 ? `Rp ${formData.packagePrice.toLocaleString('id-ID')}` : '-'}
                readOnly
                disabled
                className="mt-1 px-4 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                Harga sesuai transaksi subscription
              </p>
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
                <option value="" disabled>Select</option>
                <option value="aktif">Aktif</option>
                <option value="non-aktif">Non-Aktif</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
            <button
              onClick={() => router.back()}
              type="button"
              className="px-6 py-2 text-white bg-gray-400 rounded-md hover:bg-gray-500 w-full md:w-auto"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 w-full md:w-auto"
            >
              Update UMKM
            </button>
          </div>
        </form>
      </div>
    </DashboardAdminLayout>
  );
}