"use client";

import React, { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import BlogForm from "../../blog-form";
import { useBlogPostsStore } from "@/stores/use-blog-posts-store";

export default function EditBlogPostPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const { items, loading, error, fetchAll, update } = useBlogPostsStore();

  useEffect(() => {
    if (items.length === 0) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initial = useMemo(() => items.find((x) => x.id === id) ?? null, [items, id]);

  return (
    <DashboardUserLayout path="user">
      <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 md:px-6 lg:px-8 pb-6">
        <nav className="text-sm text-gray-500">
          <Link href="/user/storefront/blog-posts" className="hover:text-emerald-600">
            Blog Post
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">Ubah Artikel</span>
        </nav>

        {!initial && loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-sm text-gray-500">
            Memuat...
          </div>
        )}

        {!initial && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center text-sm text-gray-500">
            {error || "Artikel tidak ditemukan."}
          </div>
        )}

        {initial && (
          <BlogForm
            mode="edit"
            initial={initial}
            onSubmit={async (data) => {
              await update(initial.id, {
                ...data,
                category: data.category || null,
                excerpt: data.excerpt || null,
                cover_image_url: data.cover_image_url || null,
              });
            }}
          />
        )}
      </div>
    </DashboardUserLayout>
  );
}
