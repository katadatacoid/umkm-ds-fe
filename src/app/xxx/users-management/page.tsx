'use client'

import React from "react";
import DashboardAdminLayout from "@/app/ui/layout/ds-admin-layout"; // Import DashboardLayout
import StatsSection from "@/app/ui/section/seaction-stat";
import HeadSummary from "@/app/ui/headers/header-summary";
import DemoTableUsers from "./table-users";
import { usePathname, useRouter } from 'next/navigation';

const ManagementUsersAdmin: React.FC = () => {

  const router = useRouter();  // Call useRouter at the top level
  const pathname = usePathname(); // Hook to access the current path

  const statsData = [
    {
      title: "Total UMKM Aktif",
      value: 956,
      percentage: 15,
      description: "Jumlah UMKM yang aktif menggunakan platform ini.",
    },
    {
      title: "Total Umkm Tidak Aktif",
      value: "150",
      percentage: -2,
      description: "UMKM yang mendaftar tapi belum aktif.",
    },
  ];

  const handleAddClick = () => {
    console.log("Tambah data clicked");
    router.push(`${pathname}/add`);
  };


  return (
    <DashboardAdminLayout
      path="xxx"
    >
      <HeadSummary
        title="Overview"
        updatedAt="Baru saja"
        mode="button"
        buttonLabel="Tambah UMKM Baru"
        onButtonClick={handleAddClick}
      />
      {/* Custom content for this page */}
      <StatsSection
        // title="Ringkasan Aktivitas"
        stats={statsData}
        className="mt-5"
      />
      <DemoTableUsers/>
    </DashboardAdminLayout>
  );
};

export default ManagementUsersAdmin;
