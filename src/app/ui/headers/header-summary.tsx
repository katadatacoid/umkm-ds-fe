import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";

interface HeadSummaryProps {
  title?: string;
  updatedAt?: string;
  mode?: "search" | "button"; // menentukan tampilan kanan
  buttonLabel?: string;
  buttonIcon?: any; // ikon FontAwesome opsional
  onButtonClick?: () => void;
  onSearchChange?: (value: string) => void;
}

const HeadSummary: React.FC<HeadSummaryProps> = ({
  title = "Summary",
  updatedAt = "3 minutes ago",
  mode = "search",
  buttonLabel = "Tambah Data",
  buttonIcon = faPlus, // default ikon tambah
  onButtonClick,
  onSearchChange,
}) => {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-center p-4 sm:p-5 bg-white shadow-sm rounded-lg">
      {/* Kiri: Title + Last Updated */}
      <div className="flex flex-col sm:flex-row items-center sm:mr-4 text-center sm:text-left">
        <div className="text-base sm:text-xl font-semibold text-gray-800">{title}</div>
        <span className="ml-0 sm:ml-2 text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
          Last updated: {updatedAt}
        </span>
      </div>

      {/* Kanan: Dinamis - Search atau Button */}
      <div className="relative w-full sm:w-auto mt-3 sm:mt-0">
        {mode === "search" ? (
          <>
            <input
              type="text"
              placeholder="Cari data..."
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-9 pr-3 py-2 w-full sm:w-60 md:w-72 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className="absolute left-3 top-2.5 text-gray-400 h-4 w-4"
            />
          </>
        ) : (
          <button
            onClick={onButtonClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-c hover:bg-green-700 text-white text-sm sm:text-base font-medium px-4 py-2 rounded-md transition-colors duration-200"
          >
            <FontAwesomeIcon icon={buttonIcon} className="h-4 w-4" />
            {buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default HeadSummary;
