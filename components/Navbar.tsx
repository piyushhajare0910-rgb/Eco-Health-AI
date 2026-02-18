
import React from 'react';
import { LayoutDashboard, Search, Upload, History, Info, Moon, Sun, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isDark, setIsDark }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Area', icon: Search },
    { id: 'upload', label: 'Upload Data', icon: Upload },
    { id: 'history', label: 'Prediction History', icon: History },
    { id: 'about', label: 'About Project', icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500 rounded-lg">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight hidden md:block">EcoHealth<span className="text-emerald-500">AI</span></span>
        </div>

        <div className="flex items-center gap-1 md:gap-4">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-emerald-500'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200 mx-2" />

          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
