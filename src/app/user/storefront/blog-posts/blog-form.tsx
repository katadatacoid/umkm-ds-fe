"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BlogPost, BlogStatus } from "@/lib/api";
import ImageUploadField from "@/app/ui/file-upload/image-upload-field";

export type BlogFormPayload = {
  slug: string;
  title: string;
  body: string;
  category: string;
  excerpt: string;
  cover_image_url: string;
  read_minutes: number | null;
  status: BlogStatus;
};

interface Props {
  mode: "create" | "edit";
  initial?: BlogPost | null;
  onSubmit: (data: BlogFormPayload) => Promise<void>;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function BlogForm({ mode, initial, onSubmit }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [category, setCategory] = useState(initial?.category || "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "");
  const [body, setBody] = useState(initial?.body || "");
  const [coverImageUrl, setCoverImageUrl] = useState(initial?.cover_image_url || "");
  const [readMinutes, setReadMinutes] = useState<string>(
    initial?.read_minutes != null ? String(initial.read_minutes) : ""
  );
  const [status, setStatus] = useState<BlogStatus>(initial?.status || "draft");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

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
      });
      router.push("/user/storefront/blog-posts");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan blog post");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4"
    >
      <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-100">
        {mode === "edit" ? "Ubah Blog Post" : "Tambah Blog Post"}
      </h3>

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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimasi Baca (menit)
          </label>
          <input
            type="number"
            value={readMinutes}
            onChange={(e) => setReadMinutes(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
          />
        </div>
      </div>

      <ImageUploadField
        label="Cover Image"
        value={coverImageUrl}
        onChange={setCoverImageUrl}
      />

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
          rows={12}
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
      </div>

      <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={() => router.push("/user/storefront/blog-posts")}
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
  );
}
