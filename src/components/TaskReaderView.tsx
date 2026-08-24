import React, { useState } from 'react';
import { TaskItem, TaskCategory } from '../types';
import { CategoryDropdown } from './CategoryDropdown';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Square, 
  CheckSquare, 
  Check, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Search
} from 'lucide-react';

interface TaskReaderViewProps {
  tasks: TaskItem[];
  onToggleStatus: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onUpdateNotes: (taskId: string, notes: string) => void;
  onOpenAddTask: () => void;
}

export const TaskReaderView: React.FC<TaskReaderViewProps> = ({
  tasks,
  onToggleStatus,
  onToggleSubtask,
  onUpdateNotes,
  onOpenAddTask
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || '');
  const [readingFilter, setReadingFilter] = useState<string>('Semua');

  const filteredTasks = tasks.filter(t => {
    if (readingFilter !== 'Semua' && t.category !== readingFilter) return false;
    return true;
  });

  const activeTask = tasks.find(t => t.id === selectedTaskId) || filteredTasks[0] || null;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Category Dropdown & Header Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-sm font-bold text-stone-900 block">Koleksi Materi & Penjelasan Tugas</span>
            <span className="text-xs text-stone-500">Pilih materi untuk membaca dan menuntaskan langkah pengerjaan</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CategoryDropdown
            value={readingFilter}
            onChange={(cat) => setReadingFilter(cat)}
            includeAllOption={true}
            size="md"
          />
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200 text-stone-500 space-y-3">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto" />
          <div className="text-sm font-semibold text-stone-800">Belum Ada Materi Tugas</div>
          <p className="text-xs text-stone-500">
            Tambahkan tugas baru beserta materi bacaan untuk membaca di sini.
          </p>
          <button
            onClick={onOpenAddTask}
            className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium"
          >
            Tambah Tugas Pertama
          </button>
        </div>
      ) : (
        /* Split Layout: List of Chapters/Tasks on left, Reader Canvas on right */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          
          {/* Left Index (4 cols) */}
          <div className="md:col-span-4 space-y-2 bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs max-h-[75vh] overflow-y-auto">
            <div className="text-xs font-bold text-stone-500 uppercase tracking-wider px-2 py-1">
              Daftar Bacaan ({filteredTasks.length})
            </div>

            {filteredTasks.map((t) => {
              const isSelected = activeTask?.id === t.id;
              const isCompleted = t.status === 'completed';

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTaskId(t.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-left ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                      : 'bg-white hover:bg-stone-50 border-stone-200/80 text-stone-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                      isSelected ? 'bg-stone-800 text-amber-300' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {t.category}
                    </span>

                    {isCompleted && (
                      <span className={`text-[10px] font-medium flex items-center gap-1 ${
                        isSelected ? 'text-emerald-300' : 'text-emerald-600'
                      }`}>
                        <Check className="w-3 h-3" /> Selesai
                      </span>
                    )}
                  </div>

                  <h4 className={`text-xs font-semibold line-clamp-2 ${
                    isSelected ? 'text-white' : 'text-stone-900'
                  }`}>
                    {t.title}
                  </h4>

                  <div className={`text-[11px] mt-1.5 flex items-center gap-2 ${
                    isSelected ? 'text-stone-400' : 'text-stone-400'
                  }`}>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {t.estimatedMinutes}m
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {t.dueDate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Reader Area (8 cols) */}
          <div className="md:col-span-8 bg-white p-6 sm:p-7 rounded-xl border border-stone-200/90 shadow-2xs space-y-6">
            {activeTask ? (
              <>
                {/* Header of Active Reader */}
                <div className="pb-4 border-b border-stone-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-mono">
                        {activeTask.category}
                      </span>
                      {activeTask.priority === 'tinggi' && (
                        <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded">
                          Prioritas Tinggi
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onToggleStatus(activeTask.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        activeTask.status === 'completed'
                          ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{activeTask.status === 'completed' ? 'Tandai Belum Selesai' : 'Tandai Tugas Selesai'}</span>
                    </button>
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
                    {activeTask.title}
                  </h2>

                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Tenggat: {activeTask.dueDate}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Estimasi: {activeTask.estimatedMinutes} Menit
                    </span>
                  </div>
                </div>

                {/* Reading Body Content */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Isi Materi & Instruksi Tugas
                  </h3>

                  <div className="p-5 bg-stone-50/70 rounded-xl border border-stone-200/80 leading-relaxed text-xs sm:text-sm text-stone-800 font-sans whitespace-pre-wrap">
                    {activeTask.readingContent || 'Tidak ada catatan isi materi.'}
                  </div>
                </div>

                {/* Subtask / Action steps */}
                {activeTask.subtasks && activeTask.subtasks.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Langkah & Checklist Pengerjaan
                    </h3>

                    <div className="space-y-1.5">
                      {activeTask.subtasks.map((sub) => (
                        <div
                          key={sub.id}
                          onClick={() => onToggleSubtask(activeTask.id, sub.id)}
                          className={`flex items-center gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                            sub.completed
                              ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900'
                              : 'bg-white border-stone-200 hover:border-stone-300 text-stone-800'
                          }`}
                        >
                          <button className="shrink-0 text-stone-400 hover:text-emerald-600">
                            {sub.completed ? (
                              <CheckSquare className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Square className="w-4 h-4 text-stone-400" />
                            )}
                          </button>
                          <span className={`text-xs ${sub.completed ? 'line-through text-stone-500' : 'font-medium'}`}>
                            {sub.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* References */}
                {activeTask.referenceLinks && activeTask.referenceLinks.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Tautan Referensi
                    </h3>
                    <div className="space-y-1">
                      {activeTask.referenceLinks.map((link, i) => (
                        <a
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-800 text-xs transition-colors"
                        >
                          <span className="font-medium">{link.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="p-8 text-center text-stone-400 text-xs">
                Pilih salah satu tugas di sebelah kiri untuk membaca materinya.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
