'use client'

import React, { useState } from "react";
import DashboardAdminLayout from "@/app/ui/layout/ds-admin-layout";
import HeadSummary from "@/app/ui/headers/header-summary";

import StatsSection from "@/app/ui/section/seaction-stat";
import DemoTableRecentUMKm from "./table-recent-umk";




const MainDsAdmin: React.FC = () => {
  const statsData = [
    {
      title: "Total UMKM Aktif",
      value: 956,
      percentage: 15,
      description: "Jumlah UMKM yang aktif menggunakan platform ini.",
    },
    {
      title: "Transaksi Bulan Ini",
      value: "12.480",
      percentage: 8,
      description: "Total transaksi yang tercatat bulan ini.",
    },
    {
      title: "Pengguna Baru",
      value: 342,
      percentage: -5,
      description: "Jumlah pengguna baru dibandingkan bulan lalu.",
    },
  ];

  const [search, setSearch] = useState("");

  const handleSearch = (value: string) => {
    setSearch(value);
    console.log("Search keyword:", value);
  };


  return (
    <DashboardAdminLayout path="xxx">

      <HeadSummary
        title="Summary"
        updatedAt="Baru saja"
        mode="search"
        onSearchChange={handleSearch}
      />
      <StatsSection
        title="Ringkasan Aktivitas"
        stats={statsData}
        className="mt-5"
      />
           
      <DemoTableRecentUMKm
      title="Recents UMKM"/>
    </DashboardAdminLayout>
  );
};

export default MainDsAdmin;
