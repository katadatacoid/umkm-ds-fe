"use client";

import React, { useEffect, useState } from "react";
import type {
  LandingSectionImage,
  LandingSectionInput,
  LandingSectionV2,
} from "@/lib/api";
import {
  TextField,
  TextAreaField,
  inputCls,
  labelCls,
  cardCls,
} from "../forms/shared";
import ImageUploadField from "@/app/ui/file-upload/image-upload-field";

type FieldSet = {
  judul: boolean;
  tagline: boolean;
  deskripsi: boolean;
  image_url: boolean;
  background_url: boolean;
  images: boolean;
};

const FIELDS_BY_KIND: Record<string, FieldSet> = {
  hero: {
    judul: true, tagline: true, deskripsi: true,
    image_url: true, background_url: false, images: false,
  },
  cta: {
    judul: true, tagline: false, deskripsi: true,
    image_url: false, background_url: true, images: false,
  },
  cta_product: {
    judul: true, tagline: false, deskripsi: true,
    image_url: true, background_url: true, images: false,
  },
  cta_filosofi: {
    judul: true, tagline: true, deskripsi: true,
    image_url: false, background_url: false, images: true,
  },
  key_unggulan_item: {
    judul: true, tagline: true, deskripsi: true,
    image_url: false, background_url: false, images: true,
  },
};

const KIND_LABELS: Record<string, string> = {
  hero: "Hero",
  cta: "CTA",
  cta_product: "CTA Produk",
  cta_filosofi: "CTA Filosofi",
  key_unggulan_item: "Key Unggulan",
};

interface Props {
  kind: string;
  section: LandingSectionV2;
  onSave: (body: LandingSectionInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function SectionEditorV2({ kind, section, onSave, onDelete }: Props) {
  const fields = FIELDS_BY_KIND[kind] ?? FIELDS_BY_KIND.hero;

  const [judul, setJudul] = useState(section.judul ?? "");
  const [tagline, setTagline] = useState(section.tagline ?? "");
  const [deskripsi, setDeskripsi] = useState(section.deskripsi ?? "");
  const [imageUrl, setImageUrl] = useState(section.image_url ?? "");
  const [backgroundUrl, setBackgroundUrl] = useState(section.background_url ?? "");
  const [images, setImages] = useState<LandingSectionImage[]>(section.images ?? []);
  const [isVisible, setIsVisible] = useState(section.is_visible);
  const [sortOrder, setSortOrder] = useState(section.sort_order);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setJudul(section.judul ?? "");
    setTagline(section.tagline ?? "");
    setDeskripsi(section.deskripsi ?? "");
    setImageUrl(section.image_url ?? "");
    setBackgroundUrl(section.background_url ?? "");
    setImages(section.images ?? []);
    setIsVisible(section.is_visible);
    setSortOrder(section.sort_order);
    setSaved(false);
  }, [section.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const body: LandingSectionInput = {
        judul: fields.judul ? judul || null : undefined,
        tagline: fields.tagline ? tagline || null : undefined,
        deskripsi: fields.deskripsi ? deskripsi || null : undefined,
        image_url: fields.image_url ? imageUrl || null : undefined,
        background_url: fields.background_url ? backgroundUrl || null : undefined,
        is_visible: isVisible,
        sort_order: Number(sortOrder) || 0,
      };
      if (fields.images) {
        body.images = images.map((img, idx) => ({
          image_url: img.image_url,
          alt_text: img.alt_text,
          sort_order: idx,
        }));
      }
      await onSave(body);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    if (!confirm("Hapus item ini?")) return;
    setDeleting(true);
    try {
      await onDelete();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  };

  const addImage = () =>
    setImages((arr) => [
      ...arr,
      { id: `tmp-${Date.now()}`, image_url: "", alt_text: null, sort_order: arr.length },
    ]);

  const updateImage = (idx: number, patch: Partial<LandingSectionImage>) =>
    setImages((arr) => arr.map((x, i) => (i === idx ? { ...x, ...patch } : x)));

  const removeImage = (idx: number) =>
    setImages((arr) => arr.filter((_, i) => i !== idx));

  const moveImage = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    const copy = [...images];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    setImages(copy);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-800">
            <span className="font-mono text-emerald-700">{KIND_LABELS[kind] ?? kind}</span>
          </h3>
          <p className="text-xs text-gray-500">ID: {section.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isVisible}
              onChange={(e) => setIsVisible(e.target.checked)}
              className="h-4 w-4 accent-emerald-600"
            />
            Tampilkan
          </label>
          <label className="text-sm text-gray-700 flex items-center gap-2">
            Urutan
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
              className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring focus:ring-green-200 outline-none"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {fields.judul && (
          <TextField label="Judul" value={judul} onChange={setJudul} />
        )}
        {fields.tagline && (
          <TextField label="Tagline" value={tagline} onChange={setTagline} />
        )}
      </div>

      {fields.deskripsi && (
        <TextAreaField label="Deskripsi" value={deskripsi} onChange={setDeskripsi} rows={4} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.image_url && (
          <ImageUploadField
            label="Image"
            value={imageUrl}
            onChange={setImageUrl}
          />
        )}
        {fields.background_url && (
          <ImageUploadField
            label="Background"
            value={backgroundUrl}
            onChange={setBackgroundUrl}
          />
        )}
      </div>

      {fields.images && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Gambar ({images.length})
            </label>
            <button
              type="button"
              onClick={addImage}
              className="text-xs px-3 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
            >
              + Tambah Gambar
            </button>
          </div>
          {images.length === 0 && (
            <p className="text-xs text-gray-400 italic">Belum ada gambar.</p>
          )}
          <div className="space-y-3">
            {images.map((img, i) => (
              <div key={img.id} className={cardCls}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500">#{i + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(i, -1)}
                      disabled={i === 0}
                      className="text-xs px-2 py-1 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(i, 1)}
                      disabled={i === images.length - 1}
                      className="text-xs px-2 py-1 rounded text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="text-xs px-2 py-1 rounded text-red-600 hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
                <ImageUploadField
                  label="Gambar"
                  value={img.image_url}
                  onChange={(url) => updateImage(i, { image_url: url })}
                />
                <div>
                  <label className={labelCls}>Alt Text</label>
                  <input
                    type="text"
                    value={img.alt_text ?? ""}
                    onChange={(e) =>
                      updateImage(i, { alt_text: e.target.value || null })
                    }
                    className={inputCls}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
        {saved && <span className="text-sm text-emerald-700">Tersimpan ✓</span>}
        {onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || saving}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition disabled:bg-gray-400"
          >
            {deleting ? "Menghapus..." : "Hapus"}
          </button>
        )}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400"
        >
          {saving ? "Menyimpan..." : "Simpan Section"}
        </button>
      </div>
    </div>
  );
}
