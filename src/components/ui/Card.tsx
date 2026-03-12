import React from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerAction,
  children,
  className,
  noPadding = false,
}) => (
  <div
    className={clsx(
      'rounded-xl border border-scada-border bg-scada-panel/75 backdrop-blur-sm transition-colors duration-300 hover:border-nexaproc-green/35',
      className,
    )}
  >
    {(title || subtitle || headerAction) && (
      <div
        className={clsx(
          'flex items-start justify-between gap-4 border-b border-scada-border',
          noPadding ? 'px-5 py-4' : 'px-5 pt-5 pb-4',
        )}
      >
        <div>
          {title && (
            <h3 className="text-sm font-bold text-white">{title}</h3>
          )}
          {subtitle && (
            <p className="mt-0.5 text-xs text-white/50">{subtitle}</p>
          )}
        </div>
        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>
    )}
    <div className={clsx(!noPadding && 'p-5')}>{children}</div>
  </div>
);
