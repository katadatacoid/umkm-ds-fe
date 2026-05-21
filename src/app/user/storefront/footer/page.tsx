"use client";

import React, { useEffect } from "react";
import DashboardUserLayout from "@/app/ui/layout/ds-user-layout";
import HeadSummary from "@/app/ui/headers/header-summary";
import { useFooterStore } from "@/stores/use-footer-store";
import BrandPanel from "./brand-panel";
import MenuGroupsPanel from "./menu-groups-panel";
import SocialsPanel from "./socials-panel";

const FooterPage: React.FC = () => {
  const { fetchAll, loading, error } = useFooterStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <DashboardUserLayout path="user">
      <div className="flex flex-col gap-4 sm:gap-6 px-2 sm:px-4 md:px-6 lg:px-8 pb-6">
        <HeadSummary title="Footer" updatedAt="Baru saja" mode="search" />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md px-4 py-2">
            {error}
          </div>
        )}

        {loading && (
          <div className="text-sm text-gray-500">Memuat data footer...</div>
        )}

        <BrandPanel />
        <MenuGroupsPanel />
        <SocialsPanel />
      </div>
    </DashboardUserLayout>
  );
};

export default FooterPage;
