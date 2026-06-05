"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUserFromToken } from "@/lib/utils";
import { authAPI } from "@/lib/api";
import NavTooltip from "@/components/NavTooltip";
import LogoutModal from "@/components/LogoutModal"; // ← import baru

interface LinkItem {
  href: string;
  icon: IconDefinition;
  label: string;
  hasDivider: boolean;
  badge?: number;
  tooltipKey?: string | null;
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  links: LinkItem[];
  getLinkClass: (href: string) => string;
}

const InfoIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="w-3.5 h-3.5 flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors cursor-help"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0ZM9 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM6.75 8a.75.75 0 0 0 0 1.5h.75v1.75a.75.75 0 0 0 1.5 0v-2.5A.75.75 0 0 0 8.25 8h-1.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, links, getLinkClass }) => {
  const [userName, setUserName]           = useState<string>("User");
  const [userEmail, setUserEmail]         = useState<string>("");
  const [loggingOut, setLoggingOut]       = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // ← state modal baru
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      if (user.name)  setUserName(user.name);
      if (user.email) setUserEmail(user.email);
    }
  }, []);

  // ─── Buka modal (menggantikan window.confirm) ─────────────────────────────
  const handleLogoutClick = useCallback(() => {
    if (loggingOut) return;
    setShowLogoutModal(true);
  }, [loggingOut]);

  // ─── Dipanggil saat user klik "Ya, Keluar" di modal ───────────────────────
  const handleLogoutConfirm = useCallback(async () => {
    setLoggingOut(true);
    try {
      await authAPI.logout();
    } finally {
      setLoggingOut(false);
      setShowLogoutModal(false);
      router.replace("/");
    }
  }, [router]);

  // ─── Dipanggil saat user klik "Batal" atau Escape ─────────────────────────
  const handleLogoutCancel = useCallback(() => {
    if (loggingOut) return;
    setShowLogoutModal(false);
  }, [loggingOut]);

  const handleLinkClick = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      toggleSidebar();
    }
  }, [toggleSidebar]);

  return (
    <>
      {/* Backdrop mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        role="navigation"
        aria-label="Sidebar"
        aria-expanded={isOpen}
        className={[
          "fixed inset-y-0 left-0 z-40 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-64",
          "lg:translate-x-0",
          "w-20 lg:w-64",
          "bg-white text-gray-600 border-r border-gray-200 shadow-sm",
          "flex flex-col",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold hidden lg:block">Dashboard</h2>
        </div>

        {/* Nav list */}
        <nav className="flex-1 overflow-y-auto px-3 pb-24">
          <ul className="space-y-1">
            {links.map((link) => (
              <React.Fragment key={link.href}>
                <li>
                  <Link
                    href={link.href}
                    onClick={handleLinkClick}
                    className={[
                      "flex items-center rounded-md px-2 py-2 lg:px-3 lg:py-2",
                      "hover:bg-green-50 hover:text-green-700",
                      "transition-colors duration-150 group",
                      getLinkClass(link.href),
                    ].join(" ")}
                    title={link.label}
                  >
                    <FontAwesomeIcon
                      icon={link.icon}
                      className="mr-0 lg:mr-3 text-base lg:text-[15px] shrink-0 group-hover:text-green-600"
                    />
                    <span className="hidden lg:flex items-center gap-1.5 flex-1 min-w-0">
                      <span className="text-sm truncate flex-1">{link.label}</span>
                      {link.tooltipKey && (
                        <span
                          onClick={(e) => e.preventDefault()}
                          className="inline-flex"
                        >
                          <NavTooltip menuKey={link.tooltipKey}>
                            <InfoIcon />
                          </NavTooltip>
                        </span>
                      )}
                    </span>
                    {link.badge && link.badge > 0 ? (
                      <span
                        className="ml-auto rounded-full bg-blue-600 text-white text-[10px] font-semibold px-1.5 py-0.5 min-w-[18px] text-center hidden lg:inline-block"
                        aria-label={`${link.badge} belum dibaca`}
                      >
                        {link.badge > 99 ? "99+" : link.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
                {link.hasDivider && (
                  <li aria-hidden="true">
                    <div className="border-t border-gray-200 my-2 mx-2 lg:mx-3" />
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>

        {/* Fixed bottom: profile + logout */}
        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 hidden sm:flex flex-col gap-2 border-t border-gray-100 bg-white">
          <div className="flex items-center">
            <div className="flex w-10 h-10 items-center justify-center rounded-full bg-green-100 text-green-700 font-semibold text-sm shrink-0">
              {(userName || "U").trim().charAt(0).toUpperCase()}
            </div>
            <div className="hidden lg:flex flex-col ml-2 min-w-0 flex-1">
              <span className="text-xs text-gray-500">Welcome Back</span>
              <span className="text-sm font-medium text-gray-700 truncate" title={userName}>
                {userName}
              </span>
              {userEmail && (
                <span className="text-[11px] text-gray-400 truncate" title={userEmail}>
                  {userEmail}
                </span>
              )}
            </div>
          </div>

          {/* ← onClick sekarang membuka modal, bukan window.confirm */}
          <button
            type="button"
            onClick={handleLogoutClick}
            disabled={loggingOut}
            aria-label="Logout"
            title="Logout"
            className="w-full inline-flex items-center justify-center lg:justify-start gap-2 rounded-md border border-red-200 bg-white px-2 lg:px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="text-sm" />
            <span className="hidden lg:inline">
              {loggingOut ? "Sedang keluar..." : "Logout"}
            </span>
          </button>
        </div>
      </aside>
      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
        isLoading={loggingOut}
      />
    </>
  );
};

export default Sidebar;