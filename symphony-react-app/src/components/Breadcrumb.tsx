import React from 'react';
import { Link } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="bg-gray-50 border-b border-gray-200 py-3 sticky top-[140px] z-40" data-testid="breadcrumb">
      <div className="container mx-auto px-4">
        <ol className="flex items-center space-x-2 text-lg">
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className="text-gray-400 select-none">&gt;</span>
              )}
              {item.path ? (
                <li>
                  <Link
                    to={item.path}
                    className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ) : (
                <li className="text-gray-900 font-medium">
                  {item.label}
                </li>
              )}
            </React.Fragment>
          ))}
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;