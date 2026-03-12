import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { Menu, Bell, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useThemeStore } from '@/stores/useThemeStore';
import { Breadcrumbs } from './Breadcrumbs';

export const TopBar: React.FC = () => {
  const toggleSidebar = useThemeStore((s) => s.toggleSidebar);
  const [alarmCount] = useState(3);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="flex h-14 items-center justify-between border-b border-scada-border bg-scada-dark/95 px-4 backdrop-blur-sm">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <Breadcrumbs />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Alarm bell */}
        <button className="relative rounded-lg p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white">
          <Bell size={20} />
          {alarmCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-alarm-critical px-1 text-[10px] font-bold text-white">
              {alarmCount}
            </span>
          )}
        </button>

        {/* User dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-nexaproc-amber/20 text-nexaproc-amber">
              <User size={16} />
            </div>
            <span className="hidden text-sm font-medium sm:inline">Operator</span>
            <ChevronDown
              size={14}
              className={clsx(
                'transition-transform duration-200',
                dropdownOpen && 'rotate-180',
              )}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-48 overflow-hidden rounded-lg border border-scada-border bg-scada-panel shadow-xl shadow-black/40">
              <div className="border-b border-scada-border px-4 py-3">
                <p className="text-sm font-semibold text-white">Operator</p>
                <p className="text-xs text-white/40">operator@plant.local</p>
              </div>
              <div className="py-1">
                {[
                  { icon: <User size={15} />, label: 'Profile' },
                  { icon: <Settings size={15} />, label: 'Settings' },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="border-t border-scada-border py-1">
                <button
                  className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-alarm-critical/80 transition-colors hover:bg-alarm-critical/10 hover:text-alarm-critical"
                  onClick={() => setDropdownOpen(false)}
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
