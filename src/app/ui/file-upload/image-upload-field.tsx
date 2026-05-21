"use client";

import React, { useRef, useState } from "react";
import { mediaAPI } from "@/lib/api";

interface Props {
  label: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
const MAX_BYTES = 5 * 1024 * 1024;

export default function ImageUploadField({ label, value, onChange, hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError(null);

    if (!ACCEPT.split(",").includes(file.type)) {
      setError("Format file harus jpeg/png/webp/gif");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    setUploading(true);
    try {
      const result = await mediaAPI.upload(file);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah");
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    onChange("");
    setError(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>

      <div className="flex items-start gap-3">
        {value ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Preview"
              className="w-32 h-32 object-cover border border-gray-300 rounded-md bg-gray-50"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <button
              type="button"
              onClick={handleClear}
              title="Hapus gambar"
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs leading-none flex items-center justify-center hover:bg-red-700"
            >
              ×
            </button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-xs text-gray-400 cursor-pointer hover:border-emerald-500 hover:text-emerald-600"
          >
            {uploading ? "Mengunggah..." : "Klik untuk pilih"}
          </div>
        )}

        <div className="flex-1 space-y-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-3 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400"
          >
            {uploading ? "Mengunggah..." : value ? "Ganti gambar" : "Pilih gambar"}
          </button>
          <p className="text-xs text-gray-500">
            {hint || "JPG/PNG/WEBP/GIF, maks 5MB."}
          </p>
          {value && (
            <p className="text-[11px] text-gray-400 break-all">{value}</p>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleSelect}
        className="hidden"
      />
    </div>
  );
}
