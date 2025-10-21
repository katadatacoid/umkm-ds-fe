"use client";

import React, { useState } from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import HeadSummary from "@/app/ui/headers/header-summary";
import StatsSection from "@/app/ui/section/seaction-stat";
import DemoTableRecentUMKm from "../table-new-product";
import AffiliateChart from "@/app/ui/charts/affiliate-chart";
import WithdrawCard from "@/app/ui/card/withdraw-card";
import ReferralCard from "@/app/ui/card/referral-card";
import TransactionHistoryTable from "./transaction-history-table";

const AffiliateUser = () => {
  const statsData = [
    {
      title: "Total Earnings",
      value: "175.000",
      percentage: 15,
      description: "dari bulan lalu",
    },
    {
      title: "Total Referral",
      value: 10,
      description: "Orang yang mendaftar dengan kode Anda.",
    },
    {
      title: "Tingkat Konversi",
      value: "85%",
      description: "Presentase referral yang berhasil.",
    },
  ];

  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");

  const handleSearch = (value: string) => {
    setSearch(value);
    console.log("Search keyword:", value);
  };

  // Sample earnings data - replace with your actual data based on selectedYear
  const earningsData2025 = [
    { month: "Jan", value: 120 },
    { month: "Feb", value: 180 },
    { month: "Mar", value: 550 },
    { month: "Apr", value: 420 },
    { month: "May", value: 320 },
    { month: "Jun", value: 210 },
    { month: "Jul", value: 250 },
    { month: "Aug", value: 280 },
    { month: "Sep", value: 320 },
    { month: "Okt", value: 260 },
    { month: "Nov", value: 140 },
    { month: "Des", value: 160 },
  ];

  const earningsData2024 = [
    { month: "Jan", value: 80 },
    { month: "Feb", value: 120 },
    { month: "Mar", value: 350 },
    { month: "Apr", value: 280 },
    { month: "May", value: 220 },
    { month: "Jun", value: 150 },
    { month: "Jul", value: 180 },
    { month: "Aug", value: 200 },
    { month: "Sep", value: 240 },
    { month: "Okt", value: 180 },
    { month: "Nov", value: 100 },
    { month: "Des", value: 120 },
  ];

  // Get data based on selected year
  const getCurrentYearData = () => {
    if (selectedYear === "2025") return earningsData2025;
    if (selectedYear === "2024") return earningsData2024;
    return earningsData2025;
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    console.log("Year changed to:", year);
    // Here you can fetch new data from API based on year
  };

  return (
    <div>
      <DashboardUserLayout path="user">
        <HeadSummary
          title="Affiliate Overview"
          updatedAt="3 minutes ago"
          mode="search"
          onSearchChange={handleSearch}
        />

        <StatsSection title="Ringkasan Aktivitas" stats={statsData} className="mt-5" />

        {/* New Earnings Chart Component */}
        <div className="mt-6">
          <AffiliateChart
            data={getCurrentYearData()}
            years={["2023", "2024", "2025"]}
            defaultYear="2025"
            title="Earnings"
            showLegend={true}
            height={400}
            color="#10b981"
            onYearChange={handleYearChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <ReferralCard
            referralCode="RUMAH2025-USER123"
            totalReferrals={4}
            onCopyLink={() => console.log("Referral link copied")}
          />
          <WithdrawCard
            balance={175000}
            minWithdraw={100000}
            processDays="1-3"
            onWithdraw={() => console.log("Withdraw clicked")}
          />
        </div>

        {/* Transaction History Table */}
        <TransactionHistoryTable />
      </DashboardUserLayout>
    </div>
  );
};

export default AffiliateUser;
