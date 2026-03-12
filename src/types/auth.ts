import type { ID, Timestamped } from './common';

export enum Role {
  Admin = 'admin',
  Engineer = 'engineer',
  Supervisor = 'supervisor',
  Operator = 'operator',
  Viewer = 'viewer',
}

export enum Permission {
  // Plant & monitoring
  ViewPlants = 'view:plants',
  ManagePlants = 'manage:plants',
  ViewEquipment = 'view:equipment',
  ManageEquipment = 'manage:equipment',
  ViewTags = 'view:tags',
  ManageTags = 'manage:tags',
  ViewAlarms = 'view:alarms',
  AcknowledgeAlarms = 'acknowledge:alarms',
  ManageAlarms = 'manage:alarms',

  // Operations
  ViewBatches = 'view:batches',
  ControlBatches = 'control:batches',
  ManageRecipes = 'manage:recipes',
  ViewSchedule = 'view:schedule',
  ManageSchedule = 'manage:schedule',
  IssueCommands = 'issue:commands',
  ManageSetpoints = 'manage:setpoints',
  ViewInterlocks = 'view:interlocks',
  ManageInterlocks = 'manage:interlocks',

  // Engineering
  ViewPid = 'view:pid',
  EditPid = 'edit:pid',
  ConfigureTags = 'configure:tags',
  ConfigureAlarms = 'configure:alarms',
  ConfigureEquipment = 'configure:equipment',
  ConfigureIO = 'configure:io',

  // Data
  ViewTrends = 'view:trends',
  ViewEvents = 'view:events',
  ViewAudit = 'view:audit',
  ExportData = 'export:data',

  // Quality
  ViewOee = 'view:oee',
  ViewBatchRecords = 'view:batch-records',
  ViewSpc = 'view:spc',
  ManageQualityGates = 'manage:quality-gates',

  // Maintenance
  ViewMaintenance = 'view:maintenance',
  ManageWorkOrders = 'manage:work-orders',
  ManagePmSchedule = 'manage:pm-schedule',
  ManageSpares = 'manage:spares',

  // AI
  ViewAiInsights = 'view:ai-insights',
  ConfigureAi = 'configure:ai',

  // Reports
  ViewReports = 'view:reports',
  CreateReports = 'create:reports',
  ManageScheduledReports = 'manage:scheduled-reports',

  // Admin
  ManageUsers = 'manage:users',
  ManageRoles = 'manage:roles',
  ManageSettings = 'manage:settings',
  ManageLicense = 'manage:license',
}

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.Admin]: Object.values(Permission),
  [Role.Engineer]: [
    Permission.ViewPlants, Permission.ManagePlants,
    Permission.ViewEquipment, Permission.ManageEquipment,
    Permission.ViewTags, Permission.ManageTags,
    Permission.ViewAlarms, Permission.AcknowledgeAlarms, Permission.ManageAlarms,
    Permission.ViewBatches, Permission.ControlBatches, Permission.ManageRecipes,
    Permission.ViewSchedule, Permission.ManageSchedule,
    Permission.IssueCommands, Permission.ManageSetpoints,
    Permission.ViewInterlocks, Permission.ManageInterlocks,
    Permission.ViewPid, Permission.EditPid,
    Permission.ConfigureTags, Permission.ConfigureAlarms,
    Permission.ConfigureEquipment, Permission.ConfigureIO,
    Permission.ViewTrends, Permission.ViewEvents, Permission.ViewAudit, Permission.ExportData,
    Permission.ViewOee, Permission.ViewBatchRecords, Permission.ViewSpc, Permission.ManageQualityGates,
    Permission.ViewMaintenance, Permission.ManageWorkOrders, Permission.ManagePmSchedule, Permission.ManageSpares,
    Permission.ViewAiInsights, Permission.ConfigureAi,
    Permission.ViewReports, Permission.CreateReports, Permission.ManageScheduledReports,
  ],
  [Role.Supervisor]: [
    Permission.ViewPlants,
    Permission.ViewEquipment,
    Permission.ViewTags,
    Permission.ViewAlarms, Permission.AcknowledgeAlarms,
    Permission.ViewBatches, Permission.ControlBatches,
    Permission.ViewSchedule, Permission.ManageSchedule,
    Permission.IssueCommands, Permission.ManageSetpoints,
    Permission.ViewInterlocks,
    Permission.ViewPid,
    Permission.ViewTrends, Permission.ViewEvents, Permission.ViewAudit, Permission.ExportData,
    Permission.ViewOee, Permission.ViewBatchRecords, Permission.ViewSpc,
    Permission.ViewMaintenance, Permission.ManageWorkOrders,
    Permission.ViewAiInsights,
    Permission.ViewReports, Permission.CreateReports,
  ],
  [Role.Operator]: [
    Permission.ViewPlants,
    Permission.ViewEquipment,
    Permission.ViewTags,
    Permission.ViewAlarms, Permission.AcknowledgeAlarms,
    Permission.ViewBatches, Permission.ControlBatches,
    Permission.ViewSchedule,
    Permission.IssueCommands,
    Permission.ViewInterlocks,
    Permission.ViewPid,
    Permission.ViewTrends, Permission.ViewEvents,
    Permission.ViewOee,
    Permission.ViewMaintenance,
    Permission.ViewAiInsights,
    Permission.ViewReports,
  ],
  [Role.Viewer]: [
    Permission.ViewPlants,
    Permission.ViewEquipment,
    Permission.ViewTags,
    Permission.ViewAlarms,
    Permission.ViewBatches,
    Permission.ViewSchedule,
    Permission.ViewInterlocks,
    Permission.ViewPid,
    Permission.ViewTrends, Permission.ViewEvents,
    Permission.ViewOee,
    Permission.ViewBatchRecords,
    Permission.ViewMaintenance,
    Permission.ViewAiInsights,
    Permission.ViewReports,
  ],
};

export interface User extends Timestamped {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  avatar?: string;
  department?: string;
  phone?: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: User;
  tokens: TokenPair;
}
