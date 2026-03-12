import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import clsx from 'clsx';

function formatSegment(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname
    .split('/')
    .filter((seg) => seg !== '');

  // Build cumulative paths for each segment
  const crumbs = pathSegments.map((segment, index) => ({
    label: segment === 'app' ? 'Home' : formatSegment(segment),
    path: '/' + pathSegments.slice(0, index + 1).join('/'),
    isLast: index === pathSegments.length - 1,
  }));

  return (
    <nav className="flex items-center gap-1 text-sm">
      {crumbs.map((crumb, index) => (
        <React.Fragment key={crumb.path}>
          {index > 0 && (
            <ChevronRight size={14} className="text-white/25 shrink-0" />
          )}
          {crumb.isLast ? (
            <span className="text-white/80 font-medium flex items-center gap-1.5">
              {index === 0 && <Home size={14} className="text-white/50" />}
              {crumb.label}
            </span>
          ) : (
            <Link
              to={crumb.path}
              className={clsx(
                'text-white/40 hover:text-nexaproc-amber transition-colors flex items-center gap-1.5',
              )}
            >
              {index === 0 && <Home size={14} />}
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
