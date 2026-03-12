import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  ChevronDown,
  ChevronRight,
  Factory,
  LayoutDashboard,
  Monitor,
  Play,
  Wrench,
  Database,
  ShieldCheck,
  Hammer,
  Brain,
  FileBarChart,
  Shield,
  Cpu,
  ScreenShare,
  TrendingUp,
  Tags,
  Bell,
  Layers,
  BookOpen,
  Calendar,
  Terminal,
  SlidersHorizontal,
  Lock,
  PenTool,
  Settings2,
  BellRing,
  Cog,
  Building2,
  Cable,
  LineChart,
  ScrollText,
  BellOff,
  ClipboardList,
  Download,
  Radio,
  Gauge,
  FileText,
  BarChart3,
  CheckSquare,
  ClipboardCheck,
  CalendarClock,
  Package,
  Activity,
  AlertTriangle,
  Sparkles,
  Zap,
  FilePlus,
  CalendarDays,
  Clock,
  Users,
  KeyRound,
  Settings,
  BadgeCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { NAVIGATION, type NavGroup } from '@/config/navigation';
import { useThemeStore } from '@/stores/useThemeStore';

// Map icon name strings from navigation config to actual lucide components
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Monitor,
  Play,
  Wrench,
  Database,
  ShieldCheck,
  Hammer,
  Brain,
  FileBarChart,
  Shield,
  Factory,
  Cpu,
  ScreenShare,
  TrendingUp,
  Tags,
  Bell,
  Layers,
  BookOpen,
  Calendar,
  Terminal,
  SlidersHorizontal,
  Lock,
  PenTool,
  Settings2,
  BellRing,
  Cog,
  Building2,
  Cable,
  LineChart,
  ScrollText,
  BellOff,
  ClipboardList,
  Download,
  Radio,
  Gauge,
  FileText,
  BarChart3,
  CheckSquare,
  ClipboardCheck,
  CalendarClock,
  Package,
  Activity,
  AlertTriangle,
  Sparkles,
  Zap,
  FilePlus,
  CalendarDays,
  Clock,
  Users,
  KeyRound,
  Settings,
  BadgeCheck,
};

function getIcon(name: string): LucideIcon {
  return iconMap[name] || LayoutDashboard;
}

interface NavGroupSectionProps {
  group: NavGroup;
  collapsed: boolean;
}

const NavGroupSection: React.FC<NavGroupSectionProps> = ({ group, collapsed }) => {
  const location = useLocation();
  const isGroupActive = group.items.some(
    (item) => location.pathname === item.path || location.pathname.startsWith(item.path + '/'),
  );
  const [open, setOpen] = useState(isGroupActive);

  const GroupIcon = getIcon(group.icon);

  // In collapsed mode, just show the group icon
  if (collapsed) {
    return (
      <div className="mb-1">
        {/* Group icon — tooltip shows group name */}
        <div className="group relative flex justify-center py-1">
          <div
            className={clsx(
              'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
              isGroupActive
                ? 'bg-nexaproc-amber/15 text-nexaproc-amber'
                : 'text-white/40 hover:bg-white/5 hover:text-white/70',
            )}
          >
            <GroupIcon size={18} />
          </div>
          {/* Tooltip */}
          <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-scada-panel border border-scada-border px-3 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
            {group.name}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-1">
      {/* Group header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors',
          isGroupActive
            ? 'text-nexaproc-amber/90'
            : 'text-white/35 hover:text-white/60',
        )}
      >
        <GroupIcon size={15} className="shrink-0" />
        <span className="flex-1 text-left">{group.name}</span>
        {open ? (
          <ChevronDown size={14} className="shrink-0 text-white/25" />
        ) : (
          <ChevronRight size={14} className="shrink-0 text-white/25" />
        )}
      </button>

      {/* Items */}
      {open && (
        <div className="mt-0.5 space-y-0.5 pl-2">
          {group.items.map((item) => {
            const ItemIcon = getIcon(item.icon);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/app'}
                className={({ isActive }) =>
                  clsx(
                    'group relative flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors',
                    isActive
                      ? 'bg-nexaproc-amber/10 text-nexaproc-amber font-medium'
                      : 'text-white/55 hover:bg-white/5 hover:text-white/80',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Left border indicator for active item */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-nexaproc-amber" />
                    )}
                    <ItemIcon size={15} className="shrink-0" />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC = () => {
  const collapsed = useThemeStore((s) => s.sidebarCollapsed);

  return (
    <aside
      className={clsx(
        'flex h-screen flex-col border-r border-scada-border bg-scada-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div
        className={clsx(
          'flex h-14 shrink-0 items-center border-b border-scada-border px-3',
          collapsed ? 'justify-center' : 'gap-2.5',
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-nexaproc-amber to-nexaproc-orange shadow-lg shadow-nexaproc-amber/25">
          <Factory size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex items-baseline gap-1.5 overflow-hidden">
            <span className="bg-gradient-to-r from-nexaproc-gold to-nexaproc-amber bg-clip-text text-lg font-black text-transparent">
              NexaProc
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-nexaproc-green">
              SCADA
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-3 scrollbar-thin">
        {NAVIGATION.map((group) => (
          <NavGroupSection
            key={group.name}
            group={group}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Bottom version indicator */}
      <div
        className={clsx(
          'shrink-0 border-t border-scada-border px-3 py-2.5',
          collapsed ? 'text-center' : '',
        )}
      >
        {collapsed ? (
          <span className="text-[9px] font-bold text-white/15">v2</span>
        ) : (
          <p className="text-[10px] text-white/15">
            NexaProc SCADA v2.0
          </p>
        )}
      </div>
    </aside>
  );
};
