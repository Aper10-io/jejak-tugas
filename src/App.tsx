/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { TaskItem, ViewMode, TaskFilter, StreakData, TaskCategory } from './types';
import { INITIAL_TASKS } from './data/initialData';
import { TaskNavbar } from './components/TaskNavbar';
import { TaskDashboard } from './components/TaskDashboard';
import { TaskList } from './components/TaskList';
import { TaskReaderView } from './components/TaskReaderView';
import { TaskReaderModal } from './components/TaskReaderModal';
import { AddTaskModal } from './components/AddTaskModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { ProfileModal } from './components/ProfileModal';
import { DailyMotivationWidget } from './components/DailyMotivationWidget';
import { MobileBottomNav } from './components/MobileBottomNav';
import { FocusTimerProvider, TimerMode } from './context/FocusTimerContext';
import { PersistentFocusBar } from './components/PersistentFocusBar';
import { triggerSideConfetti } from './utils/confetti';

// Streak helper utilities
const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayDateString = (): string => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const initOrUpdateStreak = (): StreakData => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  try {
    const raw = localStorage.getItem('jejak_streak_data');
    if (!raw) {
      const initial: StreakData = {
        count: 0,
        lastLoginDate: today,
        history: [today],
        bestStreak: 0
      };
      localStorage.setItem('jejak_streak_data', JSON.stringify(initial));
      return initial;
    }

    const data: StreakData = JSON.parse(raw);
    const prevCount = typeof data.count === 'number' && data.count >= 0 ? data.count : 0;
    const prevBest = typeof data.bestStreak === 'number' && data.bestStreak >= 0 ? data.bestStreak : prevCount;
    const history = Array.isArray(data.history) ? data.history : (data.lastLoginDate ? [data.lastLoginDate] : [today]);

    // If initial streak is 0, remain 0 until first task/timer activation
    if (prevCount === 0) {
      return {
        count: 0,
        lastLoginDate: data.lastLoginDate || today,
        history: history.includes(today) ? history : [...history, today],
        bestStreak: prevBest
      };
    }

    // Already checked in today
    if (data.lastLoginDate === today) {
      return {
        count: prevCount,
        lastLoginDate: today,
        history: history.includes(today) ? history : [...history, today],
        bestStreak: Math.max(prevBest, prevCount)
      };
    }

    // Consecutive login from yesterday
    if (data.lastLoginDate === yesterday) {
      const newCount = prevCount + 1;
      const updated: StreakData = {
        count: newCount,
        lastLoginDate: today,
        history: history.includes(today) ? history : [...history, today],
        bestStreak: Math.max(prevBest, newCount)
      };
      localStorage.setItem('jejak_streak_data', JSON.stringify(updated));
      return updated;
    }

    // Missed 1 or more days -> streak reset to 1
    const resetData: StreakData = {
      count: 1,
      lastLoginDate: today,
      history: history.includes(today) ? history : [...history, today],
      bestStreak: Math.max(prevBest, 1)
    };
    localStorage.setItem('jejak_streak_data', JSON.stringify(resetData));
    return resetData;
  } catch {
    const fallback: StreakData = {
      count: 0,
      lastLoginDate: today,
      history: [today],
      bestStreak: 0
    };
    return fallback;
  }
};

export default function App() {
  // Navigation & Search State
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  // Streak state (initialized per day on app open)
  const [streakData, setStreakData] = useState<StreakData>(() => initOrUpdateStreak());

  // Persistence in LocalStorage for tasks
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem('jejak_tugas_list');
      if (saved) {
        const parsed: TaskItem[] = JSON.parse(saved);
        return parsed.map(t => ({
          ...t,
          category: (t.category as string === 'Coding' ? 'Pemrograman' : t.category) as TaskCategory
        }));
      }
      return INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // App Usage (Screen Time / Tab Open Time in seconds)
  const [appUsageSeconds, setAppUsageSeconds] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('app_usage_time_seconds');
      if (saved) {
        const parsed = parseInt(saved, 10);
        return !isNaN(parsed) && parsed >= 0 ? parsed : 0;
      }
      return 0;
    } catch {
      return 0;
    }
  });

  // First Joined Date
  const [firstJoinedDate, setFirstJoinedDate] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('jejak_first_joined_date');
      if (saved) return saved;
      const nowIso = new Date().toISOString();
      localStorage.setItem('jejak_first_joined_date', nowIso);
      return nowIso;
    } catch {
      return new Date().toISOString();
    }
  });

  // Modals & Active State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [readingTask, setReadingTask] = useState<TaskItem | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<TaskItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User Profile State
  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem('jejak_user_name') || 'Sahabat Belajar';
    } catch {
      return 'Sahabat Belajar';
    }
  });

  const [userInitials, setUserInitials] = useState<string>(() => {
    try {
      return localStorage.getItem('jejak_user_initials') || 'JT';
    } catch {
      return 'JT';
    }
  });

  // Keep a ref to the latest appUsageSeconds so event handlers have current value without tearing down the timer effect
  const appUsageSecondsRef = useRef(appUsageSeconds);
  useEffect(() => {
    appUsageSecondsRef.current = appUsageSeconds;
  }, [appUsageSeconds]);

  // 1. App Usage Real-Time Tracker with Visibility State Pause
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible' && !document.hidden) {
        setAppUsageSeconds(prev => {
          const next = prev + 1;
          if (next % 5 === 0) {
            try {
              localStorage.setItem('app_usage_time_seconds', String(next));
            } catch (e) {
              console.error(e);
            }
          }
          return next;
        });
      }
    }, 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        try {
          localStorage.setItem('app_usage_time_seconds', String(appUsageSecondsRef.current));
        } catch (e) {
          console.error(e);
        }
      }
    };

    const handleBeforeUnload = () => {
      try {
        localStorage.setItem('app_usage_time_seconds', String(appUsageSecondsRef.current));
      } catch (e) {
        console.error(e);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleUpdateUserName = (name: string) => {
    setUserName(name);
    try {
      localStorage.setItem('jejak_user_name', name);
    } catch (e) {
      console.error(e);
    }
    showToast(`Nama diperbarui: ${name}`);
  };

  const handleUpdateUserInitials = (initials: string) => {
    setUserInitials(initials);
    try {
      localStorage.setItem('jejak_user_initials', initials);
    } catch (e) {
      console.error(e);
    }
  };

  // Sync tasks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('jejak_tugas_list', JSON.stringify(tasks));
    } catch (e) {
      console.error(e);
    }
  }, [tasks]);

  // Track 100% task completion celebration trigger
  const prevPercentageRef = useRef<number | null>(null);
  useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'completed').length;
    const currentPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (prevPercentageRef.current !== null) {
      // Trigger celebration ONLY when transitioning to 100% completion
      if (prevPercentageRef.current < 100 && currentPercent === 100 && total > 0) {
        triggerSideConfetti();
        showToast('🎉 Luar biasa! Target harian tuntas 100%!');
      }
    }
    prevPercentageRef.current = currentPercent;
  }, [tasks]);

  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimeoutRef.current = null;
    }, 4000);
  };

  // Handlers
  const handleToggleStatus = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
          const isNowCompleted = nextStatus === 'completed';

          // If completing first task and streak was 0, trigger streak 1
          if (isNowCompleted && streakData.count === 0) {
            const today = getTodayDateString();
            const updated: StreakData = {
              count: 1,
              lastLoginDate: today,
              history: streakData.history.includes(today) ? streakData.history : [...streakData.history, today],
              bestStreak: Math.max(streakData.bestStreak, 1)
            };
            setStreakData(updated);
            try {
              localStorage.setItem('jejak_streak_data', JSON.stringify(updated));
            } catch (e) {
              console.error(e);
            }
          }

          return {
            ...t,
            status: nextStatus,
            completedAt: isNowCompleted ? new Date().toISOString().split('T')[0] : undefined
          };
        }
        return t;
      })
    );

    // Also update current reading modal task if open
    if (readingTask && readingTask.id === taskId) {
      setReadingTask(prev => {
        if (!prev) return null;
        const nextStatus = prev.status === 'completed' ? 'pending' : 'completed';
        return { ...prev, status: nextStatus };
      });
    }

    showToast('Status tugas diperbarui');
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          const updatedSubtasks = t.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );

    if (readingTask && readingTask.id === taskId) {
      setReadingTask(prev => {
        if (!prev) return null;
        return {
          ...prev,
          subtasks: prev.subtasks.map(st =>
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          )
        };
      });
    }
  };

  const handleUpdateNotes = (taskId: string, notes: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, notes } : t))
    );
    if (readingTask && readingTask.id === taskId) {
      setReadingTask(prev => prev ? { ...prev, notes } : null);
    }
    showToast('Catatan berhasil disimpan');
  };

  const handleUpdateTask = (updatedTask: TaskItem) => {
    setTasks(prev =>
      prev.map(t => (t.id === updatedTask.id ? updatedTask : t))
    );
    if (readingTask && readingTask.id === updatedTask.id) {
      setReadingTask(updatedTask);
    }
    showToast('Perubahan tugas berhasil disimpan');
  };

  const handleAddTask = (newTaskData: Omit<TaskItem, 'id' | 'createdAt'>) => {
    const created: TaskItem = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks(prev => [created, ...prev]);
    showToast('Tugas baru berhasil ditambahkan');
  };

  const handleDeleteTask = () => {
    if (!taskToDelete) return;
    setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
    if (readingTask && readingTask.id === taskToDelete.id) {
      setReadingTask(null);
    }
    setTaskToDelete(null);
    showToast('Tugas berhasil dihapus');
  };

  const handleBoostMotivation = () => {
    const energyPhrases = [
      '🔥 Energi bertambah! Kamu siap menyelesaikan target hari ini!',
      '⚡ Fokus menyala! 1 langkah kecil setiap hari!',
      '🚀 Semangat baru terisi! Selesaikan tugas dengan percaya diri!'
    ];
    const phrase = energyPhrases[Math.floor(Math.random() * energyPhrases.length)];
    showToast(phrase);
  };

  const handleTimerComplete = (finishedMode: TimerMode, type: 'focus' | 'break') => {
    if (type === 'break') {
      showToast('⏰ Waktu istirahat selesai! Siap untuk kembali fokus belajar.');
    } else {
      // First completed focus session activates streak if 0
      if (streakData.count === 0) {
        const today = getTodayDateString();
        const updated: StreakData = {
          count: 1,
          lastLoginDate: today,
          history: streakData.history.includes(today) ? streakData.history : [...streakData.history, today],
          bestStreak: Math.max(streakData.bestStreak, 1)
        };
        setStreakData(updated);
        try {
          localStorage.setItem('jejak_streak_data', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
      }
      showToast('🎉 Sesi fokus tuntas! Kerja bagus, istirahatlah sejenak.');
    }
  };

  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <FocusTimerProvider tasks={tasks} onTimerComplete={handleTimerComplete}>
      <div className="min-h-screen w-full bg-[#F8FAFC] text-slate-900 font-sans antialiased flex flex-col selection:bg-cyan-500 selection:text-white">
        
        {/* Top Fixed Header */}
        <TaskNavbar
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (q.trim() && currentView === 'dashboard') {
              setCurrentView('tugas');
            }
          }}
          onOpenAddTask={() => setIsAddModalOpen(true)}
          completedCount={completedCount}
          totalCount={tasks.length}
          streakData={streakData}
          tasks={tasks}
          userName={userName}
          onUpdateUserName={handleUpdateUserName}
          userInitials={userInitials}
          onUpdateUserInitials={handleUpdateUserInitials}
          onOpenMobileProfile={() => setIsProfileModalOpen(true)}
          firstJoinedDate={firstJoinedDate}
          appUsageSeconds={appUsageSeconds}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-5 sm:py-8 pb-28 sm:pb-8">
          
          {/* Toast feedback: Top-Center Modern Capsule Pill */}
          {toastMessage && (
            <div 
              role="status"
              aria-live="polite"
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-slate-100 border border-slate-700/60 shadow-xl backdrop-blur-md px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 max-w-[90vw] sm:max-w-md text-center justify-center animate-in fade-in slide-in-from-top-4 duration-300 pointer-events-none"
            >
              <span>{toastMessage}</span>
            </div>
          )}

          {/* View Routing */}
          {currentView === 'dashboard' && (
            <TaskDashboard
              tasks={tasks}
              streakData={streakData}
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                if (q.trim()) {
                  setCurrentView('tugas');
                }
              }}
              onToggleStatus={handleToggleStatus}
              onReadTask={(task) => setReadingTask(task)}
              onDeleteTask={(task) => setTaskToDelete(task)}
              onOpenAddTask={() => setIsAddModalOpen(true)}
              onGoToTaskList={(filter) => {
                if (filter) setTaskFilter(filter as TaskFilter);
                setCurrentView('tugas');
              }}
              onOpenProfile={() => setIsProfileModalOpen(true)}
              userName={userName}
              userInitials={userInitials}
            />
          )}

          {currentView === 'tugas' && (
            <TaskList
              tasks={tasks}
              filter={taskFilter}
              onFilterChange={setTaskFilter}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchQuery={searchQuery}
              onToggleStatus={handleToggleStatus}
              onReadTask={(task) => setReadingTask(task)}
              onDeleteTask={(task) => setTaskToDelete(task)}
              onOpenAddTask={() => setIsAddModalOpen(true)}
            />
          )}

          {currentView === 'baca' && (
            <TaskReaderView
              tasks={tasks}
              onToggleStatus={handleToggleStatus}
              onToggleSubtask={handleToggleSubtask}
              onUpdateNotes={handleUpdateNotes}
              onOpenAddTask={() => setIsAddModalOpen(true)}
            />
          )}

        </main>

        {/* Persistent Floating Focus Bar when Timer is active across pages */}
        <PersistentFocusBar
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Mobile Fixed Bottom Navigation Bar (< sm) */}
        <MobileBottomNav
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            setIsProfileModalOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          activeCount={tasks.filter(t => t.status !== 'completed').length}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          isProfileOpen={isProfileModalOpen}
          userInitials={userInitials}
        />

        {/* Modals */}
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          tasks={tasks}
          streakData={streakData}
          userName={userName}
          onUpdateUserName={handleUpdateUserName}
          userInitials={userInitials}
          onUpdateUserInitials={handleUpdateUserInitials}
          firstJoinedDate={firstJoinedDate}
          appUsageSeconds={appUsageSeconds}
        />

        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddTask={handleAddTask}
        />

        <TaskReaderModal
          task={readingTask}
          onClose={() => setReadingTask(null)}
          onToggleStatus={handleToggleStatus}
          onToggleSubtask={handleToggleSubtask}
          onUpdateNotes={handleUpdateNotes}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={(task) => {
            setReadingTask(null);
            setTaskToDelete(task);
          }}
        />

        <DeleteConfirmModal
          task={taskToDelete}
          isOpen={Boolean(taskToDelete)}
          onClose={() => setTaskToDelete(null)}
          onConfirm={handleDeleteTask}
        />

        {/* Floating Daily Motivation & Quick Task Component */}
        <DailyMotivationWidget
          tasks={tasks}
          streakData={streakData}
          onOpenAddTask={() => setIsAddModalOpen(true)}
          onBoostMotivation={handleBoostMotivation}
        />

      </div>
    </FocusTimerProvider>
  );
}
