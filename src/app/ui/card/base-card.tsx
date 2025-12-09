import React from "react";

const BaseCard = ({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm ${className}`}>
      <h3 className="text-gray-900 font-semibold text-lg mb-1">{title}</h3>
      {subtitle && <p className="text-gray-600 text-sm mb-4">{subtitle}</p>}
      {children}
    </div>
  );
};

export default BaseCard;
