// src/components/Breadcrumb.tsx
import React from 'react';

interface BreadcrumbProps {
  links: { label: string, href: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ links }) => {
  return (
    <nav className="flex text-sm text-gray-600 mb-3">
      {links.map((link, index) => (
        <React.Fragment key={index}>
          <span className={`hover:text-green-c ${index === 0 ? '' : 'mx-2'}`}>
            {index === 0 ? link.label : <a href={link.href} className="text-green-c hover:text-green-800">{link.label}</a>}
          </span>
          {index < links.length - 1 && <span className="mx-2"> &gt; </span>}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
