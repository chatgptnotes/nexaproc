import React, { forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, id, ...rest }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full rounded-lg border bg-scada-panel px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors duration-200',
              'focus:border-nexaproc-amber/50 focus:ring-1 focus:ring-nexaproc-amber/30',
              error
                ? 'border-alarm-critical/50'
                : 'border-scada-border hover:border-scada-border-hover',
              icon && 'pl-10',
              className,
            )}
            {...rest}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-alarm-critical">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
