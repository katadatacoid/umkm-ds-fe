"use client";

import React, { useState } from "react";
import { useAffiliateStore } from "@/stores/use-affiliate-store";

const WithdrawFormModal = ({ onClose }: { onClose: () => void }) => {
  const { setIsSuccess, toggleWithdrawForm } = useAffiliateStore();

  const [formData, setFormData] = useState({
    amount: "",
    name: "",
    accountNumber: "",
    bank: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Withdraw Data:", formData);

    // Now these will work properly
    toggleWithdrawForm(false);
    setIsSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-white/40 backdrop-blur-[2px] p-3 sm:p-6 pt-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto p-5 sm:p-8 relative border border-gray-200 overflow-y-auto max-h-[85vh] pb-32 sm:pb-16">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 text-center sm:text-left">
          Penarikan Dana Afiliasi
        </h2>
        <p className="text-gray-600 text-sm mb-4 text-center sm:text-left">
          Masukkan detail rekening bank untuk penarikan komisi Anda
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Input jumlah */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jumlah Penarikan</label>
            <input
              type="number"
              required
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              placeholder="Masukkan jumlah"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Nama pemilik */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pemilik Rekening
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Masukkan nama sesuai rekening bank"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Nomor rekening */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Rekening Bank
            </label>
            <input
              type="text"
              required
              value={formData.accountNumber}
              onChange={(e) => handleChange("accountNumber", e.target.value)}
              placeholder="Masukkan nomor rekening bank"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Nama bank */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank</label>
            <select
              required
              value={formData.bank}
              onChange={(e) => handleChange("bank", e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Pilih Bank</option>
              <option value="Bank Central Asia (BCA)">Bank Central Asia (BCA)</option>
              <option value="Bank Mandiri (Mandiri)">Bank Mandiri (Mandiri)</option>
              <option value="Bank Negara Indonesia (BNI)">Bank Negara Indonesia (BNI)</option>
              <option value="Bank Rakyat Indonesia (BRI)">Bank Rakyat Indonesia (BRI)</option>
              <option value="Bank Tabungan Negara (BTN)">Bank Tabungan Negara (BTN)</option>
              <option value="Bank CIMB Niaga (CIMB)">Bank CIMB Niaga (CIMB)</option>
              <option value="Bank Danamon (Danamon)">Bank Danamon (Danamon)</option>
              <option value="Bank Permata (Permata)">Bank Permata (Permata)</option>
              <option value="Bank Mega (Mega)">Bank Mega (Mega)</option>
              <option value="Bank Panin (Panin)">Bank Panin (Panin)</option>
              <option value="Bank BTPN (BTPN)">Bank BTPN (BTPN)</option>
              <option value="Bank Sinarmas (Sinarmas)">Bank Sinarmas (Sinarmas)</option>
              <option value="Bank Maybank Indonesia (Maybank)">
                Bank Maybank Indonesia (Maybank)
              </option>
              <option value="Bank OCBC NISP (OCBC)">Bank OCBC NISP (OCBC)</option>
              <option value="Bank HSBC Indonesia (HSBC)">Bank HSBC Indonesia (HSBC)</option>
            </select>
          </div>

          {/* Info tambahan */}
          <div className="flex items-start gap-2 text-gray-500 text-xs mt-2">
            <div className="flex-shrink-0 w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center text-[10px] font-semibold text-gray-600">
              i
            </div>
            <p>Penarikan akan diproses dalam 1-3 hari kerja. Pastikan data rekening sudah benar.</p>
          </div>

          {/* Tombol */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
            >
              Batalkan
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Ajukan Penarikan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawFormModal;
