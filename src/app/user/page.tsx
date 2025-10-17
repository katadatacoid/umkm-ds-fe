"use client";

import React, { useState } from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import HeadSummary from "@/app/ui/headers/header-summary";
import StatsSection from "@/app/ui/section/seaction-stat";
import DemoTableRecentUMKm from "./table-new-product";
import Chart from "../ui/charts/line-chart";
import EarningsChart from "@/app/ui/charts/earnings-chart";

const DsUser = () => {
  const statsData = [
    {
      title: "Total UMKM Aktif",
      value: 156,
      // percentage: 15,
      description: "Jumlah produk yang sudah tersedia di katalog.",
    },
    {
      title: "Total Referral",
      value: 150,
      percentage: 32,
      description: "Total keseluruhan referral.",
    },
    {
      title: "Page Views",
      value: "6.430",
      // percentage: -5,
      description: "Jumlah kunjungan halaman yang tercatat.",
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
    <div>
      <DashboardUserLayout path="user">
        <HeadSummary
          title="Summary"
          updatedAt="Baru saja"
          mode="search"
          onSearchChange={handleSearch}
        />

        {/*TODO UNCOMMENT: to use "Earning Chats" */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left (Chart utama + Stats) → 60% */}
          <div className="flex flex-col lg:w-[60%] min-w-0">
            <StatsSection title="Ringkasan Aktivitas" stats={statsData} className="mt-5" />
            <Chart
              data={chartData}
              seriesNames={seriesNames}
              fieldNames={fieldNames}
              colors={colors}
              chartType={chartType}
            />
          </div>

          {/* Right (Earnings chart) → 40% */}
          <div className="lg:w-[40%] min-w-0">
            <EarningsChart />
          </div>
        </div>

        {/* <StatsSection title="Ringkasan Aktivitas" stats={statsData} className="mt-5" />
        <Chart
          data={chartData}
          seriesNames={seriesNames}
          fieldNames={fieldNames}
          colors={colors}
          chartType={chartType}
        /> */}

        <DemoTableRecentUMKm title="Produk baru ditambahkan" />
      </DashboardUserLayout>
    </div>
  );
};

export default DsUser;
