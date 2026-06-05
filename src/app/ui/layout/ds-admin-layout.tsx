'use client'

import React, { useEffect, useState } from "react";
import Sidebar from "@/app/ui/sidebar/sidebar"; // Import Sidebar Component
import MobileNavbar from "@/app/ui/nav/mobile-navbar";
import { faBars, faBell, faEnvelope, faGear, faHome, faReceipt, faShareAlt, faUser, faUsers } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import useStore from "@/stores/use-store";
import { contactAPI, getUserInfo } from "@/lib/api";
interface DashboardLayoutProps {
    children: React.ReactNode;  // Add children prop type for dynamic content
    path: string;
}

const DashboardAdminLayout: React.FC<DashboardLayoutProps> = ({ children, path }) => {
    const { isSidebarOpen, toggleSidebar } = useStore();
    const pathname = usePathname();
    const [inboxUnread, setInboxUnread] = useState<number>(0);

    useEffect(() => {
        const userInfo = getUserInfo();
        if (!userInfo || (userInfo.scope || "user") !== "admin") return;

        let cancelled = false;
        contactAPI
            .getStats()
            .then((res) => {
                if (cancelled) return;
                const n = res.data?.new;
                if (typeof n === "number") setInboxUnread(n);
            })
            .catch(() => {
                // Silent fail — badge optional.
            });

        return () => {
            cancelled = true;
        };
    }, [pathname]);

    // Define custom handlers
    const handleMenuClick = () => {
        toggleSidebar();
        console.log("Menu clicked");
    };

    const handleNotificationsClick = () => {
        console.log("Notifications clicked");
    };

    const handleUserClick = () => {
        console.log("User clicked");
    };

    // Define the array of navbar items
    const navbarItems = [
        {
            icon: faBars,
            label: "Menu",
            onClick: handleMenuClick,
        },
        {
            icon: faBell,
            label: "Notifications",
            onClick: handleNotificationsClick,
        },
        {
            icon: faUser,
            label: "You",
            onClick: handleUserClick,
        },
    ];

    const links = [
        { href: `/${path}`, icon: faHome, label: "Beranda", hasDivider: false },
        { href: `/${path}/users-management`, icon: faUsers, label: "User Management", hasDivider: false },
        { href: `/${path}/transaction`, icon: faReceipt, label: "Transaksi", hasDivider: false },
        { href: `/${path}/inbox`, icon: faEnvelope, label: "Inbox", hasDivider: false, badge: inboxUnread },
        // { href: `/${path}/affiliate`, icon: faShareAlt, label: "Affiliate", hasDivider: true },
        { href: `/${path}/settings`, icon: faGear, label: "Pengaturan", hasDivider: false },
    ];

    const getLinkClass = (href: string) => {
        return pathname === href ? 'text-green-c bg-green-100 rounded-full' : '';
    };


    return (
     // 🔧 Full-height container; konten scroll, navbar fixed
    <div className="relative flex h-screen overflow-hidden bg-gray-100">
    {/* Sidebar */}
    
    <Sidebar
      isOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
      links={links}
      getLinkClass={getLinkClass}
    />

    {/* Main Content Area (scrollable) */}
    <div
      className={`flex-1 bg-gray-50 transition-all duration-300 ease-in-out  w-full md:w-[calc(100%-16rem)] ${
        isSidebarOpen ? "ml-0 md:ml-65 " : "ml-0 sm:ml-65"
      }`}
    >
      <div className="h-full w-full overflow-y-auto  px-2 lg:px-5 pb-20 md:pb-6 mt-2">
      {children}
      </div>
    </div>

    {/* Mobile Navbar (fixed/absolute) */}
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <MobileNavbar items={navbarItems} />
    </div>
  </div>
    );
};

export default DashboardAdminLayout;
