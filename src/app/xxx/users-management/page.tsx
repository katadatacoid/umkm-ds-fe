'use client'

import React, { useState, useEffect } from "react";
import DashboardAdminLayout from "@/app/ui/layout/ds-admin-layout";
import StatsSection from "@/app/ui/section/seaction-stat";
import HeadSummary from "@/app/ui/headers/header-summary";
import DemoTableUsers from "./table-users";
import { usePathname, useRouter } from 'next/navigation';
import { umkmAPI } from '@/lib/api';

const ManagementUsersAdmin: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  // Fetch stats dari API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await umkmAPI.getAllWithSubscription();
        if (response.stats) {
          setStats(response.stats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      title: "Total UMKM Aktif",
      value: stats.active,
      percentage: 15,
      description: "Jumlah UMKM yang aktif menggunakan platform ini.",
    },
    {
      title: "Total UMKM Tidak Aktif",
      value: stats.inactive,
      percentage: -2,
      description: "UMKM yang terdaftar tapi tidak aktif.",
    },
  ];

  const handleAddClick = () => {
    console.log("Tambah data clicked");
    router.push(`${pathname}/add`);
  };

  //Handler untuk search (jika HeadSummary support onSearchChange di mode button)
  const handleSearch = (value: string) => {
    setSearchInput(value);
  };

  //Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Search query set to:", searchInput);
      setSearchQuery(searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <DashboardAdminLayout path="xxx">
      <HeadSummary
        title="Overview"
        updatedAt="Baru saja"
        mode="button"
        buttonLabel="Tambah UMKM Baru"
        onButtonClick={handleAddClick}
      />
      
      <StatsSection
        stats={statsData}
        className="mt-5"
      />
      
      <DemoTableUsers searchQuery={searchQuery} />
    </DashboardAdminLayout>
  );
};

export default ManagementUsersAdmin;