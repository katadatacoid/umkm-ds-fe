"use client";
import React from "react";
import clsx from "clsx";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonLabel?: string;
  themeColor?: string; // default: green
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  buttonLabel = "Tutup",
  themeColor = "#27ae60",
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const bgColorClass = clsx({
    "bg-green-100": themeColor === "#27ae60" || themeColor === "green",
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-[2px] p-3 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-auto p-6 sm:p-8 text-center border border-gray-200">
        {/* Icon */}
        <div
          className={clsx(
            "w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full",
            bgColorClass
          )}
          style={{ backgroundColor: `${themeColor}20` }} // slight tint of color
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke={themeColor}
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Text Content */}
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-6">{message}</p>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full sm:w-auto px-5 py-2 rounded-lg text-white transition"
          style={{ backgroundColor: themeColor }}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;