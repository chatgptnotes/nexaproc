import { Outlet } from 'react-router-dom';
import { NavBar, Footer } from '@/components/marketing';
import { C } from '@/config/constants';

export function MarketingLayout() {
  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: C.bg, color: C.white, minHeight: '100vh' }}>
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}
