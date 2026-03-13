import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MarketingLayout } from '@/layouts/MarketingLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ScadaLayout } from '@/layouts/ScadaLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Spinner } from '@/components/ui';

// ─── Public pages ────────────────────────────────────────────────────────────
const LandingPage = lazy(() => import('@/pages/public/LandingPage'));
const FeaturesPage = lazy(() => import('@/pages/public/FeaturesPage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));

// ─── Auth pages ──────────────────────────────────────────────────────────────
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));

// ─── SCADA pages (lazy loaded) ──────────────────────────────────────────────

// Dashboard & Projects
const DashboardPage = lazy(() => import('@/pages/app/DashboardPage'));
const ProjectsPage = lazy(() => import('@/pages/app/ProjectsPage'));

// Monitoring
const PlantsPage = lazy(() => import('@/pages/app/monitoring/PlantsPage'));
const MimicPage = lazy(() => import('@/pages/app/monitoring/MimicPage'));
const EquipmentStatusPage = lazy(() => import('@/pages/app/monitoring/EquipmentStatusPage'));
const LiveTrendsPage = lazy(() => import('@/pages/app/monitoring/LiveTrendsPage'));
const TagBrowserPage = lazy(() => import('@/pages/app/monitoring/TagBrowserPage'));
const AlarmMonitorPage = lazy(() => import('@/pages/app/monitoring/AlarmMonitorPage'));

// Operations
const BatchControlPage = lazy(() => import('@/pages/app/operations/BatchControlPage'));
const RecipesPage = lazy(() => import('@/pages/app/operations/RecipesPage'));
const ProductionSchedulePage = lazy(() => import('@/pages/app/operations/ProductionSchedulePage'));
const ManualCommandsPage = lazy(() => import('@/pages/app/operations/ManualCommandsPage'));
const SetpointManagerPage = lazy(() => import('@/pages/app/operations/SetpointManagerPage'));
const InterlockStatusPage = lazy(() => import('@/pages/app/operations/InterlockStatusPage'));

// Engineering
const PidEditorPage = lazy(() => import('@/pages/app/engineering/PidEditorPage'));
const TagConfigPage = lazy(() => import('@/pages/app/engineering/TagConfigPage'));
const AlarmConfigPage = lazy(() => import('@/pages/app/engineering/AlarmConfigPage'));
const EquipmentConfigPage = lazy(() => import('@/pages/app/engineering/EquipmentConfigPage'));
const PlantConfigPage = lazy(() => import('@/pages/app/engineering/PlantConfigPage'));
const IoMappingPage = lazy(() => import('@/pages/app/engineering/IoMappingPage'));
const SymbolLibraryPage = lazy(() => import('@/pages/app/engineering/SymbolLibraryPage'));

// Data & History
const HistoricalTrendsPage = lazy(() => import('@/pages/app/data/HistoricalTrendsPage'));
const EventLogPage = lazy(() => import('@/pages/app/data/EventLogPage'));
const AlarmHistoryPage = lazy(() => import('@/pages/app/data/AlarmHistoryPage'));
const AuditTrailPage = lazy(() => import('@/pages/app/data/AuditTrailPage'));
const DataExportPage = lazy(() => import('@/pages/app/data/DataExportPage'));
const CommunicationPage = lazy(() => import('@/pages/app/data/CommunicationPage'));

// Quality
const OeePage = lazy(() => import('@/pages/app/quality/OeePage'));
const BatchRecordsPage = lazy(() => import('@/pages/app/quality/BatchRecordsPage'));
const SpcPage = lazy(() => import('@/pages/app/quality/SpcPage'));
const QualityGatesPage = lazy(() => import('@/pages/app/quality/QualityGatesPage'));

// Maintenance
const MaintenancePage = lazy(() => import('@/pages/app/maintenance/MaintenancePage'));
const WorkOrdersPage = lazy(() => import('@/pages/app/maintenance/WorkOrdersPage'));
const PmSchedulePage = lazy(() => import('@/pages/app/maintenance/PmSchedulePage'));
const SparePartsPage = lazy(() => import('@/pages/app/maintenance/SparePartsPage'));

// AI & Analytics
const PredictivePage = lazy(() => import('@/pages/app/ai/PredictivePage'));
const AnomalyPage = lazy(() => import('@/pages/app/ai/AnomalyPage'));
const OptimizationPage = lazy(() => import('@/pages/app/ai/OptimizationPage'));
const EnergyPage = lazy(() => import('@/pages/app/ai/EnergyPage'));

// Reports
const ReportBuilderPage = lazy(() => import('@/pages/app/reports/ReportBuilderPage'));
const ScheduledReportsPage = lazy(() => import('@/pages/app/reports/ScheduledReportsPage'));
const ShiftReportsPage = lazy(() => import('@/pages/app/reports/ShiftReportsPage'));

// Administration
const UsersPage = lazy(() => import('@/pages/app/admin/UsersPage'));
const RolesPage = lazy(() => import('@/pages/app/admin/RolesPage'));
const SettingsPage = lazy(() => import('@/pages/app/admin/SettingsPage'));
const LicensePage = lazy(() => import('@/pages/app/admin/LicensePage'));

// ─── Loading fallback ────────────────────────────────────────────────────────
function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-scada-dark">
      <Spinner size="lg" />
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* ── Public / Marketing ──────────────────────────────────────── */}
        <Route element={<MarketingLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>

        {/* ── Auth ────────────────────────────────────────────────────── */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* ── Protected SCADA Application ─────────────────────────────── */}
        <Route element={<ProtectedRoute />}>
          <Route path="app" element={<ScadaLayout />}>
            {/* Dashboard & Projects */}
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />

            {/* Monitoring */}
            <Route path="monitoring/plants" element={<PlantsPage />} />
            <Route path="monitoring/mimic" element={<MimicPage />} />
            <Route path="monitoring/equipment" element={<EquipmentStatusPage />} />
            <Route path="monitoring/trends" element={<LiveTrendsPage />} />
            <Route path="monitoring/tags" element={<TagBrowserPage />} />
            <Route path="monitoring/alarms" element={<AlarmMonitorPage />} />

            {/* Operations */}
            <Route path="operations/batch" element={<BatchControlPage />} />
            <Route path="operations/recipes" element={<RecipesPage />} />
            <Route path="operations/schedule" element={<ProductionSchedulePage />} />
            <Route path="operations/commands" element={<ManualCommandsPage />} />
            <Route path="operations/setpoints" element={<SetpointManagerPage />} />
            <Route path="operations/interlocks" element={<InterlockStatusPage />} />

            {/* Engineering */}
            <Route path="engineering/pid-editor" element={<PidEditorPage />} />
            <Route path="engineering/tags" element={<TagConfigPage />} />
            <Route path="engineering/alarms" element={<AlarmConfigPage />} />
            <Route path="engineering/equipment" element={<EquipmentConfigPage />} />
            <Route path="engineering/plants" element={<PlantConfigPage />} />
            <Route path="engineering/io-mapping" element={<IoMappingPage />} />
            <Route path="engineering/symbols" element={<SymbolLibraryPage />} />

            {/* Data & History */}
            <Route path="data/trends" element={<HistoricalTrendsPage />} />
            <Route path="data/events" element={<EventLogPage />} />
            <Route path="data/alarm-history" element={<AlarmHistoryPage />} />
            <Route path="data/audit" element={<AuditTrailPage />} />
            <Route path="data/export" element={<DataExportPage />} />
            <Route path="data/communication" element={<CommunicationPage />} />

            {/* Quality */}
            <Route path="quality/oee" element={<OeePage />} />
            <Route path="quality/batch-records" element={<BatchRecordsPage />} />
            <Route path="quality/spc" element={<SpcPage />} />
            <Route path="quality/gates" element={<QualityGatesPage />} />

            {/* Maintenance */}
            <Route path="maintenance" element={<MaintenancePage />} />
            <Route path="maintenance/work-orders" element={<WorkOrdersPage />} />
            <Route path="maintenance/schedule" element={<PmSchedulePage />} />
            <Route path="maintenance/spares" element={<SparePartsPage />} />

            {/* AI & Analytics */}
            <Route path="ai/predictive" element={<PredictivePage />} />
            <Route path="ai/anomaly" element={<AnomalyPage />} />
            <Route path="ai/optimization" element={<OptimizationPage />} />
            <Route path="ai/energy" element={<EnergyPage />} />

            {/* Reports */}
            <Route path="reports/builder" element={<ReportBuilderPage />} />
            <Route path="reports/scheduled" element={<ScheduledReportsPage />} />
            <Route path="reports/shift" element={<ShiftReportsPage />} />

            {/* Administration */}
            <Route path="admin/users" element={<UsersPage />} />
            <Route path="admin/roles" element={<RolesPage />} />
            <Route path="admin/settings" element={<SettingsPage />} />
            <Route path="admin/license" element={<LicensePage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
