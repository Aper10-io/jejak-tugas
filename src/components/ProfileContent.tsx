import React, { useState, useEffect } from 'react';
import { 
  X, 
  Flame, 
  Clock, 
  CheckCircle2, 
  BookOpen, 
  Settings2, 
  Volume2, 
  VolumeX, 
  Edit3, 
  Check, 
  Award
} from 'lucide-react';
import { TaskItem, StreakData } from '../types';
import { useFocusTimer } from '../context/FocusTimerContext';
import { playTimerCompletionSound } from '../utils/audioChime';

export interface ProfileContentProps {
  tasks: TaskItem[];
  streakData: StreakData;
  userName: string;
  onUpdateUserName: (name: string) => void;
  userInitials?: string;
  onUpdateUserInitials?: (initials: string) => void;
  onClose: () => void;
  isPopover?: boolean;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({
  tasks,
  streakData,
  userName,
  onUpdateUserName,
  userInitials = 'JT',
  onUpdateUserInitials,
  onClose,
  isPopover = false
}) => {
  const { completedSessions, mode, setMode } = useFocusTimer();

  // Local state for editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const [isEditingInitials, setIsEditingInitials] = useState(false);
  const [tempInitials, setTempInitials] = useState(userInitials);

  // Settings State
  const [defaultTimer, setDefaultTimer] = useState<string>(() => {
    try {
      return localStorage.getItem('jejak_default_timer_mins') || '25';
    } catch {
      return '25';
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('jejak_sound_notification') !== 'false';
    } catch {
      return true;
    }
  });

  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    setTempName(userName);
    setTempInitials(userInitials);
    setIsEditingName(false);
    setIsEditingInitials(false);
    setSavedFeedback(false);
  }, [userName, userInitials]);

  // Calculate learning metrics
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  
  // Total Focus Time estimation
  const totalFocusMinutes = (completedSessions * 25) + 765; // Base 12h 45m (765m) + additional sessions
  const focusHours = Math.floor(totalFocusMinutes / 60);
  const focusMins = totalFocusMinutes % 60;

  const totalMaterials = tasks.filter(t => t.readingContent || t.notes || (t.subtasks && t.subtasks.length > 0)).length;

  const handleSaveName = () => {
    const trimmed = tempName.trim() || 'Sahabat Belajar';
    onUpdateUserName(trimmed);
    setIsEditingName(false);
  };

  const handleSaveInitials = () => {
    const trimmed = tempInitials.trim().slice(0, 3).toUpperCase() || 'JT';
    if (onUpdateUserInitials) {
      onUpdateUserInitials(trimmed);
    }
    setIsEditingInitials(false);
  };

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('jejak_default_timer_mins', defaultTimer);
      localStorage.setItem('jejak_sound_notification', String(soundEnabled));
      if (defaultTimer === '25' && mode !== 'focus25') {
        setMode('focus25');
      } else if (defaultTimer === '15' && mode !== 'focus15') {
        setMode('focus15');
      }
    } catch (e) {
      console.error(e);
    }

    if (isEditingName) {
      handleSaveName();
    }
    if (isEditingInitials) {
      handleSaveInitials();
    }

    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 700);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden text-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80 shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              Profil & Ruang Belajar
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Statistik aktivitas & preferensi aplikasi
            </p>
          </div>
        </div>

        <button
          type="button"
          id="close-profile-btn"
          onClick={onClose}
          aria-label="Tutup Profil"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content Body without double scrollbars */}
      <div className="overflow-y-auto overflow-x-hidden pr-0.5 my-3 space-y-4 flex-1">
        
        {/* 1. Profile Header & Editable Identity */}
        <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl p-3.5">
          {/* Avatar with edit mini button */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-950 text-white flex items-center justify-center font-mono font-bold text-lg shadow-md ring-2 ring-white">
              {userInitials}
            </div>
            
            {isEditingInitials ? (
              <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-white p-1 rounded-lg shadow-md border border-slate-200 z-10">
                <input
                  type="text"
                  maxLength={3}
                  value={tempInitials}
                  onChange={(e) => setTempInitials(e.target.value.toUpperCase())}
                  className="w-8 text-center text-xs font-mono font-bold bg-slate-100 rounded border border-slate-300 py-0.5 outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveInitials}
                  className="p-1 bg-emerald-500 text-white rounded hover:bg-emerald-600 cursor-pointer"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingInitials(true)}
                title="Ubah Inisial Avatar"
                className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-sm transition-transform active:scale-95 cursor-pointer ring-2 ring-white"
              >
                <Edit3 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </button>
            )}
          </div>

          {/* Editable Name & Status */}
          <div className="min-w-0 flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-1.5 mb-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full text-xs sm:text-sm font-bold text-slate-800 bg-white border border-amber-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-amber-400 outline-none"
                  placeholder="Nama Pengguna"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all cursor-pointer shrink-0"
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 group mb-0.5">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 truncate">
                  {userName}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-200/60 cursor-pointer shrink-0"
                  title="Ubah Nama"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] sm:text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Status: Aktif Belajar
              </span>
              <span className="text-[10px] text-slate-400">
                v2.4
              </span>
            </div>
          </div>
        </div>

        {/* 2. Grid Kartu Statistik Belajar (Learning Metrics 2x2) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Metrik & Capaian Belajar
            </h4>
            <span className="text-[10px] text-amber-600 font-medium">
              Pembaruan Real-Time
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            
            {/* Kartu 1: 🔥 Streak Belajar */}
            <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/50 border border-amber-200/80 rounded-2xl p-3 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between text-amber-700 mb-1">
                <span className="text-xs font-semibold">🔥 Streak</span>
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-extrabold text-amber-950 leading-tight">
                  {streakData.count} Hari Aktif
                </div>
                <div className="text-[10px] text-amber-700/90 mt-0.5">
                  Rekor: {streakData.bestStreak || streakData.count} Hari
                </div>
              </div>
            </div>

            {/* Kartu 2: ⏱️ Total Fokus */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-xs font-semibold">⏱️ Total Fokus</span>
                <Clock className="w-3.5 h-3.5 text-slate-500" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight font-mono">
                  {focusHours}j {focusMins}m
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {completedSessions} sesi tuntas
                </div>
              </div>
            </div>

            {/* Kartu 3: ✅ Tugas Tuntas */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-xs font-semibold">✅ Tugas Tuntas</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                  {completedTasks.length}/{totalTasks}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Tingkat Selesai: {taskCompletionRate}%
                </div>
              </div>
            </div>

            {/* Kartu 4: 📖 Ruang Materi */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col justify-between shadow-2xs">
              <div className="flex items-center justify-between text-slate-600 mb-1">
                <span className="text-xs font-semibold">📖 Ruang Materi</span>
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                  {totalMaterials} Materi
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Siap dipelajari & dibaca
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Pengaturan Sederhana (App Settings) */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
            <Settings2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Pengaturan Belajar & Timer</span>
          </div>

          {/* Pilihan Default Timer Pomodoro */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Durasi Sesi Fokus:</span>
              <span className="font-mono text-amber-600 font-bold">{defaultTimer} Menit</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { value: '25', label: '25m', desc: 'Standar' },
                { value: '45', label: '45m', desc: 'Mendalam' },
                { value: '50', label: '50m', desc: 'Intensif' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDefaultTimer(opt.value)}
                  className={`py-1.5 px-2 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                    defaultTimer === opt.value
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-semibold">{opt.label}</div>
                  <div className={`text-[9px] ${defaultTimer === opt.value ? 'text-slate-300' : 'text-slate-400'}`}>
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Switch Toggle: Notifikasi Suara Timer (iOS Style) */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                  <Volume2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border border-slate-200">
                  <VolumeX className="w-4 h-4" />
                </div>
              )}
              <div>
                <div className="text-xs font-semibold text-slate-800">
                  Notifikasi Suara Timer
                </div>
                <div className="text-[10px] text-slate-500">
                  Dering saat sesi fokus atau istirahat tuntas
                </div>
              </div>
            </div>

            <button
              type="button"
              id="toggle-sound-notification"
              role="switch"
              aria-checked={soundEnabled}
              aria-label="Aktifkan notifikasi suara timer"
              onClick={() => {
                const nextVal = !soundEnabled;
                setSoundEnabled(nextVal);
                try {
                  localStorage.setItem('jejak_sound_notification', String(nextVal));
                  if (nextVal) {
                    playTimerCompletionSound('break');
                  }
                } catch (e) {
                  console.error(e);
                }
              }}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-1 ${
                soundEnabled ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transform transition-transform duration-200 ease-in-out ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

        </div>

      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer text-center"
        >
          Tutup
        </button>
        
        <button
          type="button"
          id="save-profile-settings-btn"
          onClick={handleSaveSettings}
          className="flex-1 py-2 px-3 sm:py-2.5 sm:px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
        >
          {savedFeedback ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Tersimpan!</span>
            </>
          ) : (
            <span>Simpan Perubahan</span>
          )}
        </button>
      </div>

    </div>
  );
};
