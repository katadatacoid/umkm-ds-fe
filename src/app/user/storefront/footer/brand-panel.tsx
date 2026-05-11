"use client";

import React, { useEffect, useState } from "react";
import { useFooterStore } from "@/stores/use-footer-store";

const BrandPanel: React.FC = () => {
  const { brand, saveBrand } = useFooterStore();
  const [form, setForm] = useState({
    brand_name: "",
    brand_description: "",
    brand_tagline: "",
    brand_logo_url: "",
    copyright_suffix: "",
    is_visible: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (brand) {
      setForm({
        brand_name: brand.brand_name ?? "",
        brand_description: brand.brand_description ?? "",
        brand_tagline: brand.brand_tagline ?? "",
        brand_logo_url: brand.brand_logo_url ?? "",
        copyright_suffix: brand.copyright_suffix ?? "",
        is_visible: brand.is_visible ?? true,
      });
    }
  }, [brand]);

  const handleChange =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value =
        e.target instanceof HTMLInputElement && e.target.type === "checkbox"
          ? e.target.checked
          : e.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveBrand(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan footer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-800">Brand Footer</h3>
          <p className="text-xs text-gray-500">
            Informasi brand yang tampil di bagian bawah landing page.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.is_visible}
            onChange={handleChange("is_visible")}
            className="h-4 w-4 accent-emerald-600"
          />
          Tampilkan footer
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Brand
          </label>
          <input
            type="text"
            value={form.brand_name}
            onChange={handleChange("brand_name")}
            placeholder="Vogue22"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL Logo
          </label>
          <input
            type="text"
            value={form.brand_logo_url}
            onChange={handleChange("brand_logo_url")}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Deskripsi Brand
          </label>
          <textarea
            value={form.brand_description}
            onChange={handleChange("brand_description")}
            rows={3}
            placeholder="Deskripsi singkat perusahaan"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tagline
          </label>
          <textarea
            value={form.brand_tagline}
            onChange={handleChange("brand_tagline")}
            rows={2}
            placeholder="Motto atau tagline brand"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Copyright Suffix
          </label>
          <input
            type="text"
            value={form.copyright_suffix}
            onChange={handleChange("copyright_suffix")}
            placeholder="Powered by Katadata"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
        {saved && <span className="text-sm text-emerald-700">Tersimpan ✓</span>}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400"
        >
          {saving ? "Menyimpan..." : "Simpan Brand"}
        </button>
      </div>
    </section>
  );
};

export default BrandPanel;
