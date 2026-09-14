import React from 'react';
import { ViewMode } from '../types';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen,
  User
} from 'lucide-react';

interface MobileBottomNavProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  activeCount?: number;
  onOpenProfile: () => void;
  isProfileOpen?: boolean;
  userInitials?: string;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onViewChange,
  activeCount = 0,
  onOpenProfile,
  isProfileOpen = false,
  userInitials = 'JT'
}) => {
  return (
    <nav 
      aria-label="Mobile Navigation Bar"
      className="flex sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-1 px-2 shadow-lg transition-all"
    >
      <div className="grid grid-cols-4 w-full max-w-md mx-auto gap-1">
        
        {/* Tab 1: Dashboard */}
        <button
          type="button"
          id="bottom-nav-dashboard"
          onClick={() => {
            onViewChange('dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 cursor-pointer ${
            currentView === 'dashboard' && !isProfileOpen
              ? 'text-slate-950 font-semibold bg-slate-100/90 shadow-2xs'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${currentView === 'dashboard' && !isProfileOpen ? 'stroke-[2.5] text-slate-950' : 'stroke-[1.75] text-slate-400'}`} />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">Dashboard</span>
        </button>

        {/* Tab 2: Daftar Tugas */}
        <button
          type="button"
          id="bottom-nav-tugas"
          onClick={() => {
            onViewChange('tugas');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 cursor-pointer ${
            currentView === 'tugas' && !isProfileOpen
              ? 'text-slate-950 font-semibold bg-slate-100/90 shadow-2xs'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className="relative">
            <CheckSquare className={`w-5 h-5 ${currentView === 'tugas' && !isProfileOpen ? 'stroke-[2.5] text-slate-950' : 'stroke-[1.75] text-slate-400'}`} />
            {activeCount > 0 && (
              <span className="absolute -top-1 -right-2.5 min-w-4 h-4 px-1 bg-amber-500 text-slate-950 rounded-full text-[9px] font-mono font-bold flex items-center justify-center shadow-2xs">
                {activeCount > 9 ? '9+' : activeCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">Daftar Tugas</span>
        </button>

        {/* Tab 3: Ruang Baca */}
        <button
          type="button"
          id="bottom-nav-baca"
          onClick={() => {
            onViewChange('baca');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 cursor-pointer ${
            currentView === 'baca' && !isProfileOpen
              ? 'text-slate-950 font-semibold bg-slate-100/90 shadow-2xs'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${currentView === 'baca' && !isProfileOpen ? 'stroke-[2.5] text-slate-950' : 'stroke-[1.75] text-slate-400'}`} />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">Ruang Baca</span>
        </button>

        {/* Tab 4: Profil */}
        <button
          type="button"
          id="bottom-nav-profil"
          onClick={onOpenProfile}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all active:scale-95 cursor-pointer ${
            isProfileOpen
              ? 'text-slate-950 font-semibold bg-slate-100/90 shadow-2xs'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className="relative flex items-center justify-center">
            {userInitials ? (
              <div className="bg-slate-950 text-white text-[10px] font-bold rounded-md px-1.5 py-0.5 font-mono shadow-xs">
                {userInitials.slice(0, 2)}
              </div>
            ) : (
              <User className={`w-5 h-5 ${isProfileOpen ? 'stroke-[2.5] text-slate-950' : 'stroke-[1.75] text-slate-400'}`} />
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">Profil</span>
        </button>

      </div>
    </nav>
  );
};
