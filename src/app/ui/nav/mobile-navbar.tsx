import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface NavbarItem {
  icon: IconProp;      // Icon component (FontAwesomeIcon)
  label: string;              // Label for the icon
  onClick: () => void;        // onClick handler for the item
}

interface MobileNavbarProps {
  items: NavbarItem[];        // Array of navbar items
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ items }) => {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 w-full bg-gray-800 text-white">
      <div className="flex justify-around items-center py-3">
        {/* Map over the items array to generate navbar links */}
        {items.map((item, index) => (
          <a
            href="#"
            key={index}
            className="flex flex-col items-center"
            onClick={item.onClick} // Use the onClick handler from the array
          >
            <FontAwesomeIcon icon={item.icon} className="text-2xl" />
            <span className="text-xs">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default MobileNavbar;
