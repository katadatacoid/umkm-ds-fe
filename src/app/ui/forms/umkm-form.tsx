'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SuccessModal from '@/app/ui/modal/SuccessModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getAccessToken = () =>
  typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

interface Template {
  id: number;
  nama_template: string;
  deskripsi: string | null;
  kategori: string | null;
}

const TambahUMKMForm = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    namaLengkap: '',
    namaUsaha: '',
    email: '',
    noHandphone: '',
    namaWebsite: '',
    namaDomain: '',
    alamat: '',
    provinsi: '',
    kota: '',
    template: '0',
    status: 'draft',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  const [publicUrl, setPublicUrl] = useState('');
  const [generatingUrl, setGeneratingUrl] = useState(false);
  const [publicToken, setPublicToken] = useState('');

  // Fetch public token on mount
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = getAccessToken();
        const res = await fetch(`${API_URL}/public-form/token-info`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setPublicToken(data.token);
      } catch (err) {
        console.error('Gagal fetch public token:', err);
      }
    };
    fetchToken();
  }, []);

  // Fetch templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoadingTemplates(true);
      try {
        const res = await fetch(`${API_URL}/api/templates`);
        const data = await res.json();
        if (data.success) setTemplates(data.data);
      } catch (err) {
        console.error('Gagal fetch templates:', err);
      } finally {
        setLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleGenerateUrl = async () => {
    setGeneratingUrl(true);
    try {
      const token = getAccessToken();
      const res = await fetch(`${API_URL}/public-form/token-info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setPublicUrl(data.public_url);
    } catch {
      alert('Gagal generate URL');
    } finally {
      setGeneratingUrl(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      alert('Ukuran file tidak boleh lebih dari 1MB');
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.namaUsaha ||
      !formData.email ||
      !formData.noHandphone ||
      !formData.namaWebsite ||
      !formData.namaDomain
    ) {
      alert('Mohon lengkapi Nama Usaha, Email, No Handphone, Nama Website, dan Nama Domain');
      return;
    }

    setSaving(true);

    try {
      const token = getAccessToken();
      if (!token) {
        alert('Sesi habis, silakan login ulang');
        router.push('/');
        return;
      }

      const fullDomain = `${formData.namaWebsite}.${formData.namaDomain}`;

      const fd = new FormData();
      if (formData.namaLengkap) fd.append('user_name', formData.namaLengkap);
      fd.append('name', formData.namaUsaha);
      fd.append('domain_name', fullDomain);
      fd.append('phone', formData.noHandphone);
      fd.append('email', formData.email);
      fd.append('status', formData.status);
      if (formData.alamat) fd.append('address', formData.alamat);
      if (formData.provinsi) fd.append('province', formData.provinsi);
      if (formData.kota) fd.append('city', formData.kota);
      if (formData.template !== '0') fd.append('template_id', formData.template);
      if (logoFile) fd.append('logo', logoFile);

      const response = await fetch(`${API_URL}/umkms`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal membuat UMKM');
      }

      setShowSuccessModal(true);

      setFormData({
        namaLengkap: '',
        namaUsaha: '',
        email: '',
        noHandphone: '',
        namaWebsite: '',
        namaDomain: '',
        alamat: '',
        provinsi: '',
        kota: '',
        template: '0',
        status: 'draft',
      });
      setLogoFile(null);
      setLogoPreview(null);

    } catch (error: any) {
      console.error('Error tambah UMKM:', error);
      alert(error.message || 'Terjadi kesalahan, coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 w-full';

  return (
    <>
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          router.back();
        }}
        title="UMKM berhasil ditambahkan!"
        message="Data UMKM telah berhasil disimpan ke sistem."
        buttonLabel="Tutup"
      />

      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Tambah UMKM Baru</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">

            {/* Nama Lengkap Pemilik */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Nama Lengkap Pemilik</label>
              <input
                type="text"
                name="namaLengkap"
                value={formData.namaLengkap}
                onChange={handleChange}
                className={inputClass}
                placeholder="Masukkan nama pemilik usaha"
              />
            </div>

            {/* Nama Usaha */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Nama Usaha *</label>
              <input
                type="text"
                name="namaUsaha"
                value={formData.namaUsaha}
                onChange={handleChange}
                className={inputClass}
                placeholder="Contoh: Kopi Sejati, Toko Maju Jaya"
              />
            </div>

            {/* Nama Website + Domain */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700">Nama Website *</label>
                <input
                  type="text"
                  name="namaWebsite"
                  value={formData.namaWebsite}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Contoh: kopisejati"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700">Nama Domain *</label>
                <select
                  name="namaDomain"
                  value={formData.namaDomain}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Pilih domain</option>
                  <option value="biz.id">biz.id</option>
                </select>
              </div>
            </div>
            {formData.namaWebsite && formData.namaDomain && (
              <p className="text-xs text-green-600 -mt-2">
                Domain: <strong>{formData.namaWebsite}.{formData.namaDomain}</strong>
              </p>
            )}

            {/* Email & No HP */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="contoh@email.com"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700">No Handphone *</label>
                <input
                  type="text"
                  name="noHandphone"
                  value={formData.noHandphone}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="081234567890"
                />
              </div>
            </div>

            {/* Alamat */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Alamat</label>
              <input
                type="text"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                className={inputClass}
                placeholder="JL. Kenangan 1"
              />
            </div>

            {/* Provinsi & Kota */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700">Provinsi</label>
                <input
                  type="text"
                  name="provinsi"
                  value={formData.provinsi}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Contoh: Jawa Barat"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700">Kota</label>
                <input
                  type="text"
                  name="kota"
                  value={formData.kota}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Contoh: Depok"
                />
              </div>
            </div>

            {/* Template */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Template</label>
              <select
                name="template"
                value={formData.template}
                onChange={handleChange}
                disabled={loadingTemplates}
                className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-400`}
              >
                <option value="0" disabled>
                  {loadingTemplates ? 'Memuat template...' : 'Pilih Template'}
                </option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nama_template}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`${inputClass} bg-white`}
              >
                <option value="draft">Non-aktif</option>
                <option value="active">Aktif</option>
              </select>
            </div>

            {/* Logo Upload */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Logo UMKM</label>
              <div className="border border-gray-200 rounded-md p-4 flex items-center gap-4">
                <div className="w-20 h-20 border rounded-md flex items-center justify-center bg-gray-50 overflow-hidden flex-shrink-0">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Preview" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-gray-300 text-xs text-center">No Image</span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-gray-500">Upload logo UMKM (maks 1MB)</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-1.5 text-sm border border-green-600 text-green-600 rounded-md hover:bg-green-50"
                    >
                      Pilih Foto
                    </button>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={handleRemoveLogo}
                        className="px-4 py-1.5 text-sm border border-red-400 text-red-400 rounded-md hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                  {logoFile && <p className="text-xs text-gray-400">{logoFile.name}</p>}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 text-white bg-gray-400 rounded-md hover:bg-gray-500 w-full md:w-auto"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 w-full md:w-auto disabled:opacity-60"
            >
              {saving ? 'Menyimpan...' : 'Tambah UMKM'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TambahUMKMForm;