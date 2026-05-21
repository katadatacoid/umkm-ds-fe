"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import StatsSection from "@/app/ui/section/seaction-stat";
import HeadSummary from "@/app/ui/headers/header-summary";
import TableBlogPosts from "./table-blog-posts";
import { useBlogPostsStore } from "@/stores/use-blog-posts-store";
import { BlogPost, BlogStatus } from "@/lib/api";

const BlogPostsPage: React.FC = () => {
  const router = useRouter();
  const { statsData, fetchAll } = useBlogPostsStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<BlogStatus | "all">("all");

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const applyFilters = () => {
    fetchAll({
      search: searchTerm.trim() || undefined,
      status: statusFilter,
    });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    fetchAll();
  };

  const handleAdd = () => {
    router.push("/user/storefront/blog-posts/new");
  };

  const handleEdit = (row: BlogPost) => {
    router.push(`/user/storefront/blog-posts/${row.id}/edit`);
  };

  return (
    <DashboardUserLayout path="user">
      <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 md:px-6 lg:px-8 pb-6">
        <HeadSummary
          title="Blog Post"
          updatedAt="Baru saja"
          mode="button"
          buttonLabel="Tambah Artikel"
          onButtonClick={handleAdd}
        />

        <div className="mt-1">
          <StatsSection stats={statsData} />
        </div>

        <div className="mt-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex flex-wrap items-center gap-3 px-4 pt-4">
            <input
              type="text"
              placeholder="Cari judul / kategori..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyFilters();
              }}
              className="border border-gray-300 rounded-md px-3 py-2 w-64 text-sm focus:ring focus:ring-green-200 outline-none"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BlogStatus | "all")}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring focus:ring-green-200 outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-md hover:bg-emerald-700 transition"
            >
              Terapkan
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </div>

          <TableBlogPosts onEdit={handleEdit} />
        </div>
      </div>
    </DashboardUserLayout>
  );
};

export default BlogPostsPage;
