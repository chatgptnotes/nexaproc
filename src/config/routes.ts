export const ROUTES = {
  // Public
  HOME: '/',
  FEATURES: '/features',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',

  // App root
  APP: '/app',
  DASHBOARD: '/app',
  PROJECTS: '/app/projects',
  PROJECT_SCREENS: '/app/projects/:projectId/screens',
  SCREEN_EDITOR: '/app/projects/:projectId/screens/:screenId/edit',
  SCREEN_VIEWER: '/app/projects/:projectId/screens/:screenId/view',

  // Monitoring
  PLANTS: '/app/monitoring/plants',
  MIMIC: '/app/monitoring/mimic',
  EQUIPMENT_STATUS: '/app/monitoring/equipment',
  LIVE_TRENDS: '/app/monitoring/trends',
  TAG_BROWSER: '/app/monitoring/tags',
  ALARM_MONITOR: '/app/monitoring/alarms',

  // Operations
  BATCH_CONTROL: '/app/operations/batch',
  RECIPES: '/app/operations/recipes',
  PRODUCTION_SCHEDULE: '/app/operations/schedule',
  MANUAL_COMMANDS: '/app/operations/commands',
  SETPOINT_MANAGER: '/app/operations/setpoints',
  INTERLOCK_STATUS: '/app/operations/interlocks',

  // Engineering
  PID_EDITOR: '/app/engineering/pid-editor',
  TAG_CONFIG: '/app/engineering/tags',
  ALARM_CONFIG: '/app/engineering/alarms',
  EQUIPMENT_CONFIG: '/app/engineering/equipment',
  PLANT_CONFIG: '/app/engineering/plants',
  IO_CONFIG: '/app/engineering/io-mapping',
  SYMBOL_LIBRARY: '/app/engineering/symbols',

  // Data & History
  HISTORICAL_TRENDS: '/app/data/trends',
  EVENT_LOG: '/app/data/events',
  ALARM_HISTORY: '/app/data/alarm-history',
  AUDIT_TRAIL: '/app/data/audit',
  DATA_EXPORT: '/app/data/export',
  COMMUNICATION: '/app/data/communication',

  // Quality
  OEE: '/app/quality/oee',
  BATCH_RECORDS: '/app/quality/batch-records',
  SPC: '/app/quality/spc',
  QUALITY_GATES: '/app/quality/gates',

  // Maintenance
  MAINTENANCE: '/app/maintenance',
  WORK_ORDERS: '/app/maintenance/work-orders',
  PM_SCHEDULE: '/app/maintenance/schedule',
  SPARE_PARTS: '/app/maintenance/spares',

  // AI & Analytics
  PREDICTIVE: '/app/ai/predictive',
  ANOMALY: '/app/ai/anomaly',
  OPTIMIZATION: '/app/ai/optimization',
  ENERGY: '/app/ai/energy',

  // Reports
  REPORT_BUILDER: '/app/reports/builder',
  SCHEDULED_REPORTS: '/app/reports/scheduled',
  SHIFT_REPORTS: '/app/reports/shift',

  // Admin
  USERS: '/app/admin/users',
  ROLES: '/app/admin/roles',
  SETTINGS: '/app/admin/settings',
  LICENSE: '/app/admin/license',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
