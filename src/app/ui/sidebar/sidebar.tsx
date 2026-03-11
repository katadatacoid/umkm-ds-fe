import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { getUserFromToken } from "@/lib/utils";

interface LinkItem {
  href: string;
  icon: IconDefinition;
  label: string;
  hasDivider: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  links: LinkItem[];
  getLinkClass: (href: string) => string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, links, getLinkClass }) => {
  const [userName, setUserName] = useState<string>("User");

  // Ambil nama user dari token saat component mount
  useEffect(() => {
    const user = getUserFromToken();
    if (user && user.name) {
      setUserName(user.name);
    }
  }, []);

  // Tutup otomatis ketika klik link di mobile (lg:hidden)
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
          "flex flex-col"
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-semibold hidden lg:block">Dashboard</h2>
        </div>

        {/* Nav list (scrollable) */}
        <nav className="flex-1 overflow-y-auto px-3 pb-24">
          <ul className="space-y-1">
            {links.map((link, index) => (
              <React.Fragment key={link.href}>
                <li>
                  <Link
                    href={link.href}
                    onClick={handleLinkClick}
                    className={[
                      "flex items-center rounded-md px-2 py-2 lg:px-3 lg:py-2",
                      "hover:bg-green-50 hover:text-green-700",
                      "transition-colors duration-150 group",
                      getLinkClass(link.href)
                    ].join(" ")}
                    title={link.label} // bantu tooltip saat collapsed
                  >
                    <FontAwesomeIcon
                      icon={link.icon}
                      className="mr-0 lg:mr-3 text-base lg:text-[15px] shrink-0 group-hover:text-green-600"
                    />
                    <span className="hidden lg:inline text-sm">{link.label}</span>
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

        {/* Fixed bottom user info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 hidden sm:flex items-center">
          <img
            src="https://static.wikia.nocookie.net/umamusume/images/3/39/Oguri_Cap_%28Race%29.png"
            alt="User avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col ml-2">
            <span className="text-xs text-gray-500">Welcome Back</span>
            <span className="text-sm font-medium text-gray-700">{userName}</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;