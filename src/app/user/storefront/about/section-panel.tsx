"use client";

import React, { useEffect, useState } from "react";
import { useAboutStore } from "@/stores/use-about-store";
import ImageUploadField from "@/app/ui/file-upload/image-upload-field";

const SectionPanel: React.FC = () => {
  const { about, saveAbout } = useAboutStore();
  const [form, setForm] = useState({
    section_title: "",
    section_subtitle: "",
    company_description: "",
    company_image_url: "",
    is_visible: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (about) {
      setForm({
        section_title: about.section_title ?? "",
        section_subtitle: about.section_subtitle ?? "",
        company_description: about.company_description ?? "",
        company_image_url: about.company_image_url ?? "",
        is_visible: about.is_visible ?? true,
      });
    }
  }, [about]);

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
      await saveAbout({
        section_title: form.section_title.trim() || null,
        section_subtitle: form.section_subtitle.trim() || null,
        company_description: form.company_description.trim() || null,
        company_image_url: form.company_image_url.trim() || null,
        is_visible: form.is_visible,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan about");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-800">
            Section &amp; Tentang Kami
          </h3>
          <p className="text-xs text-gray-500">
            Judul section, deskripsi tentang perusahaan, dan gambar pendamping.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={form.is_visible}
            onChange={handleChange("is_visible")}
            className="h-4 w-4 accent-emerald-600"
          />
          Tampilkan section
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Judul Section
          </label>
          <input
            type="text"
            value={form.section_title}
            onChange={handleChange("section_title")}
            placeholder="Tentang Kami"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sub-judul Section
          </label>
          <input
            type="text"
            value={form.section_subtitle}
            onChange={handleChange("section_subtitle")}
            placeholder="Kenali lebih dekat perusahaan kami"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
          />
        </div>
      </div>

      <ImageUploadField
        label="Gambar Company"
        value={form.company_image_url}
        onChange={(url) =>
          setForm((prev) => ({ ...prev, company_image_url: url }))
        }
        hint="Gambar yang tampil di samping deskripsi tentang kami."
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tentang Kamu (Deskripsi Company)
        </label>
        <textarea
          value={form.company_description}
          onChange={handleChange("company_description")}
          rows={6}
          placeholder="Vogue22 adalah perusahaan fashion di Indonesia..."
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
        {saved && <span className="text-sm text-emerald-700">Tersimpan ✓</span>}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400"
        >
          {saving ? "Menyimpan..." : "Simpan Section"}
        </button>
      </div>
    </section>
  );
};

export default SectionPanel;
