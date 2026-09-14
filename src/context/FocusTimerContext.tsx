import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { TaskItem, TaskCategory } from '../types';
import { playTimerCompletionSound } from '../utils/audioChime';

export type TimerMode = 'focus25' | 'focus15' | 'break5';

export interface TimerConfig {
  label: string;
  duration: number; // in seconds
  type: 'focus' | 'break';
}

export const TIMER_CONFIGS: Record<TimerMode, TimerConfig> = {
  focus25: { label: '25m Fokus', duration: 25 * 60, type: 'focus' },
  focus15: { label: '15m Kilat', duration: 15 * 60, type: 'focus' },
  break5: { label: '5m Jeda', duration: 5 * 60, type: 'break' }
};

interface StoredTimerState {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  targetEndTime: number | null;
  selectedTaskId: string;
  completedSessions: number;
}

interface FocusTimerContextType {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  selectedTaskId: string;
  completedSessions: number;
  isFinishedAlert: boolean;
  currentDuration: number;
  progressPercent: number;
  formattedTime: string;
  selectedTask?: TaskItem;
  setMode: (mode: TimerMode) => void;
  setSelectedTaskId: (taskId: string) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  toggleTimer: () => void;
  resetTimer: () => void;
  resetAllTimerStats: () => void;
  dismissFinishedAlert: () => void;
}

export interface FocusTimerProviderProps {
  children: React.ReactNode;
  tasks: TaskItem[];
  onTimerComplete?: (mode: TimerMode, type: 'focus' | 'break') => void;
}

const STORAGE_KEY = 'jejak_focus_timer_state';

const FocusTimerContext = createContext<FocusTimerContextType | undefined>(undefined);

export const FocusTimerProvider: React.FC<FocusTimerProviderProps> = ({ 
  children, 
  tasks,
  onTimerComplete 
}) => {
  // Load saved state or use initial defaults
  const [mode, setModeState] = useState<TimerMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredTimerState = JSON.parse(saved);
        if (parsed.mode && TIMER_CONFIGS[parsed.mode]) return parsed.mode;
      }
    } catch (e) {
      console.error(e);
    }
    return 'focus25';
  });

  const [selectedTaskId, setSelectedTaskIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredTimerState = JSON.parse(saved);
        if (parsed.selectedTaskId) return parsed.selectedTaskId;
      }
    } catch (e) {
      console.error(e);
    }
    const firstActive = tasks.find(t => t.status !== 'completed');
    return firstActive?.id || '';
  });

  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredTimerState = JSON.parse(saved);
        return typeof parsed.completedSessions === 'number' ? parsed.completedSessions : 0;
      }
    } catch (e) {
      console.error(e);
    }
    return 0;
  });

  const [targetEndTime, setTargetEndTime] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredTimerState = JSON.parse(saved);
        if (parsed.isRunning && parsed.targetEndTime && parsed.targetEndTime > Date.now()) {
          return parsed.targetEndTime;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [timeLeft, setTimeLeft] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredTimerState = JSON.parse(saved);
        if (parsed.isRunning && parsed.targetEndTime) {
          const remaining = Math.max(0, Math.round((parsed.targetEndTime - Date.now()) / 1000));
          return remaining;
        }
        if (typeof parsed.timeLeft === 'number') {
          return parsed.timeLeft;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return TIMER_CONFIGS.focus25.duration;
  });

  const [isRunning, setIsRunning] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: StoredTimerState = JSON.parse(saved);
        if (parsed.isRunning && parsed.targetEndTime && parsed.targetEndTime > Date.now()) {
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  const [isFinishedAlert, setIsFinishedAlert] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync selected task if previous one got completed/deleted and none selected
  useEffect(() => {
    const activeTasks = tasks.filter(t => t.status !== 'completed');
    if (activeTasks.length > 0 && !tasks.some(t => t.id === selectedTaskId && t.status !== 'completed')) {
      setSelectedTaskIdState(activeTasks[0].id);
    }
  }, [tasks, selectedTaskId]);

  // Persistent storage update
  useEffect(() => {
    try {
      const stateToSave: StoredTimerState = {
        mode,
        timeLeft,
        isRunning,
        targetEndTime,
        selectedTaskId,
        completedSessions
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error(e);
    }
  }, [mode, timeLeft, isRunning, targetEndTime, selectedTaskId, completedSessions]);

  const handleSessionFinished = (finishedMode: TimerMode) => {
    setIsRunning(false);
    setTargetEndTime(null);
    setIsFinishedAlert(true);

    const config = TIMER_CONFIGS[finishedMode];
    const sessionType = config.type;

    // 1. Synthesize Web Audio API Bell/Chime
    playTimerCompletionSound(sessionType);

    // 2. Increment completed focus sessions if type is focus
    if (sessionType === 'focus') {
      setCompletedSessions(c => c + 1);
    }

    // 3. Trigger callback if provided (e.g. for toast notifications)
    if (onTimerComplete) {
      onTimerComplete(finishedMode, sessionType);
    }
  };

  // Main countdown interval based on targetEndTime with high-precision sub-second ticker
  useEffect(() => {
    if (!isRunning || !targetEndTime) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const checkTime = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((targetEndTime - now) / 1000));

      setTimeLeft(prev => (prev !== remaining ? remaining : prev));

      if (remaining <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        handleSessionFinished(mode);
      }
    };

    // Immediate check on start to avoid 1-second lag
    checkTime();

    // High precision ticker (every 200ms ensures exact second boundary without drift)
    timerRef.current = setInterval(checkTime, 200);

    // Sync immediately when tab becomes visible or window gains focus
    const handleVisibilitySync = () => {
      if (document.visibilityState === 'visible') {
        checkTime();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilitySync);
    window.addEventListener('focus', handleVisibilitySync);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      document.removeEventListener('visibilitySync', handleVisibilitySync as any);
      document.removeEventListener('visibilitychange', handleVisibilitySync);
      window.removeEventListener('focus', handleVisibilitySync);
    };
  }, [isRunning, targetEndTime, mode, onTimerComplete]);

  const setMode = (newMode: TimerMode) => {
    setIsRunning(false);
    setTargetEndTime(null);
    setModeState(newMode);
    setTimeLeft(TIMER_CONFIGS[newMode].duration);
    setIsFinishedAlert(false);
  };

  const setSelectedTaskId = (taskId: string) => {
    setSelectedTaskIdState(taskId);
  };

  const startTimer = () => {
    const duration = timeLeft > 0 ? timeLeft : TIMER_CONFIGS[mode].duration;
    const end = Date.now() + duration * 1000;
    setTargetEndTime(end);
    setTimeLeft(duration);
    setIsRunning(true);
    setIsFinishedAlert(false);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (targetEndTime) {
      const remaining = Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000));
      setTimeLeft(remaining);
    }
    setTargetEndTime(null);
  };

  const toggleTimer = () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTargetEndTime(null);
    setTimeLeft(TIMER_CONFIGS[mode].duration);
    setIsFinishedAlert(false);
  };

  const resetAllTimerStats = () => {
    setIsRunning(false);
    setTargetEndTime(null);
    setCompletedSessions(0);
    setTimeLeft(TIMER_CONFIGS[mode].duration);
    setIsFinishedAlert(false);
  };

  const dismissFinishedAlert = () => {
    setIsFinishedAlert(false);
  };

  // Math formatting
  const currentDuration = TIMER_CONFIGS[mode].duration;
  const progressFraction = Math.max(0, Math.min(1, (currentDuration - timeLeft) / currentDuration));
  const progressPercent = Math.round(progressFraction * 100);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const selectedTask = tasks.find(t => t.id === selectedTaskId);

  return (
    <FocusTimerContext.Provider
      value={{
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
        startTimer,
        pauseTimer,
        toggleTimer,
        resetTimer,
        resetAllTimerStats,
        dismissFinishedAlert
      }}
    >
      {children}
    </FocusTimerContext.Provider>
  );
};

export const useFocusTimer = () => {
  const context = useContext(FocusTimerContext);
  if (!context) {
    throw new Error('useFocusTimer must be used within a FocusTimerProvider');
  }
  return context;
};
