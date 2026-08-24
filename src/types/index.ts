export type TaskPriority = 'tinggi' | 'sedang' | 'rendah';
export type TaskCategory = 'Pemrograman' | 'Belajar' | 'Membaca' | 'Tugas Kuliah' | 'Proyek' | 'Lainnya';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface TaskItem {
  id: string;
  title: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  estimatedMinutes: number;
  readingContent: string; // Materi atau deskripsi lengkap untuk dibaca
  subtasks: { id: string; title: string; completed: boolean }[];
  referenceLinks?: { title: string; url: string }[];
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export interface StreakData {
  count: number;
  lastLoginDate: string;
  history: string[];
  bestStreak: number;
}

export type ViewMode = 'dashboard' | 'tugas' | 'baca';
export type TaskFilter = 'semua' | 'aktif' | 'selesai' | 'tinggi';
