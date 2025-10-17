"use client";

import React, { useState } from "react";
import DashboardAdminLayout from "@/app/ui/layout/ds-admin-layout";
import HeadSummary from "@/app/ui/headers/header-summary";

import StatsSection from "@/app/ui/section/seaction-stat";
import DemoTableRecentUMKm from "./table-recent-umk";
import Chart from "../ui/charts/line-chart";

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

  const chartData = [
    { month: "Jan", umkm: 100, user_aff: 200 },
    { month: "Feb", umkm: 200, user_aff: 400 },
    { month: "Mar", umkm: 800, user_aff: 450 },
    { month: "Apr", umkm: 956, user_aff: 300 },
    { month: "May", umkm: 400, user_aff: 500 },
    { month: "Jun", umkm: 100, user_aff: 200 },
    { month: "Jul", umkm: 200, user_aff: 400 },
    { month: "Aug", umkm: 800, user_aff: 450 },
    { month: "Sep", umkm: 956, user_aff: 300 },
    { month: "Oct", umkm: 400, user_aff: 500 },
  ];

  // Nama seri (Revenue dan Visitors)
  const seriesNames = ["UMKM", "User Affiliasi"];

  // Field untuk setiap series (umkm dan user_aff)
  const fieldNames = ["umkm", "user_aff"];

  // Warna untuk setiap series
  const colors = ["#4D97FF", "#28A745"];
  // Menentukan jenis chart: 'line' atau 'column'
  const chartType: "line" | "column" = "line"; // Anda bisa mengganti ini menjadi 'column' untuk menggunakan ColumnSeries

  return (
    <DashboardAdminLayout path="xxx">
      <HeadSummary
        title="Summary"
        updatedAt="Baru saja"
        mode="search"
        onSearchChange={handleSearch}
      />
      <StatsSection title="Ringkasan Aktivitas" stats={statsData} className="mt-5" />

      <Chart
        data={chartData}
        seriesNames={seriesNames}
        fieldNames={fieldNames}
        colors={colors}
        chartType={chartType}
      />

      <DemoTableRecentUMKm title="Recents UMKM" />
    </DashboardAdminLayout>
  );
};

export default MainDsAdmin;
