import { ROUTES } from './routes';

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  adminOnly?: boolean;
}

export interface NavGroup {
  name: string;
  icon: string;
  items: NavItem[];
}

export const NAVIGATION: NavGroup[] = [
  {
    name: 'Overview',
    icon: 'LayoutDashboard',
    items: [
      { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
    ],
  },
  {
    name: 'Monitoring',
    icon: 'Monitor',
    items: [
      { label: 'Plant Overview', path: ROUTES.PLANTS, icon: 'Factory' },
      { label: 'Mimic Diagrams', path: ROUTES.MIMIC, icon: 'ScreenShare' },
      { label: 'Equipment Status', path: ROUTES.EQUIPMENT_STATUS, icon: 'Cpu' },
      { label: 'Live Trends', path: ROUTES.LIVE_TRENDS, icon: 'TrendingUp' },
      { label: 'Tag Browser', path: ROUTES.TAG_BROWSER, icon: 'Tags' },
      { label: 'Alarm Monitor', path: ROUTES.ALARM_MONITOR, icon: 'Bell' },
    ],
  },
  {
    name: 'Operations',
    icon: 'Play',
    items: [
      { label: 'Batch Control', path: ROUTES.BATCH_CONTROL, icon: 'Layers' },
      { label: 'Recipes', path: ROUTES.RECIPES, icon: 'BookOpen' },
      { label: 'Production Schedule', path: ROUTES.PRODUCTION_SCHEDULE, icon: 'Calendar' },
      { label: 'Manual Commands', path: ROUTES.MANUAL_COMMANDS, icon: 'Terminal' },
      { label: 'Setpoint Manager', path: ROUTES.SETPOINT_MANAGER, icon: 'SlidersHorizontal' },
      { label: 'Interlock Status', path: ROUTES.INTERLOCK_STATUS, icon: 'Lock' },
    ],
  },
  {
    name: 'Engineering',
    icon: 'Wrench',
    items: [
      { label: 'P&ID Editor', path: ROUTES.PID_EDITOR, icon: 'PenTool' },
      { label: 'Tag Configuration', path: ROUTES.TAG_CONFIG, icon: 'Settings2' },
      { label: 'Alarm Configuration', path: ROUTES.ALARM_CONFIG, icon: 'BellRing' },
      { label: 'Equipment Config', path: ROUTES.EQUIPMENT_CONFIG, icon: 'Cog' },
      { label: 'Plant Config', path: ROUTES.PLANT_CONFIG, icon: 'Building2' },
      { label: 'I/O Mapping', path: ROUTES.IO_CONFIG, icon: 'Cable' },
      { label: 'Symbol Library', path: ROUTES.SYMBOL_LIBRARY, icon: 'Shapes' },
    ],
  },
  {
    name: 'Data & History',
    icon: 'Database',
    items: [
      { label: 'Historical Trends', path: ROUTES.HISTORICAL_TRENDS, icon: 'LineChart' },
      { label: 'Event Log', path: ROUTES.EVENT_LOG, icon: 'ScrollText' },
      { label: 'Alarm History', path: ROUTES.ALARM_HISTORY, icon: 'BellOff' },
      { label: 'Audit Trail', path: ROUTES.AUDIT_TRAIL, icon: 'ClipboardList' },
      { label: 'Data Export', path: ROUTES.DATA_EXPORT, icon: 'Download' },
      { label: 'Communication', path: ROUTES.COMMUNICATION, icon: 'Radio' },
    ],
  },
  {
    name: 'Quality',
    icon: 'ShieldCheck',
    items: [
      { label: 'OEE Dashboard', path: ROUTES.OEE, icon: 'Gauge' },
      { label: 'Batch Records', path: ROUTES.BATCH_RECORDS, icon: 'FileText' },
      { label: 'SPC Charts', path: ROUTES.SPC, icon: 'BarChart3' },
      { label: 'Quality Gates', path: ROUTES.QUALITY_GATES, icon: 'CheckSquare' },
    ],
  },
  {
    name: 'Maintenance',
    icon: 'Hammer',
    items: [
      { label: 'Overview', path: ROUTES.MAINTENANCE, icon: 'Hammer' },
      { label: 'Work Orders', path: ROUTES.WORK_ORDERS, icon: 'ClipboardCheck' },
      { label: 'PM Schedule', path: ROUTES.PM_SCHEDULE, icon: 'CalendarClock' },
      { label: 'Spare Parts', path: ROUTES.SPARE_PARTS, icon: 'Package' },
    ],
  },
  {
    name: 'AI & Analytics',
    icon: 'Brain',
    items: [
      { label: 'Predictive Maintenance', path: ROUTES.PREDICTIVE, icon: 'Activity' },
      { label: 'Anomaly Detection', path: ROUTES.ANOMALY, icon: 'AlertTriangle' },
      { label: 'Process Optimization', path: ROUTES.OPTIMIZATION, icon: 'Sparkles' },
      { label: 'Energy Management', path: ROUTES.ENERGY, icon: 'Zap' },
    ],
  },
  {
    name: 'Reports',
    icon: 'FileBarChart',
    items: [
      { label: 'Report Builder', path: ROUTES.REPORT_BUILDER, icon: 'FilePlus' },
      { label: 'Scheduled Reports', path: ROUTES.SCHEDULED_REPORTS, icon: 'CalendarDays' },
      { label: 'Shift Reports', path: ROUTES.SHIFT_REPORTS, icon: 'Clock' },
    ],
  },
  {
    name: 'Administration',
    icon: 'Shield',
    items: [
      { label: 'User Management', path: ROUTES.USERS, icon: 'Users', adminOnly: true },
      { label: 'Roles & Permissions', path: ROUTES.ROLES, icon: 'KeyRound', adminOnly: true },
      { label: 'System Settings', path: ROUTES.SETTINGS, icon: 'Settings', adminOnly: true },
      { label: 'License', path: ROUTES.LICENSE, icon: 'BadgeCheck', adminOnly: true },
    ],
  },
];
