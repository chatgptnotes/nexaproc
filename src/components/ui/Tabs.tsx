import React from 'react';
import clsx from 'clsx';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => (
  <div
    className={clsx(
      'flex gap-0 border-b border-scada-border',
      className,
    )}
  >
    {tabs.map((tab) => {
      const isActive = tab.id === activeTab;
      return (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200 outline-none',
            isActive
              ? 'text-nexaproc-amber'
              : 'text-white/50 hover:text-white/80',
          )}
        >
          {tab.icon && <span className="shrink-0">{tab.icon}</span>}
          {tab.label}
          {isActive && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-nexaproc-amber" />
          )}
        </button>
      );
    })}
  </div>
);
