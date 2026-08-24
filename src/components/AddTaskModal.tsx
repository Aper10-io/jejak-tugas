import React, { useState } from 'react';
import { TaskItem, TaskCategory, TaskPriority } from '../types';
import { CategoryDropdown } from './CategoryDropdown';
import { PriorityDropdown } from './PriorityDropdown';
import { DatePickerPopover } from './DatePickerPopover';
import { X, Plus, Trash2, BookOpen, Clock, AlertCircle } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Pemrograman');
  const [priority, setPriority] = useState<TaskPriority>('sedang');
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [estimatedMinutes, setEstimatedMinutes] = useState<number>(30);
  const [readingContent, setReadingContent] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>(['']);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAddSubtaskField = () => {
    setSubtasks(prev => [...prev, '']);
  };

  const handleSubtaskChange = (index: number, val: string) => {
    setSubtasks(prev => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleRemoveSubtaskField = (index: number) => {
    setSubtasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Judul tugas wajib diisi.');
      return;
    }

    const cleanSubtasks = subtasks
      .filter(s => s.trim().length > 0)
      .map((st, i) => ({
        id: `sub-${Date.now()}-${i}`,
        title: st.trim(),
        completed: false
      }));

    onAddTask({
      title: title.trim(),
      category,
      priority,
      status: 'pending',
      dueDate,
      estimatedMinutes: Number(estimatedMinutes) || 0,
      readingContent: readingContent.trim(),
      subtasks: cleanSubtasks
    });

    // Reset & Close
    setTitle('');
    setReadingContent('');
    setSubtasks(['']);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Tambah Tugas & Materi Baru</h2>
              <p className="text-[11px] text-stone-500">Tentukan target belajar, checklist, dan ringkasan bacaan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Judul */}
          <div className="space-y-1">
            <label className="font-bold text-stone-800 block">
              Judul Tugas / Topik Belajar <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="Contoh: Belajar State Management di React / Baca Bab 4..."
              className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white"
            />
          </div>

          {/* Kategori & Prioritas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-800 block">Kategori</label>
              <CategoryDropdown
                value={category}
                onChange={(val) => setCategory(val as TaskCategory)}
                includeAllOption={false}
                size="md"
                className="w-full"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-800 block">Prioritas</label>
              <PriorityDropdown
                value={priority}
                onChange={(val) => setPriority(val)}
                className="w-full"
              />
            </div>
          </div>

          {/* Tenggat Waktu & Estimasi Menit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-stone-800 block">
                Tenggat Waktu (Due Date)
              </label>
              <DatePickerPopover
                value={dueDate}
                onChange={(val) => setDueDate(val)}
                className="w-full"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-stone-800 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-500" />
                <span>Estimasi Waktu Belajar (Menit)</span>
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10"
              />
            </div>
          </div>

          {/* Materi Bacaan / Catatan Lengkap */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-800 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-stone-600" />
                <span>Materi Bacaan / Instruksi Tugas (Opsional)</span>
              </label>
              <span className="text-[10px] text-stone-400">Bisa dibaca di Ruang Baca</span>
            </div>
            <textarea
              rows={4}
              value={readingContent}
              onChange={(e) => setReadingContent(e.target.value)}
              placeholder="Tuliskan rangkuman, petunjuk tugas, teori, atau catatan koding yang ingin Anda pelajari..."
              className="w-full p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:bg-white"
            />
          </div>

          {/* Checklist Sub-Tugas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-stone-800">Checklist Langkah Pengerjaan</label>
              <button
                type="button"
                onClick={handleAddSubtaskField}
                className="text-stone-900 hover:text-stone-700 font-bold text-[11px] flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Tambah Sub-tugas
              </button>
            </div>

            <div className="space-y-1.5">
              {subtasks.map((sub, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-stone-400 font-mono text-[10px] w-4 text-center">{idx + 1}.</span>
                  <input
                    type="text"
                    value={sub}
                    onChange={(e) => handleSubtaskChange(idx, e.target.value)}
                    placeholder={`Langkah target ke-${idx + 1}...`}
                    className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                  {subtasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtaskField(idx)}
                      className="p-1 text-stone-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg font-medium text-xs transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-bold text-xs transition-colors shadow-xs"
            >
              Simpan Tugas
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
