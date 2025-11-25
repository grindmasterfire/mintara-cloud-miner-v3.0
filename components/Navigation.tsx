import React from 'react';
import { ViewState } from '../types';
import { 
  LayoutDashboard, 
  Pickaxe, 
  ArrowRightLeft, 
  Landmark, 
  Lock, 
  Cpu, 
  Menu,
  X
} from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  currentView, 
  onChangeView,
  isMobileMenuOpen,
  toggleMobileMenu
}) => {
  const navItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.MINING, label: 'Cloud Miner', icon: Pickaxe },
    { id: ViewState.MARKETPLACE, label: 'PF Swap', icon: ArrowRightLeft },
    { id: ViewState.TREASURY, label: 'Treasury', icon: Landmark },
    { id: ViewState.STAKING, label: 'Permafrost', icon: Lock },
  ];

  const renderNavItems = () => (
    <ul className="space-y-2 font-display">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <li key={item.id}>
            <button
              onClick={() => {
                onChangeView(item.id);
                if (window.innerWidth < 768) toggleMobileMenu();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 border ${
                isActive 
                  ? 'bg-mint-500/10 border-mint-500 text-mint-400 neon-text-mint' 
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-mint-500' : ''} />
              <span className="font-medium tracking-wide text-lg">{item.label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-dark-950/90 backdrop-blur-md p-4 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2 text-mint-500">
          <Cpu className="w-6 h-6" />
          <span className="font-display font-bold text-xl tracking-wider text-white">MINTARA</span>
        </div>
        <button onClick={toggleMobileMenu} className="text-white p-2">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 bg-dark-950 border-r border-slate-800 transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        md:block pt-20 md:pt-0
      `}>
        <div className="flex flex-col h-full p-6">
          {/* Logo Area */}
          <div className="hidden md:flex items-center gap-2 mb-10">
            <div className="bg-mint-500/20 p-2 rounded-lg border border-mint-500/50">
                <Cpu className="w-6 h-6 text-mint-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-2xl tracking-wider text-white leading-none">MINTARA</span>
              <span className="text-xs text-phoenix-500 font-mono tracking-widest uppercase">Phoenix Ed.</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1">
            {renderNavItems()}
          </nav>

          {/* Footer Info */}
          <div className="mt-auto pt-6 border-t border-slate-800 text-xs text-slate-500 font-mono">
            <p>V3.0 (PHOENIX)</p>
            <p className="mt-1">STATUS: IMMUTABLE</p>
            <div className="mt-2 flex items-center gap-1 text-phoenix-500">
              <div className="w-2 h-2 rounded-full bg-phoenix-500 animate-pulse"></div>
              <span>Protocol Live</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
};