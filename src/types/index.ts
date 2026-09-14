export type TaskPriority = 'tinggi' | 'sedang' | 'rendah';
export type TaskCategory = 'Pemrograman' | 'Belajar' | 'Membaca' | 'Tugas Kuliah' | 'Proyek' | 'Lainnya';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface ReferenceLink {
  id: string;
  title: string; // contoh: "Refactoring UI Book by Adam Wathan"
  url: string;   // contoh: "https://..."
}

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
  referenceLinks?: ReferenceLink[];
  sourceUrl?: string; // Tautan Materi / Referensi Opsional
  notes?: string;
  createdAt: string;
  completedAt?: string;
}

export type Task = TaskItem;

export interface StreakData {
  count: number;
  lastLoginDate: string;
  history: string[];
  bestStreak: number;
}

export type ViewMode = 'dashboard' | 'tugas' | 'baca';
export type TaskFilter = 'semua' | 'aktif' | 'selesai' | 'tinggi';
