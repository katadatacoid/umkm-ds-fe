"use client";

import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

interface LogoutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  // ─── Tutup modal dengan Escape ────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, isLoading, onCancel]);

  // ─── Kunci scroll body saat modal terbuka ─────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      {/* ── Backdrop ── */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={!isLoading ? onCancel : undefined}
        aria-hidden="true"
      />

      {/* ── Modal card ── */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Accent bar atas */}
        <div className="h-[3px] w-full bg-red-500" />

        {/* Body */}
        <div className="px-6 pt-7 pb-5 flex flex-col items-center text-center">
          {/* Icon ring */}
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 ring-4 ring-red-100">
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="text-red-500 text-[18px]"
            />
          </div>

          <h2
            id="logout-modal-title"
            className="text-[17px] font-semibold text-gray-800 mb-1.5"
          >
            Keluar dari akun?
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Anda akan keluar dari sesi ini. Pastikan semua perubahan
            telah disimpan sebelum melanjutkan.
          </p>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-gray-100" />

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="
              flex-1 rounded-xl border border-gray-200 px-4 py-2.5
              text-sm font-medium text-gray-600
              hover:bg-gray-50 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            Batal
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="
              flex-1 flex items-center justify-center gap-2
              rounded-xl bg-red-500 px-4 py-2.5
              text-sm font-medium text-white
              hover:bg-red-600 active:bg-red-700 transition-colors
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {isLoading ? (
              <>
                {/* Spinner */}
                <svg
                  className="animate-spin h-4 w-4 text-white shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-25"
                    cx="12" cy="12" r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Keluar...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faRightFromBracket} className="text-xs" />
                Ya, Keluar
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;