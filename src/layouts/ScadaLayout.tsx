import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { TopBar } from '@/components/navigation/TopBar';
import { useThemeStore } from '@/stores/useThemeStore';
import { useSocket } from '@/hooks/useSocket';
import { Toaster } from 'react-hot-toast';

export function ScadaLayout() {
  const collapsed = useThemeStore(s => s.sidebarCollapsed);
  useSocket();

  return (
    <div className="min-h-screen bg-scada-dark flex">
      <Sidebar />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        <TopBar />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" toastOptions={{ style: { background: '#0d2416', color: '#fff', border: '1px solid rgba(74,222,128,0.2)' } }} />
    </div>
  );
}
