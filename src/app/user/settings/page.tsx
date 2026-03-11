'use client'
import DashboardUserLayout from '@/app/ui/layout/ds-user-layout';
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';
import { userAPI } from '@/lib/api';
import SuccessModal from '@/app/ui/modal/SuccessModal';
import ErrorModal from '@/app/ui/modal/ErrorModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const UserSettingsPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    namaLengkap: '',
    namaUsaha: '',
    email: '',
    noTelpon: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [existingLogo, setExistingLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper untuk tampilkan error modal
  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  // Fetch profil saat mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userAPI.getMe();
        if (res.success) {
          const { name, email, phone, umkm } = res.data;
          setFormData({
            namaLengkap: name || '',
            namaUsaha: umkm?.namaUsaha || '',
            email: email || '',
            noTelpon: phone || '',
          });
          if (umkm?.logo_img) {
            setExistingLogo(`${API_URL}${umkm.logo_img}`);
          }
        }
      } catch (error) {
        console.error('Gagal fetch profil:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) {
      showError('Ukuran file tidak boleh lebih dari 1MB');
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

    if (!formData.namaLengkap || !formData.namaUsaha || !formData.email) {
      showError('Mohon lengkapi Nama Lengkap, Nama Usaha, dan Email');
      return;
    }

    if (passwordBaru && !passwordLama) {
      showError('Password lama wajib diisi untuk mengganti password baru');
      return;
    }

    setSaving(true);
    try {
      const res = await userAPI.updateMe({
        namaLengkap: formData.namaLengkap,
        namaUsaha: formData.namaUsaha,
        email: formData.email,
        noTelpon: formData.noTelpon,
        logo: logoFile ?? undefined,
        passwordLama: passwordLama || undefined,
        passwordBaru: passwordBaru || undefined,
      });

      if (res.success) {
        setShowSuccessModal(true);
        setPasswordLama('');
        setPasswordBaru('');
        if (logoFile && logoPreview) {
          setExistingLogo(logoPreview);
          setLogoFile(null);
          setLogoPreview(null);
        }
      } else {
        showError('Gagal menyimpan perubahan');
      }
    } catch (error: any) {
      console.error('Error update profil:', error);
      showError(error.message || 'Terjadi kesalahan, coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  const currentLogoSrc = logoPreview || existingLogo;

  return (
    <DashboardUserLayout path="user">
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Perubahan berhasil disimpan!"
        message="Profil Anda telah berhasil diperbarui."
        buttonLabel="Tutup"
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="Gagal menyimpan perubahan!"
        message={errorMessage}
        buttonLabel="Tutup"
      />

      <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 md:px-6 lg:px-8 pb-6">

        {/* Header */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center p-4 sm:p-5 bg-white shadow-sm rounded-lg">
          <div className="flex flex-col sm:flex-row items-center sm:mr-4 text-center sm:text-left">
            <div className="text-base sm:text-xl font-semibold text-gray-800">Pengaturan</div>
          </div>
        </div>

        {/* Card Form */}
        <div className="mt-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Pengaturan Profil UMKM</h2>
          <p className="text-sm text-gray-500 mb-6">
            Atur informasi usaha, kontak, dan logo bisnis Anda agar tetap terbaru dan profesional.
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
              Memuat data...
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">

                {/* Nama Lengkap */}
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
                    className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Nama Lengkap..."
                  />
                </div>

                {/* Nama Usaha */}
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
                    className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                    placeholder="Nama Usaha..."
                  />
                </div>

                {/* Email & No Telpon side by side */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex flex-col flex-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="johndoe@gmail.com"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <label htmlFor="noTelpon" className="text-sm font-medium text-gray-700">
                      No Telpon
                    </label>
                    <input
                      type="text"
                      id="noTelpon"
                      name="noTelpon"
                      value={formData.noTelpon}
                      onChange={handleChange}
                      className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                      placeholder="08********"
                    />
                  </div>
                </div>

                {/* Ganti Password */}
                <div className="flex flex-col">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex flex-col flex-1">
                      <label htmlFor="passwordLama" className="text-sm font-medium text-gray-700">
                        Password Lama
                      </label>
                      <input
                        type="password"
                        id="passwordLama"
                        value={passwordLama}
                        onChange={(e) => setPasswordLama(e.target.value)}
                        className="mt-1 px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        placeholder="Password lama"
                      />
                    </div>
                    <div className="flex flex-col flex-1">
                      <label htmlFor="passwordBaru" className="text-sm font-medium text-gray-700">
                        Password Baru
                      </label>
                      <input
                        type="password"
                        id="passwordBaru"
                        value={passwordBaru}
                        onChange={(e) => setPasswordBaru(e.target.value)}
                        className={`mt-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 ${
                          passwordBaru && !passwordLama
                            ? 'border-red-400 bg-red-50'
                            : 'border-gray-200'
                        }`}
                        placeholder="Password baru"
                      />
                      {passwordBaru && !passwordLama && (
                        <p className="text-xs text-red-500 mt-1">
                          Password lama wajib diisi untuk mengganti password
                        </p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Biarkan kosong jika tidak ingin mengganti password.
                  </p>
                </div>

                {/* Logo UMKM Upload */}
                <div className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Logo UMKM
                  </label>
                  <div className="border border-gray-200 rounded-md p-4 flex items-center gap-4">
                    {/* Preview Box */}
                    <div className="w-20 h-20 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
                      {currentLogoSrc ? (
                        <img
                          src={currentLogoSrc}
                          alt="Logo Preview"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-8 h-8 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 18h16.5M3.75 6h16.5A2.25 2.25 0 0122.5 8.25v7.5A2.25 2.25 0 0120.25 18H3.75A2.25 2.25 0 011.5 15.75V8.25A2.25 2.25 0 013.75 6z"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Upload Controls */}
                    <div className="flex flex-col gap-1">
                      <p className="text-sm text-gray-500">Upload logo UMKM (maks 1MB)</p>
                      <div className="flex gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-1.5 text-sm border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition"
                        >
                          Pilih Foto
                        </button>
                        {logoPreview && (
                          <button
                            type="button"
                            onClick={handleRemoveLogo}
                            className="px-4 py-1.5 text-sm border border-red-400 text-red-400 rounded-md hover:bg-red-50 transition"
                          >
                            Hapus
                          </button>
                        )}
                      </div>
                      {logoFile && (
                        <p className="text-xs text-gray-400 mt-1">{logoFile.name}</p>
                      )}
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

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row justify-between mt-6 gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 text-white bg-gray-400 rounded-md hover:bg-gray-500 w-full md:w-auto"
                >
                  Batalkan
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </DashboardUserLayout>
  );
};

export default UserSettingsPage;