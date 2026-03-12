import React from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder,
  className,
}) => {
  const selectId = label ? label.toLowerCase().replace(/\s+/g, '-') : undefined;

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/60"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={clsx(
            'w-full appearance-none rounded-lg border border-scada-border bg-scada-panel px-3 py-2 pr-9 text-sm text-white outline-none transition-colors duration-200',
            'hover:border-scada-border-hover focus:border-nexaproc-amber/50 focus:ring-1 focus:ring-nexaproc-amber/30',
            !value && 'text-white/30',
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-scada-panel text-white"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-white/40">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};
