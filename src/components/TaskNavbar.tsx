import React, { useState, useRef, useEffect } from 'react';
import { ViewMode, StreakData, TaskItem } from '../types';
import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  Plus, 
  Search, 
  Flame, 
  X,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { ProfileContent } from './ProfileContent';

interface TaskNavbarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAddTask: () => void;
  completedCount: number;
  totalCount: number;
  streakData: StreakData;
  tasks: TaskItem[];
  userName: string;
  onUpdateUserName: (name: string) => void;
  userInitials?: string;
  onUpdateUserInitials?: (initials: string) => void;
  onOpenMobileProfile: () => void;
}

export const TaskNavbar: React.FC<TaskNavbarProps> = ({
  currentView,
  onViewChange,
  searchQuery,
  onSearchChange,
  onOpenAddTask,
  completedCount,
  totalCount,
  streakData,
  tasks,
  userName,
  onUpdateUserName,
  userInitials = 'JT',
  onUpdateUserInitials,
  onOpenMobileProfile
}) => {
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  // Desktop Profile Popover State
  const [isDesktopPopoverOpen, setIsDesktopPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close desktop popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDesktopPopoverOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsDesktopPopoverOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDesktopPopoverOpen) {
        setIsDesktopPopoverOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isDesktopPopoverOpen]);

  return (
    <header className="bg-white/90 border-b border-stone-200/80 backdrop-blur-md sticky top-0 z-40 shadow-xs transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-2.5">
        
        {/* ========================================================================= */}
        {/* 1. MOBILE VIEW HEADER (< 640px / < sm) */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-2 sm:hidden">
          {currentView !== 'dashboard' ? (
            <>
              {/* Top Bar for non-dashboard views on mobile */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <button
                    type="button"
                    id="mobile-nav-avatar-btn"
                    onClick={onOpenMobileProfile}
                    title="Buka Profil & Pengaturan"
                    className="w-8 h-8 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 flex items-center justify-center font-bold shadow-xs shrink-0 cursor-pointer hover:ring-2 hover:ring-amber-400 hover:scale-105 active:scale-95 transition-all"
                  >
                    <span className="font-mono text-xs tracking-tight">{userInitials}</span>
                  </button>
                  
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h1 className="text-xs font-bold text-stone-900 tracking-tight truncate">
                      {currentView === 'tugas' ? 'Daftar Tugas' : 'Ruang Baca'}
                    </h1>
                    
                    {/* Badge Streak */}
                    <div 
                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200 shadow-2xs shrink-0"
                      title={`Streak aktif: ${streakData.count} hari berturut-turut!`}
                    >
                      <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                      <span>{streakData.count} Hari</span>
                    </div>
                  </div>
                </div>

                {/* Quick Add icon button '+' */}
                <button
                  id="mobile-add-task-btn"
                  onClick={onOpenAddTask}
                  aria-label="Tambah Tugas"
                  className="w-8 h-8 rounded-xl bg-stone-900 hover:bg-stone-800 text-white flex items-center justify-center shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Search bar on non-dashboard mobile */}
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                <input
                  id="mobile-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Cari tugas, catatan & bacaan..."
                  className="w-full pl-8 pr-8 py-1.5 bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-xs text-stone-800 placeholder-stone-400 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all"
                />
                {searchQuery && (
                  <button 
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-stone-700 bg-stone-200/80 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="hidden" />
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. TABLET & DESKTOP VIEW LAYOUT (≥ sm / ≥ 640px) */}
        {/* ========================================================================= */}
        <div className="hidden sm:flex items-center justify-between gap-3 md:gap-4 relative">
          
          {/* Brand Snippet */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div 
              onClick={() => {
                onViewChange('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 cursor-pointer group"
              title="Ke Beranda Dashboard"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-stone-900 to-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-1 ring-stone-900/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-bold text-stone-900 tracking-tight font-sans group-hover:text-amber-600 transition-colors">
                    Jejak Tugas
                  </h1>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 hidden lg:inline-block">
                    {completedCount}/{totalCount} ({percentage}%)
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 hidden md:block">
                  Kelola target belajar & baca materi
                </p>
              </div>
            </div>
          </div>

          {/* Center Search & 3 Core Menu Tabs */}
          <div className="flex items-center gap-2 md:gap-2.5">
            
            {/* Search input (visible on sm+) */}
            <div className="relative w-32 md:w-44 lg:w-52">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              <input
                id="search-task-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari tugas..."
                className="w-full pl-8 pr-7 py-1.5 bg-stone-50 hover:bg-stone-100/80 focus:bg-white text-xs text-stone-800 placeholder-stone-400 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-stone-400 hover:text-stone-700 bg-stone-200/80 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Mode Capsule Tabs (3 Core Menus: Dashboard, Daftar Tugas, Ruang Baca) */}
            <div className="flex items-center bg-stone-100/90 p-1 rounded-xl border border-stone-200/80">
              <button
                id="nav-dashboard-tab"
                type="button"
                onClick={() => onViewChange('dashboard')}
                className={`flex items-center justify-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60 font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/40'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>

              <button
                id="nav-tugas-tab"
                type="button"
                onClick={() => onViewChange('tugas')}
                className={`flex items-center justify-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'tugas'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60 font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/40'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Daftar Tugas</span>
              </button>

              <button
                id="nav-baca-tab"
                type="button"
                onClick={() => onViewChange('baca')}
                className={`flex items-center justify-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'baca'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200/60 font-bold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/40'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Ruang Baca</span>
              </button>
            </div>

            {/* Quick Add Button */}
            <button
              id="desktop-add-task-btn"
              type="button"
              onClick={onOpenAddTask}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white rounded-xl font-semibold text-xs shadow-xs transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden md:inline">Tambah Tugas</span>
            </button>

          </div>

          {/* ========================================================================= */}
          {/* DESKTOP PROFILE HOTBAR & POPOVER ANCHOR (Ujung Kanan Navbar) */}
          {/* ========================================================================= */}
          <div className="relative shrink-0">
            
            {/* Hotbar Button */}
            <button
              ref={triggerRef}
              type="button"
              id="desktop-profile-hotbar-btn"
              onClick={() => setIsDesktopPopoverOpen(prev => !prev)}
              aria-expanded={isDesktopPopoverOpen}
              aria-haspopup="dialog"
              title="Buka Profil & Pengaturan"
              className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
                isDesktopPopoverOpen
                  ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-stone-50 hover:bg-stone-100/90 text-stone-800 border-stone-200/80 shadow-2xs hover:border-stone-300'
              }`}
            >
              {/* Avatar Initial Pill */}
              <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow-2xs transition-colors ${
                isDesktopPopoverOpen
                  ? 'bg-amber-400 text-stone-950'
                  : 'bg-stone-900 text-stone-100'
              }`}>
                {userInitials}
              </div>

              {/* Greeting / Status text */}
              <div className="text-left hidden md:block max-w-[120px]">
                <div className="text-xs font-bold truncate leading-tight">
                  {userName || 'Sahabat Belajar'}
                </div>
                <div className={`text-[10px] leading-tight font-medium ${
                  isDesktopPopoverOpen ? 'text-amber-300' : 'text-emerald-600'
                }`}>
                  Aktif Belajar
                </div>
              </div>

              {/* Chevron icon */}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isDesktopPopoverOpen ? 'rotate-180 text-amber-300' : 'text-stone-400'
              }`} />
            </button>

            {/* DESKTOP POPOVER DROPDOWN CARD */}
            {isDesktopPopoverOpen && (
              <div
                ref={popoverRef}
                role="dialog"
                aria-modal="true"
                aria-label="Profil Pengguna"
                className="absolute top-full right-0 mt-2.5 w-[380px] md:w-[420px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-slate-200/90 z-50 p-5 max-h-[82vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 ease-out origin-top-right"
              >
                <ProfileContent
                  tasks={tasks}
                  streakData={streakData}
                  userName={userName}
                  onUpdateUserName={onUpdateUserName}
                  userInitials={userInitials}
                  onUpdateUserInitials={onUpdateUserInitials}
                  onClose={() => setIsDesktopPopoverOpen(false)}
                  isPopover={true}
                />
              </div>
            )}

          </div>

        </div>

      </div>
    </header>
  );
};
