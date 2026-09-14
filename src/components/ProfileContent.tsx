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
  Award,
  Calendar,
  Activity,
  Info
} from 'lucide-react';
import { TaskItem, StreakData } from '../types';
import { useFocusTimer } from '../context/FocusTimerContext';
import { playTimerCompletionSound } from '../utils/audioChime';
import { formatJoinedDate, formatAppUsageTime } from '../utils/timeFormat';

export interface ProfileContentProps {
  tasks: TaskItem[];
  streakData: StreakData;
  userName: string;
  onUpdateUserName: (name: string) => void;
  userInitials?: string;
  onUpdateUserInitials?: (initials: string) => void;
  onClose: () => void;
  isPopover?: boolean;
  firstJoinedDate?: string;
  appUsageSeconds?: number;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({
  tasks,
  streakData,
  userName,
  onUpdateUserName,
  userInitials = 'JT',
  onUpdateUserInitials,
  onClose,
  isPopover = false,
  firstJoinedDate,
  appUsageSeconds = 0
}) => {
  const { mode, setMode } = useFocusTimer();

  // Local state for editing identity
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

  // Calculate clean learning metrics
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const totalTasks = tasks.length;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  
  // Total Materials (tasks with reading content, notes, or subtasks)
  const totalMaterials = tasks.filter(t => t.readingContent || t.notes || (t.subtasks && t.subtasks.length > 0) || t.category === 'Membaca').length;

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
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/80 shrink-0 shadow-2xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Profil & Ruang Belajar
            </h2>
            <p className="text-xs text-slate-400">
              Statistik aktivitas & preferensi aplikasi
            </p>
          </div>
        </div>

        <button
          type="button"
          id="close-profile-btn"
          onClick={onClose}
          aria-label="Tutup Profil"
          className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="overflow-y-auto overflow-x-hidden pr-0.5 my-3 space-y-4 flex-1">
        
        {/* 1. Profile Header & Editable Identity */}
        <div className="flex items-center gap-4 bg-white border border-slate-200/80 rounded-3xl p-4 shadow-2xs">
          {/* Avatar with edit mini button */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center font-mono font-bold text-xl shadow-sm">
              {userInitials}
            </div>
            
            {isEditingInitials ? (
              <div className="absolute -bottom-2 -right-2 flex items-center gap-1 bg-white p-1 rounded-lg shadow-md border border-slate-200 z-10">
                <input
                  type="text"
                  maxLength={3}
                  value={tempInitials}
                  onChange={(e) => setTempInitials(e.target.value.toUpperCase())}
                  className="w-8 text-center text-xs font-mono font-bold bg-slate-100 text-slate-900 rounded border border-slate-300 py-0.5 outline-none"
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
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold flex items-center justify-center shadow-sm transition-transform active:scale-95 cursor-pointer ring-2 ring-white"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Editable Name, Status, & Version */}
          <div className="min-w-0 flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-1.5 mb-1.5">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full text-sm font-bold text-slate-900 bg-white border border-amber-400 rounded-lg px-2.5 py-1 focus:ring-2 focus:ring-amber-400 outline-none"
                  placeholder="Nama Pengguna"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="p-1.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 transition-all cursor-pointer shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 group mb-1">
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {userName}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-100 cursor-pointer shrink-0"
                  title="Ubah Nama"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200/60 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Status: Aktif Belajar
              </span>
              <span className="text-xs text-slate-400">
                v2.4
              </span>
            </div>
          </div>
        </div>

        {/* 2. Grid Kartu Statistik Belajar (4 Kartu Metrik - Sesuai Persis Gambar Referensi) */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <h4 className="text-sm sm:text-base font-extrabold tracking-wide text-slate-900 uppercase">
              METRIK & CAPAIAN BELAJAR
            </h4>
            <span className="text-[#00BCD4] text-xs font-medium inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00BCD4]" />
              Pembaruan Real-Time
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Kartu 1: 🔥 Streak */}
            <div className="bg-gradient-to-tr from-white via-white to-orange-50/40 border border-slate-100/90 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>Streak</span>
                </div>
              </div>
              <div>
                <div className="text-slate-900 font-extrabold text-2xl mt-4 leading-tight font-sans">
                  {streakData.count} Hari Aktif
                </div>
                <div className="text-slate-400 text-xs mt-1">
                  Rekor: {streakData.bestStreak || streakData.count || 0} Hari
                </div>
              </div>
            </div>

            {/* Kartu 2: ⏱️ Time Activity */}
            <div className="bg-gradient-to-tr from-white via-white to-sky-50/50 border border-slate-100/90 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-teal-600" />
                  <span>Time Activity</span>
                </div>
                <div className="relative group/info">
                  <Info 
                    className="w-4 h-4 text-slate-300 hover:text-slate-500 cursor-pointer shrink-0 transition-colors" 
                  />
                  <div className="absolute right-0 top-6 hidden group-hover/info:block w-48 p-2.5 bg-slate-800 text-white text-[11px] rounded-xl shadow-xl z-50 pointer-events-none leading-relaxed">
                    Waktu aktif selama kamu berada di website ini. Otomatis berhenti jika berpindah tab atau menutup website.
                  </div>
                </div>
              </div>
              <div>
                <div className="text-slate-900 font-extrabold text-2xl mt-4 leading-tight font-sans tracking-tight">
                  {formatAppUsageTime(appUsageSeconds)}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Aktif di website</span>
                </div>
              </div>
            </div>

            {/* Kartu 3: ✅ Tugas Tuntas */}
            <div className="bg-white border border-slate-100/90 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Tugas Tuntas</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              </div>
              <div>
                <div className="text-slate-900 font-extrabold text-2xl mt-4 leading-tight font-sans">
                  {completedTasks.length}/{totalTasks}
                </div>
                {/* Progres Bar Teal */}
                <div className="bg-slate-100 rounded-full h-1.5 w-full mt-3 overflow-hidden">
                  <div 
                    className="bg-[#00897B] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, taskCompletionRate)}%` }}
                  />
                </div>
                <div className="text-slate-400 text-xs mt-2">
                  Tingkat Selesai: {taskCompletionRate}%
                </div>
              </div>
            </div>

            {/* Kartu 4: 📖 Ruang Materi */}
            <div className="bg-white border border-slate-100/90 rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-700" />
                  <span>Ruang Materi</span>
                </div>
                <BookOpen className="w-4 h-4 text-slate-300 shrink-0" />
              </div>
              <div>
                <div className="text-slate-900 font-extrabold text-2xl mt-4 leading-tight font-sans">
                  {totalMaterials} Materi
                </div>
                <div className="text-slate-400 text-xs mt-1">
                  Siap dipelajari & dibaca
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Pengaturan Belajar & Timer */}
        <div className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Settings2 className="w-3.5 h-3.5 text-slate-500" />
            <span>PENGATURAN BELAJAR & TIMER</span>
          </div>

          {/* Pilihan Default Timer Pomodoro */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
              <span>Durasi Sesi Fokus:</span>
              <span className="font-mono text-amber-600 font-bold">{defaultTimer} Menit</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: '25', label: '25m', desc: 'Standar' },
                { value: '45', label: '45m', desc: 'Mendalam' },
                { value: '50', label: '50m', desc: 'Intensif' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDefaultTimer(opt.value)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                    defaultTimer === opt.value
                      ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs font-bold'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm">{opt.label}</div>
                  <div className={`text-[10px] ${defaultTimer === opt.value ? 'text-slate-300' : 'text-slate-400'}`}>
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Switch Toggle: Notifikasi Suara Timer */}
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
                <div className="text-[10px] text-slate-400">
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
              style={{ width: '44px', height: '24px', padding: '2px', boxSizing: 'border-box' }}
              className={`relative inline-flex items-center shrink-0 cursor-pointer rounded-full border-0 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                soundEnabled ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <span
                aria-hidden="true"
                style={{
                  width: '20px',
                  height: '20px',
                  transform: soundEnabled ? 'translateX(20px)' : 'translateX(0px)',
                  boxSizing: 'border-box'
                }}
                className="pointer-events-none inline-block rounded-full bg-white shadow-md transition-transform duration-200 ease-in-out"
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
          className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
        >
          Tutup
        </button>
        
        <button
          type="button"
          id="save-profile-settings-btn"
          onClick={handleSaveSettings}
          className="flex-1 py-2.5 px-4 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white text-xs sm:text-sm font-medium shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
        >
          {savedFeedback ? (
            <>
              <Check className="w-4 h-4 text-white" />
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
