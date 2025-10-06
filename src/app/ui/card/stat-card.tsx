import React from "react";
import { faInfo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface StatCardProps {
  title: string;
  value: number | string;
  percentage?: number;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  percentage,
  description,
}) => {
  const isPositive = (percentage ?? 0) >= 0;

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-gray-700 text-[11px] sm:text-sm font-medium truncate">
          {title}
        </h3>
        <FontAwesomeIcon icon={faInfo} className="h-3.5 w-3.5 text-gray-400" />
      </div>

      {/* Value and Growth */}
      <div className="flex items-center space-x-1.5">
        <span className="text-xl sm:text-2xl font-semibold text-gray-900">
          {value}
        </span>
        {percentage !== undefined && (
          <span
            className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ${
              isPositive ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
            }`}
          >
            {isPositive ? "↑" : "↓"} {Math.abs(percentage)}%
          </span>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-[10px] sm:text-xs text-gray-500 mt-1 line-clamp-2">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatCard;
