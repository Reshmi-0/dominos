import { NavLink } from 'react-router-dom';
import { Home, ClipboardList, BarChart3, Settings } from 'lucide-react';
import logo from '../../assets/logo-dominos.webp';

const navItems = [
  { name: 'Overview', path: '/', icon: Home },
  { name: 'Total Orders', path: '/orders', icon: ClipboardList },
  { name: 'Sales Report', path: '/sales-report', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-navy-900 text-white flex flex-col">
      <div className="h-20 flex items-center gap-3 px-6">
        {/* Placeholder for the logo if we want to show it in the sidebar on smaller screens, 
            but PRD says "Sidebar Nav — Logo omitted here (lives in header only)", wait no...
            PRD says "Sidebar Nav — Logo omitted here (lives in header only)..." 
            But layout section says "Header bar spans the full width above the content area (sidebar logo sits in its own top-left slot, separate from the header's right-aligned identity block - see screenshots)." 
            So logo is in top-left of sidebar actually. */}
        <img src={logo} alt="Domino's Logo" className="h-8 object-contain" />
        <span className="text-[20px] font-bold tracking-tight text-white">Domino's</span>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-primary-blue text-white'
                    : 'text-gray-400 hover:bg-navy-800 hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              <span className="font-medium text-[14px]">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
