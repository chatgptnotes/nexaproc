import React, { useState } from 'react';
import {
  Settings,
  Globe,
  Monitor,
  Bell,
  Lock,
  Database,
  Save,
} from 'lucide-react';

import { Card, Tabs, Button, Input, Select } from '@/components/ui';

/* ---------- Component ---------- */

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  // General settings
  const [plantName, setPlantName] = useState('NexaProc Main Facility');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [language, setLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('dd/MM/yyyy');
  const [unitSystem, setUnitSystem] = useState('metric');

  // Display settings
  const [theme, setTheme] = useState('dark');
  const [refreshRate, setRefreshRate] = useState('5');
  const [chartPoints, setChartPoints] = useState('100');
  const [decimalPlaces, setDecimalPlaces] = useState('2');

  // Notification settings
  const [smtpHost, setSmtpHost] = useState('smtp.nexaproc.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('alerts@nexaproc.com');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [alarmEmail, setAlarmEmail] = useState('true');
  const [alarmSms, setAlarmSms] = useState('false');

  // Security settings
  const [minPassword, setMinPassword] = useState('8');
  const [requireUppercase, setRequireUppercase] = useState('true');
  const [requireNumbers, setRequireNumbers] = useState('true');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [twoFactor, setTwoFactor] = useState('false');
  const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');

  // Data retention settings
  const [tagHistory, setTagHistory] = useState('365');
  const [alarmHistory, setAlarmHistory] = useState('730');
  const [auditTrail, setAuditTrail] = useState('5');
  const [autoCleanup, setAutoCleanup] = useState('true');

  const tabs = [
    { id: 'general', label: 'General', icon: <Globe className="w-4 h-4" /> },
    { id: 'display', label: 'Display', icon: <Monitor className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'retention', label: 'Data Retention', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-scada-dark p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Settings size={24} className="text-nexaproc-amber" />
        <div>
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Global system configuration and preferences
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* Tab Content */}
      {activeTab === 'general' && (
        <Card title="General Settings" subtitle="Plant-wide configuration" headerAction={
          <Button size="sm" icon={<Save className="w-4 h-4" />}>Save</Button>
        }>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
            <Input
              label="Plant Name"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
            />
            <Select
              label="Timezone"
              options={[
                { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST +05:30)' },
                { value: 'UTC', label: 'UTC' },
                { value: 'America/New_York', label: 'America/New_York (EST)' },
                { value: 'Europe/London', label: 'Europe/London (GMT)' },
                { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
              ]}
              value={timezone}
              onChange={setTimezone}
            />
            <Select
              label="Language"
              options={[
                { value: 'en', label: 'English' },
                { value: 'hi', label: 'Hindi' },
                { value: 'ta', label: 'Tamil' },
                { value: 'te', label: 'Telugu' },
              ]}
              value={language}
              onChange={setLanguage}
            />
            <Select
              label="Date Format"
              options={[
                { value: 'dd/MM/yyyy', label: 'dd/MM/yyyy' },
                { value: 'MM/dd/yyyy', label: 'MM/dd/yyyy' },
                { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
                { value: 'dd-MMM-yyyy', label: 'dd-MMM-yyyy' },
              ]}
              value={dateFormat}
              onChange={setDateFormat}
            />
            <Select
              label="Unit System"
              options={[
                { value: 'metric', label: 'Metric (SI)' },
                { value: 'imperial', label: 'Imperial' },
              ]}
              value={unitSystem}
              onChange={setUnitSystem}
            />
          </div>
        </Card>
      )}

      {activeTab === 'display' && (
        <Card title="Display Settings" subtitle="Visual preferences and performance" headerAction={
          <Button size="sm" icon={<Save className="w-4 h-4" />}>Save</Button>
        }>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
            <Select
              label="Theme"
              options={[
                { value: 'dark', label: 'Dark' },
                { value: 'light', label: 'Light' },
              ]}
              value={theme}
              onChange={setTheme}
            />
            <Select
              label="Refresh Rate"
              options={[
                { value: '1', label: '1 second' },
                { value: '2', label: '2 seconds' },
                { value: '5', label: '5 seconds' },
                { value: '10', label: '10 seconds' },
                { value: '30', label: '30 seconds' },
              ]}
              value={refreshRate}
              onChange={setRefreshRate}
            />
            <Select
              label="Chart Data Points"
              options={[
                { value: '50', label: '50 points' },
                { value: '100', label: '100 points' },
                { value: '200', label: '200 points' },
                { value: '500', label: '500 points' },
              ]}
              value={chartPoints}
              onChange={setChartPoints}
            />
            <Select
              label="Decimal Places"
              options={[
                { value: '0', label: '0 places' },
                { value: '1', label: '1 place' },
                { value: '2', label: '2 places' },
                { value: '3', label: '3 places' },
                { value: '4', label: '4 places' },
              ]}
              value={decimalPlaces}
              onChange={setDecimalPlaces}
            />
          </div>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card title="Notification Settings" subtitle="Email and alarm notification configuration" headerAction={
          <Button size="sm" icon={<Save className="w-4 h-4" />}>Save</Button>
        }>
          <div className="space-y-8 max-w-3xl">
            {/* SMTP Settings */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">SMTP Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="SMTP Host"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                />
                <Input
                  label="SMTP Port"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                />
                <Input
                  label="SMTP Username"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                />
                <Input
                  label="SMTP Password"
                  type="password"
                  value={smtpPassword}
                  onChange={(e) => setSmtpPassword(e.target.value)}
                  placeholder="Enter SMTP password"
                />
              </div>
            </div>

            {/* Alarm Notification Rules */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Alarm Notification Rules</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Email Notifications"
                  options={[
                    { value: 'true', label: 'Enabled' },
                    { value: 'false', label: 'Disabled' },
                  ]}
                  value={alarmEmail}
                  onChange={setAlarmEmail}
                />
                <Select
                  label="SMS Notifications"
                  options={[
                    { value: 'true', label: 'Enabled' },
                    { value: 'false', label: 'Disabled' },
                  ]}
                  value={alarmSms}
                  onChange={setAlarmSms}
                />
              </div>
              <div className="mt-4 space-y-2">
                <p className="text-xs text-gray-500 mb-2">Notification rules by priority:</p>
                {[
                  { priority: 'Critical', email: true, sms: true, escalate: '5 min' },
                  { priority: 'High', email: true, sms: true, escalate: '15 min' },
                  { priority: 'Medium', email: true, sms: false, escalate: '30 min' },
                  { priority: 'Low', email: false, sms: false, escalate: 'None' },
                ].map((rule) => (
                  <div key={rule.priority} className="flex items-center justify-between rounded bg-white/5 px-4 py-2.5 text-xs">
                    <span className="text-white/80 font-medium w-20">{rule.priority}</span>
                    <span className={rule.email ? 'text-status-running' : 'text-gray-600'}>
                      Email: {rule.email ? 'Yes' : 'No'}
                    </span>
                    <span className={rule.sms ? 'text-status-running' : 'text-gray-600'}>
                      SMS: {rule.sms ? 'Yes' : 'No'}
                    </span>
                    <span className="text-gray-500">Escalate: {rule.escalate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card title="Security Settings" subtitle="Authentication and access policies" headerAction={
          <Button size="sm" icon={<Save className="w-4 h-4" />}>Save</Button>
        }>
          <div className="space-y-8 max-w-3xl">
            {/* Password Policy */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Password Policy</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Minimum Password Length"
                  options={[
                    { value: '6', label: '6 characters' },
                    { value: '8', label: '8 characters' },
                    { value: '10', label: '10 characters' },
                    { value: '12', label: '12 characters' },
                  ]}
                  value={minPassword}
                  onChange={setMinPassword}
                />
                <Select
                  label="Require Uppercase"
                  options={[
                    { value: 'true', label: 'Required' },
                    { value: 'false', label: 'Not Required' },
                  ]}
                  value={requireUppercase}
                  onChange={setRequireUppercase}
                />
                <Select
                  label="Require Numbers"
                  options={[
                    { value: 'true', label: 'Required' },
                    { value: 'false', label: 'Not Required' },
                  ]}
                  value={requireNumbers}
                  onChange={setRequireNumbers}
                />
              </div>
            </div>

            {/* Session & Login */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Session & Login</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Session Timeout"
                  options={[
                    { value: '15', label: '15 minutes' },
                    { value: '30', label: '30 minutes' },
                    { value: '60', label: '1 hour' },
                    { value: '120', label: '2 hours' },
                    { value: '480', label: '8 hours' },
                  ]}
                  value={sessionTimeout}
                  onChange={setSessionTimeout}
                />
                <Select
                  label="Two-Factor Authentication"
                  options={[
                    { value: 'true', label: 'Enabled' },
                    { value: 'false', label: 'Disabled' },
                  ]}
                  value={twoFactor}
                  onChange={setTwoFactor}
                />
                <Select
                  label="Max Login Attempts"
                  options={[
                    { value: '3', label: '3 attempts' },
                    { value: '5', label: '5 attempts' },
                    { value: '10', label: '10 attempts' },
                  ]}
                  value={maxLoginAttempts}
                  onChange={setMaxLoginAttempts}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'retention' && (
        <Card title="Data Retention Settings" subtitle="Configure how long data is stored" headerAction={
          <Button size="sm" icon={<Save className="w-4 h-4" />}>Save</Button>
        }>
          <div className="space-y-8 max-w-3xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Select
                label="Tag History Retention"
                options={[
                  { value: '90', label: '90 days' },
                  { value: '180', label: '180 days' },
                  { value: '365', label: '365 days (1 year)' },
                  { value: '730', label: '730 days (2 years)' },
                  { value: '1825', label: '1825 days (5 years)' },
                ]}
                value={tagHistory}
                onChange={setTagHistory}
              />
              <Select
                label="Alarm History Retention"
                options={[
                  { value: '365', label: '365 days (1 year)' },
                  { value: '730', label: '730 days (2 years)' },
                  { value: '1825', label: '1825 days (5 years)' },
                ]}
                value={alarmHistory}
                onChange={setAlarmHistory}
              />
              <Select
                label="Audit Trail Retention"
                options={[
                  { value: '1', label: '1 year' },
                  { value: '3', label: '3 years' },
                  { value: '5', label: '5 years' },
                  { value: '7', label: '7 years' },
                  { value: '10', label: '10 years' },
                ]}
                value={auditTrail}
                onChange={setAuditTrail}
              />
              <Select
                label="Auto-Cleanup"
                options={[
                  { value: 'true', label: 'Enabled' },
                  { value: 'false', label: 'Disabled' },
                ]}
                value={autoCleanup}
                onChange={setAutoCleanup}
              />
            </div>

            {/* Storage Info */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Storage Usage</h3>
              <div className="space-y-3">
                {[
                  { label: 'Tag History', used: 12.4, total: 50, color: '#4ade80' },
                  { label: 'Alarm History', used: 3.2, total: 10, color: '#fbbf24' },
                  { label: 'Audit Trail', used: 1.8, total: 5, color: '#0d9488' },
                  { label: 'Reports Archive', used: 4.1, total: 20, color: '#f97316' },
                ].map((item) => (
                  <div key={item.label} className="rounded bg-white/5 px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/80">{item.label}</span>
                      <span className="text-xs text-gray-500">
                        {item.used} GB / {item.total} GB
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${(item.used / item.total) * 100}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
