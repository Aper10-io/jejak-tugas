import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer, 
  Sparkles, 
  CheckCircle2, 
  Coffee,
  ChevronDown,
  Target,
  Check
} from 'lucide-react';
import { TaskItem, TaskPriority } from '../types';
import { useFocusTimer, TIMER_CONFIGS, TimerMode } from '../context/FocusTimerContext';

interface QuickFocusTimerProps {
  tasks: TaskItem[];
  onTaskCompleted?: (taskId: string) => void;
}

export const QuickFocusTimer: React.FC<QuickFocusTimerProps> = ({ tasks, onTaskCompleted }) => {
  const {
    mode,
    timeLeft,
    isRunning,
    selectedTaskId,
    completedSessions,
    isFinishedAlert,
    currentDuration,
    progressPercent,
    formattedTime,
    selectedTask,
    setMode,
    setSelectedTaskId,
    toggleTimer,
    resetTimer,
    dismissFinishedAlert
  } = useFocusTimer();

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeTasks = tasks.filter(t => t.status !== 'completed');

  // Click outside listener for task dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // SVG Circular Ring calculation
  const ringRadius = 54;
  const circumference = 2 * Math.PI * ringRadius;
  const progressFraction = Math.max(0, Math.min(1, (currentDuration - timeLeft) / currentDuration));
  const strokeDashoffset = circumference - (progressFraction * circumference);

  const getPriorityDot = (p?: TaskPriority) => {
    if (p === 'tinggi') return 'bg-rose-500';
    if (p === 'sedang') return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const isPaused = !isRunning && timeLeft < currentDuration && timeLeft > 0;
  const isFinished = timeLeft === 0;

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-4 relative">
      
      {/* Top Header with Generous Padding & Badges */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isRunning 
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30 ring-2 ring-amber-400/50 scale-105' 
              : 'bg-stone-100 text-stone-700'
          }`}>
            <Timer className={`w-4 h-4 ${isRunning ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Sesi Fokus / Timer Belajar
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Teknik Pomodoro konsentrasi maksimal
            </p>
          </div>
        </div>

        {completedSessions > 0 && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono font-bold shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{completedSessions} Selesai</span>
          </div>
        )}
      </div>

      {/* Task Selector Dropdown with Inline Tag & Title Formatting */}
      <div className="space-y-1.5" ref={dropdownRef}>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">Target Tugas:</span>
          {selectedTask && (
            <span className="text-[10px] text-amber-800 font-mono font-bold bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-full truncate max-w-[150px]">
              {selectedTask.category}
            </span>
          )}
        </div>

        {activeTasks.length === 0 ? (
          <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
            Semua tugas telah tuntas! Nikmati waktu istirahatmu.
          </div>
        ) : (
          <div className="relative">
            {/* Custom Dropdown Trigger */}
            <button
              type="button"
              onClick={() => setIsDropdownOpen(prev => !prev)}
              className="w-full flex items-center justify-between gap-2 py-2 px-3 bg-slate-50 hover:bg-slate-100/90 text-slate-800 border border-slate-200/90 rounded-xl text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-stone-900/10 cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2 min-w-0 truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 ${getPriorityDot(selectedTask?.priority)}`} />
                {selectedTask ? (
                  <div className="truncate flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.2 rounded shrink-0">
                      [{selectedTask.category}]
                    </span>
                    <span className="truncate font-semibold text-slate-900">
                      {selectedTask.title}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400 font-normal">Pilih Tugas Target...</span>
                )}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Custom Dropdown List */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-xl border border-slate-200 shadow-xl z-50 py-1 max-h-56 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                {activeTasks.map((t) => {
                  const isSelected = t.id === selectedTaskId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedTaskId(t.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between text-left px-3 py-2 text-xs transition-colors cursor-pointer ${
                        isSelected ? 'bg-amber-50/80 font-bold text-slate-900' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${getPriorityDot(t.priority)}`} />
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-stone-100 px-1 py-0.2 rounded shrink-0">
                          [{t.category}]
                        </span>
                        <span className="truncate">{t.title}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 stroke-[2.5]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mode Switcher Tabs (25m Fokus, 15m Kilat, 5m Jeda) */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100/90 rounded-xl">
        {(Object.keys(TIMER_CONFIGS) as TimerMode[]).map((key) => {
          const cfg = TIMER_CONFIGS[key];
          const IconComp = key === 'focus25' ? Target : key === 'focus15' ? Sparkles : Coffee;
          const isActive = mode === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <IconComp className={`w-3 h-3 shrink-0 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className="whitespace-nowrap">{cfg.label}</span>
            </button>
          );
        })}
      </div>

      {/* Timer Display Card with Circular Progress Ring & Glow */}
      <div className={`bg-gradient-to-b from-slate-900 via-stone-900 to-slate-950 text-white rounded-2xl p-4 sm:p-5 text-center relative overflow-hidden shadow-inner transition-all duration-500 border ${
        isRunning 
          ? 'border-amber-500/50 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/30' 
          : isPaused
            ? 'border-emerald-500/40 ring-1 ring-emerald-500/20'
            : 'border-stone-800'
      }`}>
        {/* Glow backdrop during active state */}
        <div className={`absolute inset-0 bg-amber-500/15 transition-opacity duration-500 blur-xl ${isRunning ? 'opacity-100 animate-pulse' : 'opacity-0'}`} />

        <div className="relative z-10 flex flex-col items-center justify-center space-y-3">
          
          {/* Status Chip */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-amber-200 text-[11px] font-medium border border-white/10 backdrop-blur-xs">
            <span className={`w-1.5 h-1.5 rounded-full ${
              isRunning 
                ? 'bg-emerald-400 animate-ping' 
                : isPaused
                  ? 'bg-amber-400'
                  : 'bg-stone-400'
            }`} />
            <span>
              {isRunning 
                ? 'Sesi Sedang Berjalan' 
                : isFinishedAlert 
                  ? '🎉 Sesi Berakhir!' 
                  : isPaused
                    ? '⏸️ Sesi Dijeda'
                    : 'Siap Mulai Fokus'}
            </span>
          </div>

          {/* Circular Progress Display with Smooth SVG Stroke Transition */}
          <div className="relative w-36 h-36 flex items-center justify-center my-1">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              {/* Background Track */}
              <circle
                cx="60"
                cy="60"
                r={ringRadius}
                className="text-white/10"
                strokeWidth="7"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <circle
                cx="60"
                cy="60"
                r={ringRadius}
                className={`transition-all duration-1000 ease-linear ${
                  isRunning ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]' : isPaused ? 'text-emerald-400' : 'text-orange-400'
                }`}
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Centered Big Digital Clock with Glow */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className={`font-mono text-3xl font-bold tracking-tight text-white transition-all ${
                isRunning ? 'drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' : ''
              }`}>
                {formattedTime}
              </span>
              <span className="text-[10px] text-amber-200/80 font-mono mt-0.5">
                {progressPercent}% waktu berlalu
              </span>
            </div>
          </div>

          {/* Dynamic Action Buttons */}
          <div className="flex items-center gap-2.5 w-full mt-4">
            <button
              type="button"
              id="focus-timer-toggle-btn"
              onClick={toggleTimer}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm tracking-wide transition-all duration-200 active:scale-[0.98] cursor-pointer ${
                isRunning
                  ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 font-semibold'
                  : isPaused
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold shadow-lg shadow-amber-500/25 border-0'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Jeda Sesi</span>
                </>
              ) : isPaused ? (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Lanjutkan</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Mulai Fokus</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="focus-timer-reset-btn"
              onClick={resetTimer}
              title="Reset Timer"
              className="w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700/90 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};
