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
  ChevronDown 
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
  firstJoinedDate?: string;
  appUsageSeconds?: number;
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
  onOpenMobileProfile,
  firstJoinedDate,
  appUsageSeconds = 0
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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
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
                    className="shrink-0 cursor-pointer active:scale-95 transition-transform"
                  >
                    <img 
                      src="/LogoJejakTugas.jpeg" 
                      alt="Logo Jejak Tugas" 
                      className="w-8 h-8 rounded-xl object-cover shrink-0 border border-slate-200 shadow-xs" 
                    />
                  </button>
                  
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h1 className="text-xs font-bold text-slate-900 tracking-tight truncate">
                      {currentView === 'tugas' ? 'Daftar Tugas' : 'Ruang Baca'}
                    </h1>
                    
                    {/* Badge Streak */}
                    <div 
                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50/40 text-amber-600 border border-amber-200 shadow-2xs shrink-0"
                      title={`Streak aktif: ${streakData.count} hari berturut-turut!`}
                    >
                      <Flame className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                      <span>{streakData.count} Hari</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Right Controls: Add Button */}
                <div className="flex items-center gap-1.5">
                  <button
                    id="mobile-add-task-btn"
                    onClick={onOpenAddTask}
                    aria-label="Tambah Tugas"
                    className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center justify-center shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Search bar on non-dashboard mobile (Daftar Tugas & Ruang Baca) */}
              <div className="relative w-full">
                <div className="flex items-center w-full bg-white border border-slate-200/90 rounded-full px-3.5 py-2 shadow-2xs focus-within:ring-2 focus-within:ring-sky-200 focus-within:border-sky-300 transition-all">
                  <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
                  <input
                    id="mobile-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Cari tugas, catatan & bacaan..."
                    className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button 
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center shrink-0 ml-1 cursor-pointer transition-colors"
                      aria-label="Hapus Pencarian"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
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
          
          {/* Brand Logo & App Name */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div 
              onClick={() => {
                onViewChange('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Ke Beranda Dashboard"
            >
              <img 
                src="/LogoJejakTugas.jpeg" 
                alt="Logo Jejak Tugas" 
                className="h-8 w-8 rounded-lg object-contain shrink-0 shadow-sm" 
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-base font-bold text-slate-900 tracking-tight font-sans group-hover:text-amber-600 transition-colors">
                    Jejak Tugas
                  </h1>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 hidden lg:inline-block">
                    {completedCount}/{totalCount} ({percentage}%)
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 hidden md:block">
                  Kelola target belajar & baca materi
                </p>
              </div>
            </div>
          </div>

          {/* Center Search & 3 Core Menu Tabs */}
          <div className="flex items-center gap-2 md:gap-2.5">
            
            {/* Search input (visible on sm+) */}
            <div className="w-36 md:w-48 lg:w-56">
              <div className="flex items-center w-full bg-white border border-slate-200 rounded-full px-3 py-1.5 shadow-2xs focus-within:ring-2 focus-within:ring-sky-200 focus-within:border-sky-300 transition-all">
                <Search className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-2" />
                <input
                  id="search-task-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Cari tugas..."
                  className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full w-3.5 h-3.5 flex items-center justify-center shrink-0 ml-1 cursor-pointer transition-colors"
                    aria-label="Hapus Pencarian"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            </div>

            {/* View Mode Capsule Tabs (3 Core Menus: Dashboard, Daftar Tugas, Ruang Baca) */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
              <button
                id="nav-dashboard-tab"
                type="button"
                onClick={() => onViewChange('dashboard')}
                className={`flex items-center justify-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-stone-800" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>

              <button
                id="nav-tugas-tab"
                type="button"
                onClick={() => onViewChange('tugas')}
                className={`flex items-center justify-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'tugas'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5 text-stone-800" />
                <span className="hidden sm:inline">Daftar Tugas</span>
              </button>

              <button
                id="nav-baca-tab"
                type="button"
                onClick={() => onViewChange('baca')}
                className={`flex items-center justify-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentView === 'baca'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-stone-800" />
                <span className="hidden sm:inline">Ruang Baca</span>
              </button>
            </div>

            {/* Quick Add Button */}
            <button
              id="desktop-add-task-btn"
              type="button"
              onClick={onOpenAddTask}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-all hover:scale-[1.01] active:scale-95 cursor-pointer shrink-0"
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
              className={`flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-2xl border transition-all cursor-pointer active:scale-95 ${
                isDesktopPopoverOpen
                  ? 'bg-amber-50 text-slate-900 border-amber-300 shadow-sm ring-2 ring-amber-400/20'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm'
              }`}
            >
              {/* Avatar Initial Pill */}
              <div className="w-7 h-7 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-mono font-bold text-xs shadow-2xs">
                {userInitials}
              </div>

              {/* Greeting / Status text */}
              <div className="text-left hidden md:block max-w-[120px]">
                <div className="text-xs font-bold text-slate-900 truncate leading-tight">
                  {userName || 'Sahabat Belajar'}
                </div>
                <div className="text-[10px] leading-tight font-medium text-emerald-600">
                  Aktif Belajar
                </div>
              </div>

              {/* Chevron icon */}
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                isDesktopPopoverOpen ? 'rotate-180 text-amber-500' : ''
              }`} />
            </button>

            {/* DESKTOP POPOVER DROPDOWN CARD */}
            {isDesktopPopoverOpen && (
              <div
                ref={popoverRef}
                role="dialog"
                aria-modal="true"
                aria-label="Profil Pengguna"
                className="absolute top-full right-0 mt-2.5 w-[380px] sm:w-[460px] md:w-[520px] max-w-[calc(100vw-2rem)] bg-white text-slate-900 rounded-3xl shadow-2xl border border-slate-200 z-50 p-5 sm:p-6 max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 ease-out origin-top-right"
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
                  firstJoinedDate={firstJoinedDate}
                  appUsageSeconds={appUsageSeconds}
                />
              </div>
            )}

          </div>

        </div>

      </div>
    </header>
  );
};
