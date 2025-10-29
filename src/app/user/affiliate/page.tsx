"use client";

import React from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import HeadSummary from "@/app/ui/headers/header-summary";
import StatsSection from "@/app/ui/section/seaction-stat";
import AffiliateChart from "@/app/ui/charts/affiliate-chart";
import WithdrawCard from "@/app/ui/card/withdraw-card";
import ReferralCard from "@/app/ui/card/referral-card";
import TransactionHistoryTable from "./transaction-history-table";
import { useAffiliateStore } from "@/stores/use-affiliate-store";
import WithdrawFormModal from "@/app/ui/forms/withdraw-form-modal";
import SuccessModal from "@/app/ui/modal/SuccessModal";

const AffiliateUser = () => {
  const statsData = useAffiliateStore((s) => s.statsData);
  const referralCode = useAffiliateStore((s) => s.referralCode);
  const totalReferrals = useAffiliateStore((s) => s.totalReferrals);
  const balance = useAffiliateStore((s) => s.balance);
  const minWithdraw = useAffiliateStore((s) => s.minWithdraw);
  const processDays = useAffiliateStore((s) => s.processDays);
  const selectedYear = useAffiliateStore((s) => s.selectedYear);
  const earnings = useAffiliateStore((s) => s.earnings);
  const showWithdrawForm = useAffiliateStore((s) => s.showWithdrawForm);
  const toggleWithdrawForm = useAffiliateStore((s) => s.toggleWithdrawForm);
  const setSelectedYear = useAffiliateStore((s) => s.setSelectedYear);

  const handleSearch = (value: string) => console.log("Search:", value);
  const getCurrentYearData = () => earnings[selectedYear];

  const isSuccess = useAffiliateStore((s) => s.isSuccess);
  const setIsSuccess = useAffiliateStore((s) => s.setIsSuccess);

  return (
    <DashboardUserLayout path="user">
      <div className="flex flex-col w-full space-y-6 sm:space-y-8">
        <HeadSummary
          title="Affiliate Overview"
          updatedAt="3 minutes ago"
          mode="search"
          onSearchChange={handleSearch}
        />

        <StatsSection title="Ringkasan Aktivitas" stats={statsData} className="mt-2" />

        {/* Chart Section */}
        <div className="w-full">
          <div className="bg-white rounded-2xl shadow px-2 sm:px-6 py-4 sm:py-6">
            <div className="w-full overflow-x-auto">
              <div className="min-w-[600px] sm:min-w-0">
                <AffiliateChart
                  data={getCurrentYearData()}
                  years={["2024", "2025"]}
                  defaultYear={selectedYear}
                  title="Earnings"
                  showLegend={true}
                  height={typeof window !== "undefined" && window.innerWidth < 640 ? 250 : 400}
                  color="#10b981"
                  onYearChange={setSelectedYear}
                />
              </div>
            </div>
            <div className="text-xs pt-2 text-gray-400 italic text-center mt-1 sm:hidden">
              Geser chart ke kanan untuk melihat bulan lainnya →
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <ReferralCard
            referralCode={referralCode}
            totalReferrals={totalReferrals}
            onCopyLink={() => console.log("Referral link copied")}
          />

          <WithdrawCard
            balance={balance}
            minWithdraw={minWithdraw}
            processDays={processDays}
            onWithdraw={() => toggleWithdrawForm(true)}
          />
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
          <TransactionHistoryTable />
        </div>
      </div>

      {showWithdrawForm && <WithdrawFormModal onClose={() => toggleWithdrawForm(false)} />}

      <SuccessModal
        isOpen={isSuccess}
        onClose={() => setIsSuccess(false)}
        title="Permintaan Berhasil Dikirim!"
        message="Permintaan withdraw Anda sedang diproses. Dana akan ditransfer dalam 1-3 hari kerja."
        buttonLabel="Tutup"
      />
    </DashboardUserLayout>
  );
};

export default AffiliateUser;
