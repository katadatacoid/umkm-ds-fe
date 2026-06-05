"use client";

import React, { useEffect } from "react";

interface DeleteProductModalProps {
  isOpen: boolean;
  productName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  isOpen,
  productName,
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
      aria-labelledby="delete-modal-title"
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-6 h-6 text-red-500"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2
            id="delete-modal-title"
            className="text-[17px] font-semibold text-gray-800 mb-1.5"
          >
            Hapus produk ini?
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Produk{" "}
            <span className="font-semibold text-gray-700">
              &ldquo;{productName}&rdquo;
            </span>{" "}
            akan dihapus secara permanen dan tidak dapat dikembalikan.
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
                Menghapus...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="w-3.5 h-3.5 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                    clipRule="evenodd"
                  />
                </svg>
                Ya, Hapus
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductModal;