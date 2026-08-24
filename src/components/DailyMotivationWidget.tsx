import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  RefreshCw, 
  Zap, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Target,
  ArrowUpRight
} from 'lucide-react';
import { StreakData, TaskItem } from '../types';

interface DailyMotivationWidgetProps {
  tasks: TaskItem[];
  streakData: StreakData;
  onOpenAddTask: () => void;
  onBoostMotivation: () => void;
}

const MOTIVATIONAL_QUOTES = [
  {
    quote: "Setiap baris kode dan halaman yang kamu pelajari hari ini adalah investasi emas untuk masa depanmu.",
    author: "Fokus & Konsistensi",
    tag: "Mindset Juara"
  },
  {
    quote: "Konsistensi kecil setiap hari mengalahkan bakat yang malas. Selesaikan 1 tugas sekarang dengan bangga!",
    author: "Prinsip Produktif",
    tag: "Energi Harian"
  },
  {
    quote: "Jangan menunggu waktu luang untuk belajar; ciptakan waktu itu dan taklukkan targetmu!",
    author: "Manajemen Waktu",
    tag: "Semangat Belajar"
  },
  {
    quote: "Kemenangan besar tersusun dari serangkaian tugas kecil yang diselesaikan tanpa menunda-nunda.",
    author: "Langkah Pasti",
    tag: "Fokus Penuh"
  },
  {
    quote: "Kamu jauh lebih tangguh dari rasa malasmu. Tarik napas dalam, buka materi, dan mulai langkah pertama!",
    author: "Dorongan Diri",
    tag: "Booster Energi"
  }
];

export const DailyMotivationWidget: React.FC<DailyMotivationWidgetProps> = ({
  tasks,
  streakData,
  onOpenAddTask,
  onBoostMotivation
}) => {
  // Start minimized as floating action button (FAB) by default
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [quoteIndex, setQuoteIndex] = useState<number>(0);
  const [boostCount, setBoostCount] = useState<number>(0);
  const [boostAnimating, setBoostAnimating] = useState<boolean>(false);

  const activeTasksCount = tasks.filter(t => t.status !== 'completed').length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const currentQuote = MOTIVATIONAL_QUOTES[quoteIndex];

  const handleNextQuote = () => {
    setQuoteIndex(prev => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const handleTriggerBoost = () => {
    setBoostCount(prev => prev + 1);
    setBoostAnimating(true);
    setTimeout(() => setBoostAnimating(false), 900);
    onBoostMotivation();
  };

  return (
    <>
      {/* Minimized Floating Action Button (FAB) at Bottom-Right */}
      <div className={`fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 transition-all duration-300 ${
        !isExpanded 
          ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto' 
          : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
      }`}>
        <button
          type="button"
          id="floating-motivation-fab"
          onClick={() => setIsExpanded(true)}
          aria-label="Buka Motivasi & Tugas Cepat"
          title="Buka Daily Motivation & Quick Task"
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 text-white border border-indigo-500/30 shadow-lg shadow-indigo-950/40 hover:shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          {/* Subtle pulse ring */}
          <span className="absolute inset-0 rounded-full bg-indigo-500 opacity-25 animate-ping pointer-events-none" />

          {/* Lightning / Flame Icon in warm amber */}
          <Zap className="w-6 h-6 text-amber-400 fill-amber-400/20 group-hover:rotate-12 transition-transform drop-shadow" />

          {/* Daily Active Tasks / Target Badge */}
          {activeTasksCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-mono font-bold text-white border border-indigo-400/60 shadow-xs">
              {activeTasksCount}
            </span>
          )}

          {/* Tooltip on Hover */}
          <span className="pointer-events-none absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 shadow-xl transition-opacity group-hover:opacity-100 border border-slate-700">
            ⚡ Daily Motivation & Tugas ({streakData.count} Hari Streak)
          </span>
        </button>
      </div>

      {/* Expanded Modal & Backdrop Overlay - ONLY rendered when isExpanded is true */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden animate-in fade-in duration-200">
          
          {/* Glass Backdrop Overlay */}
          <div 
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity cursor-pointer"
            aria-hidden="true"
          />

          {/* Modal Card: Midnight Indigo & Slate Glassmorphism */}
          <div
            id="daily-motivation-modal"
            className="relative w-full max-w-lg bg-slate-900/95 backdrop-blur-md border border-slate-700/50 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 z-10 shadow-2xl shadow-indigo-950/50 transition-all duration-200 ease-out animate-in zoom-in-95"
          >
            {/* Subtle glowing radial decor background */}
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-44 h-44 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />

            {/* Close Button (Top Right) */}
            <button
              type="button"
              id="close-motivation-widget"
              onClick={() => setIsExpanded(false)}
              aria-label="Tutup Motivasi"
              title="Tutup & Minimalkan ke Tombol Mengambang"
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all active:scale-95 z-20 border border-slate-700/60 cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="relative z-10 space-y-4 sm:space-y-5">
              
              {/* Header / Badges */}
              <div className="flex flex-wrap items-center gap-2 pr-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-200 font-mono text-xs font-bold backdrop-blur-xs border border-indigo-700/50">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-bounce" />
                  <span>Daily Motivation & Quick Task</span>
                </div>

                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-200 font-mono text-xs font-bold border border-slate-700 shadow-2xs">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Streak {streakData.count} Hari</span>
                </div>
              </div>

              {/* Title & Target Status */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                  Semangat Belajar Hari Ini! ⚡
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Ada <span className="font-bold underline decoration-indigo-400 decoration-2 text-white">{activeTasksCount} tugas aktif</span> menunggumu. Ambil energi dan selesaikan targetmu!
                </p>
              </div>

              {/* Motivational Quote Box: Kotak Mindset Juara */}
              <div className="space-y-2.5 bg-slate-800/80 p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-700 backdrop-blur-xs relative group">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{currentQuote.tag}</span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleNextQuote}
                    title="Ganti Kutipan"
                    className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-700/70 hover:bg-slate-600 text-slate-200 hover:text-white border border-slate-600/50 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Kutipan Lain</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-100 italic">
                  "{currentQuote.quote}"
                </p>

                <div className="text-[11px] text-indigo-300 font-mono text-right">
                  — {currentQuote.author}
                </div>
              </div>

              {/* Daily Target & Streak Summary Grid */}
              <div className="grid grid-cols-2 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center justify-center">
                  <div className="text-[10px] text-slate-400 font-medium">Tugas Selesai</div>
                  <div className="text-sm sm:text-base font-mono font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{completedTasksCount} Tugas</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col items-center justify-center">
                  <div className="text-[10px] text-slate-400 font-medium">Rekor Streak Terbaik</div>
                  <div className="text-sm sm:text-base font-mono font-bold text-white flex items-center gap-1.5 mt-0.5">
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                    <span>{streakData.bestStreak || streakData.count} Hari</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Catat Tugas Baru & Ambil Energi */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
                
                {/* Add Task Button (Duplication '+ +' fixed) */}
                <button
                  type="button"
                  id="modal-quick-add-task-btn"
                  onClick={() => {
                    setIsExpanded(false);
                    onOpenAddTask();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-slate-100 text-slate-900 active:scale-98 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-indigo-600 stroke-[3]" />
                  <span>Catat Tugas Baru</span>
                </button>

                {/* Boost Energy Button: Indigo / Violet Gradient */}
                <button
                  type="button"
                  onClick={handleTriggerBoost}
                  title="Klik untuk menyalakan dorongan semangat"
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border border-indigo-400/30 shadow-md active:scale-95 transition-all cursor-pointer ${
                    boostAnimating ? 'ring-2 ring-amber-400/80 scale-105 from-indigo-500 to-violet-500' : ''
                  }`}
                >
                  <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{boostAnimating ? '🔥 Semangat Membara!' : 'Booster Energi'}</span>
                  {boostCount > 0 && (
                    <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-mono font-black ml-1">
                      +{boostCount}
                    </span>
                  )}
                </button>

              </div>

            </div>
          </div>

        </div>
      )}
    </>
  );
};
