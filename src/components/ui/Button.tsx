import React from 'react';
import clsx from 'clsx';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-gradient-to-r from-nexaproc-amber to-nexaproc-orange text-white shadow-lg shadow-nexaproc-amber/25 hover:shadow-nexaproc-amber/40 hover:brightness-110',
  secondary:
    'border border-nexaproc-green/40 text-nexaproc-green bg-nexaproc-green/5 hover:bg-nexaproc-green/15 hover:border-nexaproc-green/60',
  danger:
    'bg-alarm-critical/15 border border-alarm-critical/30 text-alarm-critical hover:bg-alarm-critical/25 hover:border-alarm-critical/50',
  ghost:
    'bg-transparent text-white/70 hover:bg-white/5 hover:text-white',
};

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2 text-sm gap-2 rounded-lg',
  lg: 'px-6 py-3 text-base gap-2.5 rounded-xl',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className,
  ...rest
}) => (
  <button
    disabled={disabled || loading}
    className={clsx(
      'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nexaproc-amber/50 focus:ring-offset-2 focus:ring-offset-scada-dark',
      variantClasses[variant],
      sizeClasses[size],
      (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
      className,
    )}
    {...rest}
  >
    {loading ? (
      <Spinner size={size === 'lg' ? 'md' : 'sm'} />
    ) : icon ? (
      <span className="shrink-0">{icon}</span>
    ) : null}
    {children}
  </button>
);
