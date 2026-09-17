import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function PageShell() {
  const location = useLocation();
  const isSettings = location.pathname === '/settings';

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header showDateFilter={!isSettings} />
        <main className="p-8 flex-1 overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
