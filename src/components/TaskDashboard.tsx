import React, { useState, useEffect } from 'react';
import { TaskItem, TaskCategory, StreakData } from '../types';
import { QuickFocusTimer } from './QuickFocusTimer';
import { TaskDeadlineBadge } from './TaskDeadlineBadge';
import { formatDueDateShort } from '../utils/timeFormat';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  BookOpen, 
  ArrowRight, 
  Plus, 
  Check, 
  Calendar, 
  Flame, 
  CheckSquare, 
  Activity, 
  Target,
  Filter,
  Layers,
  Sparkles,
  Zap,
  Search,
  X,
  Play,
  Trash2,
  StickyNote
} from 'lucide-react';

interface TaskDashboardProps {
  tasks: TaskItem[];
  streakData: StreakData;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  onToggleStatus: (taskId: string) => void;
  onReadTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
  onOpenAddTask: () => void;
  onGoToTaskList: (filter?: string) => void;
  onOpenProfile?: () => void;
  userName?: string;
  userInitials?: string;
}

type QuickTaskFilter = 'semua' | 'mendesak' | 'belum_selesai';

export const TaskDashboard: React.FC<TaskDashboardProps> = ({
  tasks,
  streakData,
  searchQuery = '',
  onSearchChange,
  onToggleStatus,
  onReadTask,
  onDeleteTask,
  onOpenAddTask,
  onGoToTaskList,
  onOpenProfile,
  userName = 'Sahabat Belajar',
  userInitials = 'JT'
}) => {
  const [quickFilter, setQuickFilter] = useState<QuickTaskFilter>('semua');
  const [localSearch, setLocalSearch] = useState<string>(searchQuery);

  // Quick Scratchpad Auto-Save State
  const [quickNote, setQuickNote] = useState<string>(() => {
    try {
      return localStorage.getItem('jejak_tugas_quick_notes') || '';
    } catch {
      return '';
    }
  });
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  const handleQuickNoteChange = (value: string) => {
    setQuickNote(value);
    try {
      localStorage.setItem('jejak_tugas_quick_notes', value);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearQuickNote = () => {
    setQuickNote('');
    try {
      localStorage.removeItem('jejak_tugas_quick_notes');
    } catch (e) {
      console.error(e);
    }
    setShowClearConfirm(false);
  };

  // Sync search state with parent if provided
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchInputChange = (value: string) => {
    setLocalSearch(value);
    if (onSearchChange) {
      onSearchChange(value);
    }
  };

  // Dynamic Greeting Logic
  const getGreetingData = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    let greetingText = 'Selamat Malam 🌙';
    // 04:00 (240m) - 11:00 (660m)
    if (totalMinutes >= 240 && totalMinutes <= 660) {
      greetingText = 'Selamat Pagi ☀️';
    } 
    // 11:01 (661m) - 15:00 (900m)
    else if (totalMinutes > 660 && totalMinutes <= 900) {
      greetingText = 'Selamat Siang 🌤️';
    } 
    // 15:01 (901m) - 18:30 (1110m)
    else if (totalMinutes > 900 && totalMinutes <= 1110) {
      greetingText = 'Selamat Sore 🌇';
    } 
    // 18:31 - 03:59
    else {
      greetingText = 'Selamat Malam 🌙';
    }

    return {
      greeting: greetingText,
      title: 'Halo, Sahabat Belajar! 👋'
    };
  };

  const { greeting, title } = getGreetingData();

  const totalCount = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const activeTasks = tasks.filter(t => t.status !== 'completed');
  const highPriorityTasks = activeTasks.filter(t => t.priority === 'tinggi');
  
  const totalMinutesRemaining = activeTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);
  const remainingHours = Math.floor(totalMinutesRemaining / 60);
  const remainingMins = totalMinutesRemaining % 60;

  // Filter tasks based on quick tab selection
  const filteredQuickTasks = activeTasks.filter(t => {
    if (quickFilter === 'mendesak') return t.priority === 'tinggi';
    if (quickFilter === 'belum_selesai') return t.status !== 'completed';
    return true; // 'semua'
  });

  // Category counts
  const categories: TaskCategory[] = ['Pemrograman', 'Belajar', 'Membaca', 'Tugas Kuliah', 'Proyek', 'Lainnya'];
  const categoryStats = categories.map(cat => {
    const catTasks = tasks.filter(t => t.category === cat);
    const catCompleted = catTasks.filter(t => t.status === 'completed').length;
    return {
      name: cat,
      total: catTasks.length,
      completed: catCompleted,
      percent: catTasks.length > 0 ? Math.round((catCompleted / catTasks.length) * 100) : 0
    };
  }).filter(c => c.total > 0);

  // Subtasks metrics
  let totalSubtasks = 0;
  let completedSubtasks = 0;
  tasks.forEach(t => {
    t.subtasks.forEach(s => {
      totalSubtasks++;
      if (s.completed) completedSubtasks++;
    });
  });

  const completionPercentage = totalCount > 0 ? Math.round((completedTasks.length / totalCount) * 100) : 0;

  // Gamification Level & XP calculation
  const totalXp = Math.min(300, (completedTasks.length * 40) + (streakData.count * 30) + (completedSubtasks * 10) + 60);
  const userLevel = totalXp >= 200 ? 2 : 1;
  const levelTitle = userLevel >= 2 ? 'Pelajar Aktif' : 'Pemula Fokus';

  // Find the top priority / urgent active task for Next Focus
  const nextFocusTask = highPriorityTasks.length > 0 
    ? highPriorityTasks[0] 
    : (activeTasks.length > 0 ? activeTasks[0] : null);

  // Circular ring stats math
  const statsRingRadius = 18;
  const statsCircumference = 2 * Math.PI * statsRingRadius;
  const statsDashoffset = statsCircumference - ((completionPercentage / 100) * statsCircumference);

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-300">
      
      {/* 1. MOBILE GREETING HEADER (< 640px / < sm) */}
      <div className="flex items-center justify-between gap-3 sm:hidden pt-0.5 pb-1">
        
        {/* Kiri: Avatar Logo & Teks Sapaan */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            type="button"
            id="dashboard-avatar-profile-btn"
            onClick={onOpenProfile}
            title="Buka Profil & Pengaturan Belajar"
            className="shrink-0 cursor-pointer active:scale-95 transition-transform"
          >
            <img 
              src="/LogoJejakTugas.jpeg" 
              alt="Logo Jejak Tugas" 
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 shadow-sm" 
            />
          </button>
          
          <div 
            onClick={onOpenProfile}
            className="min-w-0 flex flex-col justify-center cursor-pointer group"
            title="Lihat Profil & Pengaturan"
          >
            <p className="text-sm text-slate-500 font-medium leading-tight truncate">
              {greeting}
            </p>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight truncate group-hover:text-amber-600 transition-colors">
              Halo, {userName || 'Sahabat Belajar'}! 👋
            </h1>
          </div>
        </div>

        {/* Kanan: Badge Streak & Action Button '+' */}
        <div className="flex items-center gap-2 shrink-0">
          <div 
            className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 bg-amber-50/40 text-amber-600 border border-amber-200 rounded-full shadow-2xs cursor-default"
            title={`Streak aktif ${streakData.count} hari berturut-turut`}
          >
            <span>🔥 {streakData.count} Hari</span>
          </div>

          <button
            type="button"
            id="dashboard-mobile-add-btn"
            onClick={onOpenAddTask}
            className="w-9 h-9 rounded-2xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold flex items-center justify-center shadow-sm transition-all active:scale-95 cursor-pointer"
            title="Tambah Tugas Baru"
            aria-label="Tambah Tugas Baru"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

      </div>

      {/* Mobile Search Bar (< 640px) */}
      <div className="relative w-full sm:hidden mb-2.5">
        <div className="flex items-center w-full bg-white border border-slate-200/90 rounded-full px-3.5 py-2 shadow-2xs focus-within:ring-2 focus-within:ring-sky-200 focus-within:border-sky-300 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2.5" />
          <input
            id="dashboard-search-input"
            type="text"
            value={localSearch}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            placeholder="Cari tugas, topik & materi..."
            className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => handleSearchInputChange('')}
              className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center shrink-0 ml-1 transition-colors cursor-pointer"
              aria-label="Hapus Pencarian"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tablet & Desktop Greeting Sub-header (≥ 640px / ≥ sm) */}
      <div className="hidden sm:flex items-center justify-between gap-4 pt-1 pb-0.5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenProfile}
            title="Buka Profil & Pengaturan Belajar"
            className="shrink-0 cursor-pointer active:scale-95 transition-transform"
          >
            <img 
              src="/LogoJejakTugas.jpeg" 
              alt="Logo Jejak Tugas" 
              className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200 shadow-sm" 
            />
          </button>
          <div>
            <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
              <span>{greeting}</span>
              <span>•</span>
              <span className="text-amber-600 font-semibold">Semangat Belajar & Produktif!</span>
            </p>
            <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              Halo, {userName || 'Sahabat Belajar'}! 👋
            </h2>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-full text-xs font-semibold shadow-2xs cursor-default"
            title={`Streak aktif ${streakData.count} hari berturut-turut`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Konsistensi: {streakData.count} Hari</span>
          </div>
        </div>
      </div>

      {/* 2. HERO PRODUCTIVITY CARD ("Target Belajar Hari Ini" - 100% Struktur Layout dengan Warna Clean Light Mode) */}
      <div className="bg-[#F0F7FF] text-slate-900 rounded-3xl p-4 sm:p-6 shadow-sm border border-sky-100 relative overflow-hidden">
        {/* Subtle Ambient Glows */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/4 -bottom-10 w-44 h-44 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          
          {/* Bagian Atas: Target Belajar, Persentase & Jumlah Tugas */}
          <div className="space-y-1">
            <div className="text-xs sm:text-sm text-slate-500 font-medium">
              Target Belajar Hari Ini
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-mono">
              {completionPercentage}%
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              {completedTasks.length} dari {totalCount} tugas telah diselesaikan
            </p>

            {/* Badge Capaian / Tombol Aksi */}
            <div className="pt-2">
              {completionPercentage === 100 ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-2xl inline-flex items-center gap-2 shadow-2xs">
                  <span>✨ Semua Target Hari Ini Tercapai (100%)</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const timerEl = document.getElementById('focus-timer-section');
                    if (timerEl) {
                      timerEl.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      onGoToTaskList('aktif');
                    }
                  }}
                  className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-semibold rounded-xl px-4 py-2.5 text-xs sm:text-sm shadow-xs inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Mulai Belajar Sekarang</span>
                </button>
              )}
            </div>
          </div>

          {/* Bagian Bawah: Dua Kartu Kecil ('Fokus Berikutnya' & 'Estimasi Sisa') */}
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-2.5 sm:gap-3.5 pt-2">
            
            {/* Kotak 1: Fokus Tugas Terdekat */}
            <div 
              onClick={() => {
                if (nextFocusTask) {
                  onReadTask(nextFocusTask);
                } else {
                  onGoToTaskList('aktif');
                }
              }}
              className="bg-white hover:bg-slate-50/90 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between transition-all cursor-pointer shadow-2xs hover:shadow-xs min-h-[82px] sm:min-h-[88px] group"
              title={nextFocusTask ? `Buka detail tugas: ${nextFocusTask.title}` : 'Semua target telah selesai!'}
            >
              <div>
                <div className="text-[11px] sm:text-xs text-amber-600 font-semibold flex items-center justify-between leading-none mb-1.5">
                  <span className="flex items-center gap-1">
                    <span>🎯</span>
                    <span>Fokus Berikutnya</span>
                  </span>
                  {nextFocusTask && (
                    <span className="text-[10px] text-slate-400 group-hover:text-amber-600 transition-colors font-medium">Buka →</span>
                  )}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate leading-snug">
                  {nextFocusTask ? nextFocusTask.title : 'Semua target beres...'}
                </div>
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 truncate mt-1.5 flex items-center gap-1.5">
                {nextFocusTask ? (
                  <>
                    <span className="text-slate-700 font-medium">{nextFocusTask.category}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-amber-700 font-medium bg-amber-50/80 px-1.5 py-0.5 rounded text-[10px]">
                      {formatDueDateShort(nextFocusTask.dueDate)}
                    </span>
                  </>
                ) : (
                  <span className="text-emerald-600 font-medium">Istirahat sejenak!</span>
                )}
              </div>
            </div>

            {/* Kotak 2: Ring Progres & Estimasi Waktu */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 shadow-2xs min-h-[82px] sm:min-h-[88px]">
              <div className="relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
                  <circle
                    cx="22"
                    cy="22"
                    r={statsRingRadius}
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r={statsRingRadius}
                    className="text-[#00BCD4] transition-all duration-1000 ease-out"
                    strokeWidth="3.5"
                    strokeDasharray={statsCircumference}
                    strokeDashoffset={statsDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-slate-900">
                  {completionPercentage}%
                </div>
              </div>
              
              <div className="text-left min-w-0 flex-1">
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium leading-none">
                  Estimasi Sisa
                </div>
                <div className="text-xs sm:text-sm font-bold font-mono text-slate-900 truncate leading-tight whitespace-nowrap mt-1">
                  {remainingHours > 0 ? `${remainingHours}j ` : ''}{remainingMins}m
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 truncate mt-1">
                  {completedTasks.length}/{totalCount} beres
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 3. 4 KEY STAT CARDS (Grid 2x2 on Mobile, 4 Cols on Tablet/Desktop) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Total Tugas */}
        <div 
          onClick={() => onGoToTaskList('semua')}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md cursor-pointer transition-all group overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-800 mb-1.5">
            <span className="text-xs sm:text-sm font-semibold truncate">Total Tugas</span>
            <CheckSquare className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors shrink-0" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900">{totalCount}</div>
          <div className="text-xs text-slate-400 mt-1 truncate">
            <span>{categoryStats.length} Kategori aktif</span>
          </div>
        </div>

        {/* Card 2: Perlu Dikerjakan */}
        <div 
          onClick={() => onGoToTaskList('aktif')}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md cursor-pointer transition-all group overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-800 mb-1.5">
            <span className="text-xs sm:text-sm font-semibold truncate">Perlu Dikerjakan</span>
            <Clock className="w-4 h-4 text-amber-500 shrink-0" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-500">{activeTasks.length}</div>
          <div className="text-xs text-slate-400 mt-1 truncate">
            {highPriorityTasks.length} prioritas mendesak
          </div>
        </div>

        {/* Card 3: Tugas Selesai */}
        <div 
          onClick={() => onGoToTaskList('selesai')}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md cursor-pointer transition-all group overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-800 mb-1.5">
            <span className="text-xs sm:text-sm font-semibold truncate">Tugas Selesai</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-500">{completedTasks.length}</div>
          <div className="text-xs text-slate-400 mt-1 truncate">
            {completedSubtasks}/{totalSubtasks} checklist beres
          </div>
        </div>

        {/* Card 4: Prioritas Utama */}
        <div 
          onClick={() => onGoToTaskList('tinggi')}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md cursor-pointer transition-all group overflow-hidden"
        >
          <div className="flex items-center justify-between text-slate-800 mb-1.5">
            <span className="text-xs sm:text-sm font-semibold truncate">Prioritas Utama</span>
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-500">{highPriorityTasks.length}</div>
          <div className="text-xs text-slate-400 mt-1 truncate">
            Perlu perhatian segera
          </div>
        </div>

      </div>

      {/* 4. MAIN CONTENT GRID (Responsive 2-Column on Desktop ≥ 1024px, 1-Column on Mobile/Tablet) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        
        {/* Left Column (lg:col-span-7): [Daftar Tugas Aktif & Materi Terdekat] + [Quick Scratchpad] */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          
          {/* Header & Quick Filter Tabs */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Tugas Aktif & Materi Terdekat
                </h3>
                <p className="text-xs text-slate-400">
                  Langsung baca materi penjelasan atau tandai selesai
                </p>
              </div>

              <button
                onClick={() => onGoToTaskList(quickFilter === 'mendesak' ? 'tinggi' : 'aktif')}
                className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Lihat Semua</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Filter Tabs: [Semua], [Mendesak], [Belum Selesai] */}
            <div className="flex items-center gap-1 bg-slate-100/70 p-1 rounded-2xl w-full sm:w-fit">
              <button
                type="button"
                id="quick-filter-all"
                onClick={() => setQuickFilter('semua')}
                className={`flex-1 sm:flex-none text-center px-3 sm:px-4 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                  quickFilter === 'semua'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                Semua ({activeTasks.length})
              </button>

              <button
                type="button"
                id="quick-filter-urgent"
                onClick={() => setQuickFilter('mendesak')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                  quickFilter === 'mendesak'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Mendesak ({highPriorityTasks.length})</span>
              </button>

              <button
                type="button"
                id="quick-filter-pending"
                onClick={() => setQuickFilter('belum_selesai')}
                className={`flex-1 sm:flex-none text-center px-3 sm:px-4 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                  quickFilter === 'belum_selesai'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                Belum Selesai ({activeTasks.length})
              </button>
            </div>
          </div>

          {/* Task List Items */}
          {filteredQuickTasks.length === 0 ? (
            <div className="p-8 sm:p-10 text-center bg-white rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="font-bold text-base text-slate-900">
                {quickFilter === 'mendesak' ? 'Tidak Ada Tugas Mendesak' : 'Semua Tugas Sudah Selesai!'}
              </div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {quickFilter === 'mendesak' 
                  ? 'Bagus! Semua tugas prioritas tinggi telah terselesaikan.' 
                  : 'Luar biasa! Tidak ada tugas tertunda saat ini.'}
              </p>
              <button
                onClick={onOpenAddTask}
                className="mt-1 inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-medium cursor-pointer transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" /> Tambah Tugas Baru
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredQuickTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-white rounded-2xl border border-slate-200/80 border-l-4 border-l-[#00BCD4] shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 group"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => onToggleStatus(task.id)}
                      title="Tandai Selesai"
                      className="mt-0.5 w-5 h-5 rounded-md border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 text-transparent hover:text-emerald-600 flex items-center justify-center transition-all shrink-0 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>

                    <div className="min-w-0 space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-sans">
                          {task.category}
                        </span>
                        {task.priority === 'tinggi' && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                            Prioritas Tinggi
                          </span>
                        )}
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> {task.dueDate}
                        </span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 group-hover:text-cyan-700 transition-colors">
                        {task.title}
                      </h4>

                      {task.readingContent && (
                        <p className="text-xs text-slate-500 line-clamp-1">
                          {task.readingContent.replace(/[#*`]/g, '').slice(0, 90)}...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions Stack (Mobile: flex-row berdampingan, Desktop: flex-col atas-bawah) */}
                  <div className="flex flex-row flex-wrap items-center gap-2 shrink-0 self-start sm:self-center sm:flex-col sm:items-end">
                    <TaskDeadlineBadge dueDate={task.dueDate} />

                    <button
                      onClick={() => onReadTask(task)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      title="Baca Catatan & Materi Lengkap"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-slate-600" />
                      <span>Baca Materi</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick Scratchpad / Catatan Cepat (Auto-Saved) */}
          <div className="bg-white border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-2xl p-4 sm:p-5 space-y-3">
            {/* Scratchpad Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-base">📝</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    Catatan Cepat
                  </h3>
                  <p className="text-xs text-slate-400 font-normal leading-tight mt-0.5">
                    Tersimpan otomatis di peramban
                  </p>
                </div>
              </div>

              {quickNote && (
                <div>
                  {showClearConfirm ? (
                    <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                      <span className="text-xs text-slate-500">Hapus catatan?</span>
                      <button
                        type="button"
                        onClick={handleClearQuickNote}
                        className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium text-xs rounded-md transition-colors cursor-pointer"
                      >
                        Ya
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(false)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-md transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(true)}
                      className="text-xs text-slate-400 hover:text-rose-500 transition-colors flex items-center gap-1 cursor-pointer py-1 px-1.5 rounded-md hover:bg-slate-50"
                      title="Bersihkan catatan cepat"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Bersihkan</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Scratchpad Textarea */}
            <textarea
              id="dashboard-quick-scratchpad"
              value={quickNote}
              onChange={(e) => handleQuickNoteChange(e.target.value)}
              placeholder="Tulis ide spontan, cuplikan kode, atau tautan referensi kilat di sini..."
              className="h-24 sm:h-28 w-full bg-slate-50/70 border border-slate-100 rounded-xl p-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-slate-300 outline-none resize-none transition-all"
            />
          </div>

        </div>

        {/* Right Column (lg:col-span-5): [Aktivitas Hari Ini & Distribusi Kategori] + [Quick Focus / Pomodoro Timer] */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Daily Progress & Activity Tracker */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] space-y-4">
            
            {/* Header: Judul 'Aktivitas Hari Ini' dengan badge '🔥 X Hari Streak' */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-50/90 border border-orange-200/60 flex items-center justify-center text-orange-600">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Aktivitas Hari Ini</h3>
                  <p className="text-xs text-slate-400">Pantau konsistensi & target harian</p>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] font-mono text-xs font-bold shadow-2xs">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>{streakData.count} Hari</span>
              </div>
            </div>

            {/* Circular/Linear Progress Section with Target Insight */}
            <div className={`space-y-2.5 p-4 rounded-2xl border transition-all ${
              completionPercentage === 100 
                ? 'bg-[#F0FDF4] border-[#DCFCE7]' 
                : 'bg-slate-50/80 border-slate-100'
            }`}>
              <div className="flex items-center justify-between text-xs font-medium">
                <span className={completionPercentage === 100 ? 'text-[#166534] font-bold flex items-center gap-1.5 text-xs sm:text-sm' : 'text-slate-700 font-medium'}>
                  {completionPercentage === 100 && <Sparkles className="w-4 h-4 text-emerald-600 inline" />}
                  {completedTasks.length} dari {totalCount} tugas selesai
                </span>
                <span className={`font-mono font-bold ${
                  completionPercentage === 100 ? 'text-[#166534] text-sm sm:text-base' : 'text-slate-900 text-sm'
                }`}>
                  {completionPercentage}%
                </span>
              </div>

              {/* Progress bar with glowing emerald effect at 100% */}
              <div className="w-full h-2 bg-[#DCFCE7] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    completionPercentage === 100 
                      ? 'bg-emerald-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                <span>Target: 1 Hari 1 Progres</span>
                {completionPercentage === 100 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-semibold">
                    <span>✨ Selesai Penuh!</span>
                  </span>
                ) : (
                  <span className="text-amber-600 font-medium font-mono text-xs">
                    {100 - completionPercentage}% lagi
                  </span>
                )}
              </div>
            </div>

            {/* Category Breakdown list inside Activity Card */}
            <div className="space-y-2.5 pt-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                PROGRES PER KATEGORI
              </div>
              <div className="space-y-2.5">
                {categoryStats.slice(0, 3).map((cat) => (
                  <div key={cat.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-800">{cat.name}</span>
                      <span className="text-slate-500 text-xs">
                        {cat.completed}/{cat.total} ({cat.percent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 rounded-full transition-all duration-300"
                        style={{ width: `${cat.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick Focus / Pomodoro Timer Widget */}
          <div id="focus-timer-section">
            <QuickFocusTimer 
              tasks={tasks}
              onTaskCompleted={onToggleStatus}
            />
          </div>

        </div>

      </div>

    </div>
  );
};
