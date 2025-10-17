"use client";

import React from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import StatsSection from "@/app/ui/section/seaction-stat";
import HeadSummary from "@/app/ui/headers/header-summary";
import DemoTableUsers from "./table-products";
import { usePathname, useRouter } from "next/navigation";

const ManagementProductsUser: React.FC = () => {
  const router = useRouter(); // Call useRouter at the top level
  const pathname = usePathname(); // Hook to access the current path

  const statsData = [
    {
      title: "Total Produk",
      value: 50,
      // percentage: 15,
      description: "Jumlah keseluruhan produk yang telah ditambahkan.",
    },
    {
      title: "Produk Aktif",
      value: 40,
      // percentage: -2,
      description: "Produk yang saat ini aktif.",
    },
    {
      title: "Produk Non-Aktif",
      value: 10,
      // percentage: -2,
      description: "Produk yang tidak aktif.",
    },
  ];

  const handleAddClick = () => {
    console.log("Tambah data clicked");
    router.push(`${pathname}/add`);
  };

  return (
    <DashboardUserLayout path="user">
      <HeadSummary
        title="Produk"
        updatedAt="3 minutes ago"
        mode="button"
        buttonLabel="Tambah Produk Baru"
        onButtonClick={handleAddClick}
      />
      {/* Custom content for this page */}
      <StatsSection
        // title="Ringkasan Aktivitas"
        stats={statsData}
        className="mt-5"
      />
      {/* <DemoTableUsers /> */}
    </DashboardUserLayout>
  );
};

export default ManagementProductsUser;
