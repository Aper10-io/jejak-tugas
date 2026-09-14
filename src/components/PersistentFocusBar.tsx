import React from 'react';
import { useFocusTimer } from '../context/FocusTimerContext';
import { ViewMode } from '../types';
import { Play, Pause, RotateCcw, Timer, ExternalLink } from 'lucide-react';

interface PersistentFocusBarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const PersistentFocusBar: React.FC<PersistentFocusBarProps> = ({
  currentView,
  onViewChange
}) => {
  const {
    isRunning,
    timeLeft,
    currentDuration,
    formattedTime,
    selectedTask,
    mode,
    toggleTimer,
    resetTimer,
    isFinishedAlert
  } = useFocusTimer();

  // Show if timer is running OR if it has been started and paused (not at fresh full duration) OR if finished alert is active
  const hasActiveSession = isRunning || (timeLeft < currentDuration && timeLeft > 0) || isFinishedAlert;

  if (!hasActiveSession) return null;

  const isBreak = mode === 'break5';

  return (
    <aside
      aria-label="Floating Active Focus Session"
      className="fixed bottom-14 sm:bottom-4 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      <div 
        className={`bg-slate-950/95 text-white backdrop-blur-md rounded-2xl p-3 sm:px-4 sm:py-3.5 border shadow-xl flex items-center justify-between gap-3 ${
          isRunning 
            ? 'border-amber-500/50 ring-1 ring-amber-400/30 shadow-[0_4px_20px_rgba(245,158,11,0.2)]' 
            : 'border-slate-800'
        }`}
      >
        {/* Left Side: Clickable to go to Dashboard Timer */}
        <button
          type="button"
          onClick={() => {
            if (currentView !== 'dashboard') {
              onViewChange('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer group flex-1 pr-1"
          title="Klik untuk buka Dashboard Focus Timer"
        >
          {/* Pulsing Icon */}
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
            isRunning 
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' 
              : 'bg-slate-800 text-slate-400'
          }`}>
            <Timer className={`w-4 h-4 ${isRunning ? 'animate-pulse' : ''}`} />
          </div>

          <div className="min-w-0 space-y-0.5">
            {/* Header / Countdown */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm sm:text-base font-bold text-white tracking-tight">
                {formattedTime}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                isRunning 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                  : isFinishedAlert
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-slate-800 text-slate-400'
              }`}>
                {isRunning ? (isBreak ? 'Jeda Aktif' : 'Fokus Berjalan') : isFinishedAlert ? 'Selesai 🎉' : 'Dijeda'}
              </span>
            </div>

            {/* Task or Mode inline text */}
            <p className="text-[11px] text-slate-300 truncate group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
              {selectedTask ? (
                <>
                  <span className="text-[9px] bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                    {selectedTask.category}
                  </span>
                  <span className="truncate">{selectedTask.title}</span>
                </>
              ) : (
                <span className="text-slate-400">Sesi Fokus Terbuka</span>
              )}
            </p>
          </div>
        </button>

        {/* Right Side: Quick Action Controls with safe margins & touch targets */}
        <div className="flex items-center gap-2 shrink-0 pl-1 pr-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleTimer();
            }}
            className={`p-2 sm:p-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer flex items-center gap-1 shadow-sm ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title={isRunning ? 'Jeda Sesi' : 'Lanjutkan Sesi'}
          >
            {isRunning ? (
              <Pause className="w-3.5 h-3.5 fill-current" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetTimer();
            }}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700 shadow-sm"
            title="Reset Timer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  );
};
