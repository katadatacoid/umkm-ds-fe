import useStepRegisterStore from "@/stores/use-register-step";
import React, { useState } from "react";

interface PaymentDetailProps {
  domain: string;
  template: string;
  name: string;
  businessName: string;
  email: string;
  phoneNumber: string;
  total: number;
}

const PaymentDetail: React.FC<PaymentDetailProps> = ({
  domain,
  template,
  name,
  businessName,
  email,
  phoneNumber,
  total,
}) => {
  const { currentStep, incrementStep, decrementStep } = useStepRegisterStore();

  const [voucherCode, setVoucherCode] = useState<string>("");
  const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucherCode(e.target.value);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Detail Pembayaran</h2>

      <p className="text-xs sm:text-sm text-gray-500 mb-5">
        Pastikan semua detail pesanan dan total tagihan sudah sesuai sebelum
        kamu menyelesaikan transaksi.
      </p>

      <div className="space-y-3 sm:space-y-4 rounded-xl border-1 border-gray-200 p-4 sm:p-6">
        {/* Domain Section */}
        <div className="p-3 sm:p-4 border-1 border-gray-200 rounded-md bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm sm:text-base">Domain</span>
            <span className="w-1/2 text-end  text-gray-600 text-xs sm:text-sm">{domain}</span>
          </div>
        </div>

        {/* Template Section */}
        <div className="p-3 sm:p-4 border-1 border-gray-200 rounded-md bg-gray-50">
  <div className="flex justify-between items-center min-w-0">
    <span className="font-medium text-sm sm:text-base">Template</span>
    <span className="w-1/2 text-end  text-gray-600 text-xs sm:text-sm ml-auto">{template}</span> {/* Added truncate */}
  </div>
</div>


        {/* Data Diri Section */}
        <div className="p-3 sm:p-4 border-1 border-gray-200 rounded-md bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="font-medium text-sm sm:text-base">Nama</span>
            <span className="w-1/2 text-end text-gray-600 text-xs sm:text-sm">{name}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-medium text-sm sm:text-base">Nama Usaha</span>
            <span className="w-1/2 text-end text-gray-600 text-xs sm:text-sm">{businessName}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-medium text-sm sm:text-base">Email</span>
            <span className="w-1/2 text-end text-gray-600 text-xs sm:text-sm">{email}</span>
          </div>
          <div className="flex justify-between items-center mt-2">
            <span className="font-medium text-sm sm:text-base">No Telpon</span>
            <span className="w-1/2 text-end text-gray-600 text-xs sm:text-sm">{phoneNumber}</span>
          </div>
        </div>

        {/* Total Pembayaran Section */}
        <div className="flex justify-between items-center font-medium mt-4 sm:mt-5">
          <span className="text-sm sm:text-base">Total Pembayaran</span>
          <span className="w-1/2 text-end text-gray-600 text-xs sm:text-sm">Rp {total.toLocaleString()}</span>
        </div>
      </div>

      {/* Voucher Input Section */}
      <div className="space-y-3 sm:space-y-4 rounded-xl border-1 border-gray-200 p-4 sm:p-6 mt-5">
        <div className="w-full sm:w-3/4">
          <label htmlFor="voucher" className="block text-xs sm:text-sm font-medium text-gray-700">
            Punya Kode Voucher?
          </label>
          <div className="mt-2 text-xs sm:text-sm text-gray-500">
            Masukkan kodenya di sini dan nikmati potongan harga spesial.
          </div>
        </div>
        <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <input
            id="voucher"
            type="text"
            placeholder="Masukkan kodenya di sini"
            value={voucherCode}
            onChange={handleVoucherChange}
            className="w-full px-4 py-2 border-1 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-c text-sm sm:text-base"
          />
          <button
            onClick={() => alert("Voucher applied!")}
            className="mt-4 sm:mt-0 sm:w-auto w-full px-6 py-2 bg-green-c text-white rounded-md hover:bg-green-600 focus:outline-none"
          >
            Terapkan
          </button>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row justify-between sm:justify-end gap-4 mt-5">
        <button
          onClick={decrementStep}
          type="button"
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition duration-300 sm:w-auto w-full"
        >
          Sebelumnya
        </button>
        <button
          onClick={() => {}}
          type="button"
          className="px-6 py-3 bg-green-c text-white rounded-md hover:bg-green-600 transition duration-300 sm:w-auto w-full"
        >
          Bayar
        </button>
      </div>
    </div>
  );
};

export default PaymentDetail;
