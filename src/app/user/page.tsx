"use client";

import React from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import HeadSummary from "@/app/ui/headers/header-summary";
import StatsSection from "@/app/ui/section/seaction-stat";
import DemoTableRecentUMKm from "./table-new-product";
import PageViewsChart from "@/app/ui/charts/page-views-chart";
import EarningsChart from "@/app/ui/charts/earnings-chart";
import { useUserDashboardStore } from "@/stores/use-user-dashboard-store";

const DsUser = () => {
  const { statsData, search: _search, setSearch } = useUserDashboardStore();

  const handleSearch = (value: string) => {
    setSearch(value);
    console.log("Search keyword:", value);
  };

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
          <StatsSection title="Ringkasan Aktivitas" stats={statsData} className="mt-5" />
          <PageViewsChart />
        </div>

        <div className="lg:w-[40%] min-w-0">
          <EarningsChart />
        </div>
      </div>

      <DemoTableRecentUMKm
        title="Produk baru ditambahkan"
        description="Daftar produk terbaru yang sudah masuk ke katalog Anda."
      />
    </DashboardUserLayout>
  );
};

export default DsUser;
