"use client";

import React, { useState, useEffect } from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import HeadSummary from "@/app/ui/headers/header-summary";
import StatsSection from "@/app/ui/section/seaction-stat";
import DemoTableRecentProduct from "./table-new-product";
import PageViewsChart from "@/app/ui/charts/page-views-chart";
import EarningsChart from "@/app/ui/charts/earnings-chart";
import { useUserDashboardStore } from "@/stores/use-user-dashboard-store";

const DsUser = () => {
  const { statsData, fetchDashboardData, loading } = useUserDashboardStore();
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  // Debounce search - tunggu 500ms setelah user berhenti mengetik
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Search query set to:", searchInput);
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <DashboardUserLayout path="user">
      <HeadSummary
        title="Summary"
        updatedAt="Baru saja"
        mode="search"
        onSearchChange={handleSearch}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col lg:w-[60%] min-w-0">
          <StatsSection 
            title="Ringkasan Aktivitas" 
            stats={statsData} 
            className="mt-5"
          />
          <PageViewsChart />
        </div>

        <div className="lg:w-[40%] min-w-0">
          <EarningsChart />
        </div>
      </div>

      <DemoTableRecentProduct
        title="Produk baru ditambahkan"
        description="Daftar produk terbaru yang sudah masuk ke katalog Anda."
        searchQuery={searchQuery}
      />
    </DashboardUserLayout>
  );
};

export default DsUser;