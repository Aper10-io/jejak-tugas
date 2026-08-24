import React, { useState } from 'react';
import { TaskItem, TaskCategory, TaskFilter } from '../types';
import { CategoryDropdown } from './CategoryDropdown';
import { 
  Check, 
  Trash2, 
  BookOpen, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Filter, 
  Plus, 
  CheckCircle2, 
  ListTodo 
} from 'lucide-react';

interface TaskListProps {
  tasks: TaskItem[];
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  searchQuery: string;
  onToggleStatus: (taskId: string) => void;
  onReadTask: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
  onOpenAddTask: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filter,
  onFilterChange,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onToggleStatus,
  onReadTask,
  onDeleteTask,
  onOpenAddTask
}) => {
  // Filter logic
  const filteredTasks = tasks.filter((task) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchContent = task.readingContent?.toLowerCase().includes(q);
      const matchCategory = task.category.toLowerCase().includes(q);
      if (!matchTitle && !matchContent && !matchCategory) return false;
    }

    // Status / Priority filter
    if (filter === 'aktif' && task.status === 'completed') return false;
    if (filter === 'selesai' && task.status !== 'completed') return false;
    if (filter === 'tinggi' && task.priority !== 'tinggi') return false;

    // Category filter
    if (selectedCategory !== 'Semua' && task.category !== selectedCategory) return false;

    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Filters & Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onFilterChange('semua')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'semua'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Semua ({tasks.length})
          </button>
          
          <button
            onClick={() => onFilterChange('aktif')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'aktif'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Aktif ({tasks.filter(t => t.status !== 'completed').length})
          </button>

          <button
            onClick={() => onFilterChange('selesai')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'selesai'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Selesai ({tasks.filter(t => t.status === 'completed').length})
          </button>

          <button
            onClick={() => onFilterChange('tinggi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'tinggi'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-rose-700 hover:bg-rose-100'
            }`}
          >
            Prioritas Tinggi ({tasks.filter(t => t.priority === 'tinggi').length})
          </button>
        </div>

        {/* Category Filter & Add Button */}
        <div className="flex items-center gap-2">
          <CategoryDropdown
            value={selectedCategory}
            onChange={(val) => onCategoryChange(val)}
            includeAllOption={true}
            size="md"
          />

          <button
            onClick={onOpenAddTask}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-sm font-medium shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Tugas</span>
          </button>
        </div>

      </div>

      {/* Task List Items */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200 space-y-3">
          <ListTodo className="w-10 h-10 text-stone-300 mx-auto" />
          <div className="text-sm font-semibold text-stone-800">Tidak Ada Tugas yang Cocok</div>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {searchQuery
              ? `Tidak ditemukan tugas dengan kata kunci "${searchQuery}". Coba kata kunci lain.`
              : 'Belum ada tugas di kategori atau filter ini. Silakan buat tugas baru.'}
          </p>
          <button
            onClick={onOpenAddTask}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Tambah Tugas
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const completedSubCount = task.subtasks.filter(s => s.completed).length;

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCompleted
                    ? 'bg-stone-50/70 border-stone-200/60 opacity-80'
                    : 'bg-white border-stone-200/90 shadow-2xs hover:border-stone-300'
                }`}
              >
                {/* Left: Checkbox + Info */}
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => onToggleStatus(task.id)}
                    title={isCompleted ? 'Batalkan Selesai' : 'Tandai Selesai'}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-stone-300 hover:border-emerald-500 hover:bg-emerald-50 text-transparent hover:text-emerald-600'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-mono text-[10px]">
                        {task.category}
                      </span>
                      
                      {task.priority === 'tinggi' && (
                        <span className="font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px]">
                          Tinggi
                        </span>
                      )}
                      {task.priority === 'sedang' && (
                        <span className="font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px]">
                          Sedang
                        </span>
                      )}

                      <span className="text-stone-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {task.dueDate}
                      </span>

                      {task.estimatedMinutes > 0 && (
                        <span className="text-stone-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {task.estimatedMinutes}m
                        </span>
                      )}
                    </div>

                    <h3
                      onClick={() => onReadTask(task)}
                      className={`text-xs sm:text-sm font-semibold cursor-pointer hover:text-stone-600 transition-colors ${
                        isCompleted ? 'line-through text-stone-400' : 'text-stone-900'
                      }`}
                    >
                      {task.title}
                    </h3>

                    {/* Subtask snippet */}
                    {task.subtasks.length > 0 && (
                      <div className="flex items-center gap-2 text-[11px] text-stone-500">
                        <span>Checklist: {completedSubCount}/{task.subtasks.length}</span>
                        <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full"
                            style={{ width: `${(completedSubCount / task.subtasks.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onReadTask(task)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-stone-600" />
                    <span>Baca & Detail</span>
                  </button>

                  <button
                    onClick={() => onDeleteTask(task)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Hapus Tugas"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
