import React from "react";
import BaseCard from "./base-card";

interface WithdrawCardProps {
  title?: string;
  subtitle?: string;
  balance?: number;
  minWithdraw?: number;
  processDays?: string;
  onWithdraw?: () => void;
  buttonText?: string;
}

const WithdrawCard: React.FC<WithdrawCardProps> = ({
  title = "Withdraw Komisi",
  subtitle = "Saldo Tersedia:",
  balance = 0,
  minWithdraw = 100000,
  processDays = "1-3",
  onWithdraw,
  buttonText = "Tarik Dana",
}) => {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const canWithdraw = balance >= minWithdraw;

  return (
    <BaseCard title={title} subtitle={subtitle}>
      <div className="text-2xl font-bold text-gray-900 mb-6">{formatCurrency(balance)}</div>

      <button
        onClick={onWithdraw}
        disabled={!canWithdraw}
        className={`w-full font-medium py-3 rounded-lg transition-colors ${
          canWithdraw
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        {buttonText}
      </button>

      <p className="text-gray-600 text-xs mt-4">
        Minimum withdraw {formatCurrency(minWithdraw)}. Proses {processDays} hari kerja.
      </p>
    </BaseCard>
  );
};

export default WithdrawCard;
