import React, { useState } from 'react';
import { TaskItem } from '../types';
import { 
  X, 
  BookOpen, 
  Calendar, 
  Clock, 
  Check, 
  ExternalLink, 
  Trash2, 
  CheckSquare, 
  Square,
  Sparkles,
  Save,
  CheckCircle2
} from 'lucide-react';

interface TaskReaderModalProps {
  task: TaskItem | null;
  onClose: () => void;
  onToggleStatus: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onUpdateNotes: (taskId: string, notes: string) => void;
  onDeleteTask: (task: TaskItem) => void;
}

export const TaskReaderModal: React.FC<TaskReaderModalProps> = ({
  task,
  onClose,
  onToggleStatus,
  onToggleSubtask,
  onUpdateNotes,
  onDeleteTask
}) => {
  if (!task) return null;

  const [notes, setNotes] = useState(task.notes || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveNotes = () => {
    onUpdateNotes(task.id, notes);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const isCompleted = task.status === 'completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-700 bg-stone-200/80 px-2 py-0.5 rounded font-mono">
                  {task.category}
                </span>
                <span className="text-[11px] text-stone-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Tenggat: {task.dueDate}
                </span>
                {task.estimatedMinutes > 0 && (
                  <span className="text-[11px] text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {task.estimatedMinutes} Menit
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-stone-900 truncate mt-0.5">
                {task.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-800">
          
          {/* Status Bar */}
          <div className="p-3.5 bg-stone-50 border border-stone-200/90 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-stone-700">Status Tugas:</span>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                isCompleted 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {isCompleted ? 'Sudah Selesai' : 'Sedang Berjalan / Aktif'}
              </span>
            </div>

            <button
              onClick={() => onToggleStatus(task.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                isCompleted
                  ? 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{isCompleted ? 'Ubah ke Belum Selesai' : 'Tandai Selesai'}</span>
            </button>
          </div>

          {/* Reading Material Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-stone-700" />
                <span>Materi & Catatan Penjelasan Tugas</span>
              </h3>
              <span className="text-[11px] text-stone-400 font-mono">Modul Pembaca</span>
            </div>

            <div className="p-4 bg-stone-50/80 rounded-xl border border-stone-200 leading-relaxed space-y-3 font-sans text-stone-700">
              {task.readingContent ? (
                <div className="whitespace-pre-wrap leading-relaxed text-xs">
                  {task.readingContent}
                </div>
              ) : (
                <p className="text-stone-400 italic text-xs">
                  Belum ada catatan materi khusus yang ditulis untuk tugas ini.
                </p>
              )}
            </div>
          </div>

          {/* Subtasks / Checklist */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>Checklist & Target Langkah Pengerjaan</span>
              </h3>

              <div className="space-y-1.5">
                {task.subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => onToggleSubtask(task.id, sub.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
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

          {/* Reference Links */}
          {task.referenceLinks && task.referenceLinks.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider">
                Tautan Referensi & Sumber Belajar
              </h3>
              <div className="space-y-1">
                {task.referenceLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-800 hover:text-stone-900 transition-colors"
                  >
                    <span className="font-medium text-xs truncate mr-2">{link.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Personal Notes / Jurnal Bacaan */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-stone-900 text-xs">Catatan Pribadi & Refleksi Pembaca</h3>
              {saveSuccess && (
                <span className="text-emerald-600 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Tersimpan!
                </span>
              )}
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tuliskan wawasan baru, rumus, catatan koding, atau kesulitan dari materi tugas ini..."
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white text-xs text-stone-800 placeholder-stone-400"
            />
            <button
              onClick={handleSaveNotes}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-medium text-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Catatan</span>
            </button>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onDeleteTask(task);
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus Tugas</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-semibold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
