import React, { useState } from "react";
import BaseCard from "./base-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";

interface ReferralCardProps {
  title?: string;
  subtitle?: string;
  referralCode?: string;
  totalReferrals?: number;
  onCopyLink?: () => void;
  buttonText?: string;
}

const ReferralCard: React.FC<ReferralCardProps> = ({
  title = "Kode Referral Anda",
  subtitle = "Bagikan kode ini untuk mendapatkan komisi dari setiap pendaftaran",
  referralCode = "RUMAH2025-USER123",
  totalReferrals = 0,
  onCopyLink,
  buttonText = "Copy Link Url",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <BaseCard title={title} subtitle={subtitle}>
      <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between mb-4">
        <span className="text-gray-900 font-mono font-semibold">{referralCode}</span>
        <button
          onClick={handleCopyCode}
          className="text-green-600 hover:text-green-700 transition-colors"
          aria-label="Copy referral code"
        >
          <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="w-5 h-5" />
        </button>
      </div>

      <button
        onClick={onCopyLink}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
      >
        {buttonText}
      </button>

      <p className="text-gray-600 text-sm mt-4">Total referral berhasil: {totalReferrals}</p>
    </BaseCard>
  );
};

export default ReferralCard;
