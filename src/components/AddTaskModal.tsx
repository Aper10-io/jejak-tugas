import React, { useState } from 'react';
import { TaskItem, TaskCategory, TaskPriority, ReferenceLink } from '../types';
import { CategoryDropdown } from './CategoryDropdown';
import { PriorityDropdown } from './PriorityDropdown';
import { DatePickerPopover } from './DatePickerPopover';
import { X, Plus, Trash2, BookOpen, Clock, AlertCircle, Link2 } from 'lucide-react';

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
  const [referenceLinks, setReferenceLinks] = useState<{ title: string; url: string }[]>([]);
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

  const handleAddReferenceLink = () => {
    setReferenceLinks(prev => [...prev, { title: '', url: '' }]);
  };

  const handleReferenceLinkChange = (index: number, field: 'title' | 'url', val: string) => {
    setReferenceLinks(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: val };
      return next;
    });
  };

  const handleRemoveReferenceLink = (index: number) => {
    setReferenceLinks(prev => prev.filter((_, i) => i !== index));
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

    const cleanLinks: ReferenceLink[] = referenceLinks
      .filter(l => l.url.trim().length > 0 || l.title.trim().length > 0)
      .map((l, i) => ({
        id: `ref-${Date.now()}-${i}`,
        title: l.title.trim() || l.url.trim(),
        url: l.url.trim()
      }));

    onAddTask({
      title: title.trim(),
      category,
      priority,
      status: 'pending',
      dueDate,
      estimatedMinutes: Number(estimatedMinutes) || 0,
      referenceLinks: cleanLinks.length > 0 ? cleanLinks : undefined,
      readingContent: readingContent.trim(),
      subtasks: cleanSubtasks
    });

    // Reset & Close
    setTitle('');
    setReferenceLinks([]);
    setReadingContent('');
    setSubtasks(['']);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-t-3xl sm:rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-white flex items-center justify-center font-bold shadow-sm shrink-0">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Tambah Tugas & Materi Baru</h2>
              <p className="text-xs text-slate-400">Tentukan target belajar, checklist, dan ringkasan bacaan</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Judul */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-900 text-sm block">
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
              className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-0 font-normal shadow-2xs"
            />
          </div>

          {/* Kategori & Prioritas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-900 text-sm block">Kategori</label>
              <CategoryDropdown
                value={category}
                onChange={(val) => setCategory(val as TaskCategory)}
                includeAllOption={false}
                size="md"
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-900 text-sm block">Prioritas</label>
              <PriorityDropdown
                value={priority}
                onChange={(val) => setPriority(val)}
                className="w-full"
              />
            </div>
          </div>

          {/* Tenggat Waktu & Estimasi Menit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-900 text-sm block">
                Tenggat Waktu (Due Date)
              </label>
              <DatePickerPopover
                value={dueDate}
                onChange={(val) => setDueDate(val)}
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-900 text-sm flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Estimasi Waktu Belajar (Menit)</span>
              </label>
              <input
                type="number"
                min="5"
                step="5"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-0 shadow-2xs"
              />
            </div>
          </div>

          {/* Tautan Referensi & Sumber Belajar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Tautan Referensi & Sumber Belajar</span>
              </label>
              <button
                type="button"
                onClick={handleAddReferenceLink}
                className="text-amber-600 hover:text-amber-700 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Tambah Tautan
              </button>
            </div>

            {referenceLinks.length === 0 ? (
              <div className="p-3 bg-slate-50/70 rounded-xl border border-dashed border-slate-200 text-center text-slate-400 text-xs">
                Belum ada tautan. Klik <span className="font-semibold text-slate-600">"+ Tambah Tautan"</span> untuk menyematkan link buku, repo, Figma, dll.
              </div>
            ) : (
              <div className="space-y-2">
                {referenceLinks.map((link, idx) => (
                  <div key={idx} className="p-3 bg-slate-50/70 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-500 font-mono text-[10px] font-semibold">Tautan #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveReferenceLink(idx)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer transition-colors"
                        title="Hapus tautan ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => handleReferenceLinkChange(idx, 'title', e.target.value)}
                        placeholder="Nama Sumber (misal: Dokumentasi React, Figma)"
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => handleReferenceLinkChange(idx, 'url', e.target.value)}
                        placeholder="https://... (URL Tautan)"
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Materi Bacaan / Catatan Lengkap */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Materi Bacaan / Instruksi Tugas (Opsional)</span>
              </label>
              <span className="text-xs text-slate-400">Bisa dibaca di Ruang Baca</span>
            </div>
            <textarea
              rows={4}
              value={readingContent}
              onChange={(e) => setReadingContent(e.target.value)}
              placeholder="Tuliskan rangkuman, petunjuk tugas, teori, atau catatan koding yang ingin Anda pelajari..."
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-0 shadow-2xs"
            />
          </div>

          {/* Checklist Sub-Tugas */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-900 text-sm">Checklist Langkah Pengerjaan</label>
              <button
                type="button"
                onClick={handleAddSubtaskField}
                className="text-amber-600 hover:text-amber-700 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Tambah Sub-tugas
              </button>
            </div>

            <div className="space-y-2">
              {subtasks.map((sub, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono text-xs w-4 text-center">{idx + 1}.</span>
                  <input
                    type="text"
                    value={sub}
                    onChange={(e) => handleSubtaskChange(idx, e.target.value)}
                    placeholder={`Langkah target ke-${idx + 1}...`}
                    className="flex-1 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 shadow-2xs"
                  />
                  {subtasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtaskField(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Buttons Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-medium rounded-xl text-xs sm:text-sm transition-colors shadow-sm cursor-pointer"
            >
              Simpan Tugas
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
