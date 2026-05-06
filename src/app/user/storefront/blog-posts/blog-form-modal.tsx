"use client";

import React, { useEffect, useState } from "react";
import { BlogPost, BlogStatus } from "@/lib/api";

interface Props {
  open: boolean;
  initial?: BlogPost | null;
  onClose: () => void;
  onSubmit: (data: {
    slug: string;
    title: string;
    body: string;
    category: string;
    excerpt: string;
    cover_image_url: string;
    read_minutes: number | null;
    status: BlogStatus;
    is_featured: boolean;
  }) => Promise<void>;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BlogFormModal({ open, initial, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [readMinutes, setReadMinutes] = useState<string>("");
  const [status, setStatus] = useState<BlogStatus>("draft");
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || "");
      setSlug(initial?.slug || "");
      setSlugTouched(!!initial?.slug);
      setCategory(initial?.category || "");
      setExcerpt(initial?.excerpt || "");
      setBody(initial?.body || "");
      setCoverImageUrl(initial?.cover_image_url || "");
      setReadMinutes(initial?.read_minutes != null ? String(initial.read_minutes) : "");
      setStatus(initial?.status || "draft");
      setIsFeatured(initial?.is_featured ?? false);
    }
  }, [open, initial]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim() || !slug.trim()) {
      alert("Judul, slug, dan body wajib diisi.");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        slug: slug.trim(),
        category: category.trim(),
        excerpt: excerpt.trim(),
        body,
        cover_image_url: coverImageUrl.trim(),
        read_minutes: readMinutes.trim() ? Number(readMinutes) : null,
        status,
        is_featured: isFeatured,
      });
      onClose();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan blog post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
          <h3 className="text-lg font-semibold text-gray-800">
            {initial ? "Ubah Blog Post" : "Tambah Blog Post"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-xs text-gray-500">(URL artikel)</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugTouched(true);
              }}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimasi Baca (menit)</label>
              <input
                type="number"
                value={readMinutes}
                onChange={(e) => setReadMinutes(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
            <input
              type="text"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Body <span className="text-xs text-gray-500">(Markdown / HTML)</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none font-mono"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BlogStatus)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 mt-6">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="h-4 w-4 accent-emerald-600"
              />
              Featured
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition disabled:bg-gray-400"
            >
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
