"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/app/ui/sidebar/sidebar";
import MobileNavbar from "@/app/ui/nav/mobile-navbar";
import NavTooltip from "@/components/NavTooltip"; // ← import NavTooltip
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
  faWindowMinimize,
  faAddressCard,
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

// ─── Tipe link yang diperluas dengan tooltipKey ───────────────────────────────
export interface NavLinkItem {
  href: string;
  icon: typeof faHome;
  label: string;
  hasDivider: boolean;
  menuKey: string | null;
  /** Key yang dipakai NavTooltip untuk menampilkan konten tooltip */
  tooltipKey: string | null;
}

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

  // ─── Semua definisi link (+ tooltipKey) ───────────────────────────────────
 const allLinks: NavLinkItem[] = [
  {
    href: `/${path}`,
    icon: faHome,
    label: "Beranda",
    hasDivider: false,
    menuKey: null,
    tooltipKey: "beranda",
  },
  {
    href: `/${path}/products-management`,
    icon: faBoxOpen,
    label: "Product Management",
    hasDivider: true,
    menuKey: null,
    tooltipKey: "products",
  },
  {
    href: `/${path}/storefront/landing-sections`,
    icon: faPalette,
    label: "Landing Page",
    hasDivider: false,
    menuKey: null,
    tooltipKey: "landing",
  },
  {
    href: `/${path}/storefront/faqs`,
    icon: faCircleQuestion,
    label: "FAQ",
    hasDivider: false,
    menuKey: "faqs",
    tooltipKey: "faqs",
  },
  {
    href: `/${path}/storefront/testimonials`,
    icon: faComments,
    label: "Testimonial",
    hasDivider: false,
    menuKey: "testimonials",
    tooltipKey: "testimonials",
  },
  {
    href: `/${path}/storefront/about`,
    icon: faAddressCard,
    label: "About Us",
    hasDivider: false,
    menuKey: null,
    tooltipKey: "about us",
  },
  // ↓ Label & tooltipKey berubah untuk template 1
  {
    href: `/${path}/storefront/footer`,
    icon: faWindowMinimize,
    label: templateId === 1 ? "Sidebar" : "Footer",
    hasDivider: true,
    menuKey: null,
    tooltipKey: templateId === 1 ? "sidebar" : "footer",
  },
  {
    href: `/${path}/settings`,
    icon: faGear,
    label: "Pengaturan",
    hasDivider: false,
    menuKey: null,
    tooltipKey: "settings",
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

  // ─── Render sidebar links dengan NavTooltip ───────────────────────────────
  //
  // CATATAN INTEGRASI:
  // Jika komponen <Sidebar> Anda menerima prop `links` dan me-render setiap item
  // secara internal, ada DUA cara mengintegrasikan NavTooltip:
  //
  // CARA A — Lewatkan `tooltipKey` sebagai bagian dari object link (DIREKOMENDASIKAN):
  //   Sidebar menerima `links` dengan field `toltipKey`, lalu di dalam Sidebar.tsx:
  //
  //   import NavTooltip from "@/components/NavTooltip";
  //
  //   {links.map((link) => (
  //     <NavTooltip key={link.href} menuKey={link.tooltipKey ?? ""}>
  //       <a href={link.href} className={getLinkClass(link.href)}>
  //         <FontAwesomeIcon icon={link.icon} />
  //         <span>{link.label}</span>
  //       </a>
  //     </NavTooltip>
  //   ))}
  //
  // CARA B — Render links manual di layout ini (jika Sidebar tidak bisa dimodifikasi):
  //   Ganti <Sidebar> di bawah dengan <SidebarShell> yang menerima rendered children.
  //
  // File ini sudah meneruskan `links` (dengan `tooltipKey`) ke <Sidebar>.
  // Pastikan Sidebar.tsx diupdate mengikuti CARA A di atas.
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="relative flex h-screen overflow-hidden bg-gray-100">
      {/*
        Sidebar menerima `links` yang kini mengandung `tooltipKey`.
        Di dalam Sidebar.tsx, bungkus setiap link item dengan:
          <NavTooltip menuKey={link.tooltipKey ?? ""}> ... </NavTooltip>
      */}
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