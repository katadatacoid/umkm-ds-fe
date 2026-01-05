"use client";

import React, { useEffect } from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import StatsSection from "@/app/ui/section/seaction-stat";
import HeadSummary from "@/app/ui/headers/header-summary";
import DemoTableProducts from "./table-products";
import { usePathname, useRouter } from "next/navigation";
import { useUserProductsStore } from "@/stores/use-user-products-store";

const ManagementProductsUser: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { statsData, fetchProductsData } = useUserProductsStore();

  const handleAddClick = () => {
    router.push(`${pathname}/add`);
  };

  useEffect(() => {
    fetchProductsData();
  }, [fetchProductsData]);

  return (
    <DashboardUserLayout path="user">
      <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 md:px-6 lg:px-8 pb-6">

        <HeadSummary
          title="Produk"
          updatedAt="Baru saja"
          mode="button"
          buttonLabel="Tambah Produk Baru"
          onButtonClick={handleAddClick}
        />

        <div className="mt-1">
          <StatsSection stats={statsData} />
        </div>

        <div className="mt-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <DemoTableProducts />
        </div>
      </div>
    </DashboardUserLayout>
  );
};

export default ManagementProductsUser;