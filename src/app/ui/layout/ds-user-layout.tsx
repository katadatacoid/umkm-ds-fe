"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/app/ui/sidebar/sidebar";
import MobileNavbar from "@/app/ui/nav/mobile-navbar";
import {
  faBars,
  faBell,
  faGear,
  faHome,
  faShareAlt,
  faUser,
  faBoxOpen,
  faPalette,
  faCircleQuestion,
  faComments,
  faNewspaper,
  faWindowMinimize,
} from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import useStore from "@/stores/use-store";
import { userAPI } from "@/lib/api";

// ─── Aturan akses menu per template ──────────────────────────────────────────
const MENU_TEMPLATE_RULES: Record<string, number[]> = {
  faqs:         [4], // FAQ hanya template 4
  testimonials: [3], // Testimonial hanya template 3
};

const TEMPLATE_ID_CACHE_KEY = "umkm_template_id";

interface DashboardLayoutProps {
  children: React.ReactNode;
  path: string;
}

const DashboardUserLayout: React.FC<DashboardLayoutProps> = ({ children, path }) => {
  const { isSidebarOpen, toggleSidebar } = useStore();
  const pathname = usePathname();

  // ─── Fetch templateId dengan localStorage cache ───────────────────────────
  const [templateId, setTemplateId] = useState<number | null>(() => {
    if (typeof window === "undefined") return null;
    const cached = localStorage.getItem(TEMPLATE_ID_CACHE_KEY);
    return cached ? Number(cached) : null;
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await userAPI.getMe();
        if (cancelled) return;
        const tid = res?.data?.umkm?.template_id;
        if (tid) {
          const numTid = Number(tid);
          setTemplateId(numTid);
          localStorage.setItem(TEMPLATE_ID_CACHE_KEY, String(numTid));
        }
      } catch (e) {
        console.error("[layout] getMe error:", e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ─── Navbar handlers ──────────────────────────────────────────────────────
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

  const navbarItems = [
    { icon: faBars,  label: "Menu",          onClick: handleMenuClick          },
    { icon: faBell,  label: "Notifications",  onClick: handleNotificationsClick },
    { icon: faUser,  label: "You",            onClick: handleUserClick          },
  ];

  // ─── Semua definisi link ───────────────────────────────────────────────────
  const allLinks = [
    {
      href: `/${path}`,
      icon: faHome,
      label: "Beranda",
      hasDivider: false,
      menuKey: null,
    },
    {
      href: `/${path}/products-management`,
      icon: faBoxOpen,
      label: "Product Management",
      hasDivider: true,
      menuKey: null,
    },
    {
      href: `/${path}/storefront/landing-sections`,
      icon: faPalette,
      label: "Landing Page",
      hasDivider: false,
      menuKey: null,
    },
    {
      href: `/${path}/storefront/faqs`,
      icon: faCircleQuestion,
      label: "FAQ",
      hasDivider: false,
      menuKey: "faqs",          // ← hanya template 4
    },
    {
      href: `/${path}/storefront/testimonials`,
      icon: faComments,
      label: "Testimonial",
      hasDivider: false,
      menuKey: "testimonials",  // ← hanya template 3
    },
    {
      href: `/${path}/storefront/blog-posts`,
      icon: faNewspaper,
      label: "Blog Post",
      hasDivider: false,
      menuKey: null,
    },
    {
      href: `/${path}/storefront/footer`,
      icon: faWindowMinimize,
      label: "Footer",
      hasDivider: true,
      menuKey: null,
    },
    {
      href: `/${path}/affiliate`,
      icon: faShareAlt,
      label: "Affiliate",
      hasDivider: false,
      menuKey: null,
    },
    {
      href: `/${path}/settings`,
      icon: faGear,
      label: "Pengaturan",
      hasDivider: false,
      menuKey: null,
    },
  ];

  // ─── Filter links berdasarkan templateId ──────────────────────────────────
  const links = allLinks.filter(({ menuKey }) => {
    if (!menuKey) return true;
    if (templateId === null) return false;
    const allowed = MENU_TEMPLATE_RULES[menuKey];
    return allowed ? allowed.includes(templateId) : true;
  });

  const getLinkClass = (href: string) => {
    return pathname === href ? "text-green-c bg-green-100 rounded-full" : "";
  };

  console.log(pathname);

  return (
    <div className="relative flex h-screen overflow-hidden bg-gray-100">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        links={links}
        getLinkClass={getLinkClass}
      />

      <div
        className={`flex-1 bg-gray-50 transition-all duration-300 ease-in-out w-full md:w-[calc(100%-16rem)] ${
          isSidebarOpen ? "ml-0 md:ml-65" : "ml-0 sm:ml-65"
        }`}
      >
        <div className="h-full w-full overflow-y-auto px-2 lg:px-5 pb-20 md:pb-6 mt-2">
          {children}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <MobileNavbar items={navbarItems} />
      </div>
    </div>
  );
};

export default DashboardUserLayout;