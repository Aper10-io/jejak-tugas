import React, { useState, useEffect } from 'react';
import { TaskItem, TaskCategory, TaskPriority, ReferenceLink } from '../types';
import { CategoryDropdown } from './CategoryDropdown';
import { PriorityDropdown } from './PriorityDropdown';
import { DatePickerPopover } from './DatePickerPopover';
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
  Save,
  CheckCircle2,
  Pencil,
  Plus,
  AlertCircle,
  RotateCcw,
  Link2
} from 'lucide-react';

interface TaskReaderModalProps {
  task: TaskItem | null;
  onClose: () => void;
  onToggleStatus: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onUpdateNotes: (taskId: string, notes: string) => void;
  onUpdateTask?: (task: TaskItem) => void;
  onDeleteTask: (task: TaskItem) => void;
}

export const TaskReaderModal: React.FC<TaskReaderModalProps> = ({
  task,
  onClose,
  onToggleStatus,
  onToggleSubtask,
  onUpdateNotes,
  onUpdateTask,
  onDeleteTask
}) => {
  if (!task) return null;

  // View / Edit Mode State
  const [isEditing, setIsEditing] = useState(false);

  // Reader Mode Notes state
  const [notes, setNotes] = useState(task.notes || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit Mode form state
  const [editTitle, setEditTitle] = useState(task.title);
  const [editCategory, setEditCategory] = useState<TaskCategory>(task.category);
  const [editPriority, setEditPriority] = useState<TaskPriority>(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate);
  const [editEstimatedMinutes, setEditEstimatedMinutes] = useState<number>(task.estimatedMinutes || 30);
  const [editReferenceLinks, setEditReferenceLinks] = useState<{ id?: string; title: string; url: string }[]>(
    task.referenceLinks ? task.referenceLinks.map(l => ({ ...l })) : []
  );
  const [editReadingContent, setEditReadingContent] = useState(task.readingContent || '');
  const [editSubtasks, setEditSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>(
    task.subtasks ? task.subtasks.map(s => ({ ...s })) : []
  );
  const [editError, setEditError] = useState('');

  // Sync state whenever active task changes
  useEffect(() => {
    setNotes(task.notes || '');
    resetEditForm();
    setIsEditing(false);
  }, [task.id]);

  const resetEditForm = () => {
    setEditTitle(task.title);
    setEditCategory(task.category);
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate);
    setEditEstimatedMinutes(task.estimatedMinutes || 30);
    setEditReferenceLinks(task.referenceLinks ? task.referenceLinks.map(l => ({ ...l })) : []);
    setEditReadingContent(task.readingContent || '');
    setEditSubtasks(task.subtasks ? task.subtasks.map(s => ({ ...s })) : []);
    setEditError('');
  };

  const handleStartEditing = () => {
    resetEditForm();
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    resetEditForm();
    setIsEditing(false);
  };

  const handleSaveNotes = () => {
    onUpdateNotes(task.id, notes);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // Subtask Edit operations
  const handleAddEditSubtask = () => {
    setEditSubtasks(prev => [
      ...prev,
      {
        id: `sub-${Date.now()}-${prev.length}`,
        title: '',
        completed: false
      }
    ]);
  };

  const handleEditSubtaskTitleChange = (index: number, newTitle: string) => {
    setEditSubtasks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], title: newTitle };
      return updated;
    });
  };

  const handleToggleEditSubtaskComplete = (index: number) => {
    setEditSubtasks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], completed: !updated[index].completed };
      return updated;
    });
  };

  const handleRemoveEditSubtask = (index: number) => {
    setEditSubtasks(prev => prev.filter((_, i) => i !== index));
  };

  // Reference Link Edit operations
  const handleAddEditReferenceLink = () => {
    setEditReferenceLinks(prev => [
      ...prev,
      {
        id: `ref-${Date.now()}-${prev.length}`,
        title: '',
        url: ''
      }
    ]);
  };

  const handleEditReferenceLinkChange = (index: number, field: 'title' | 'url', val: string) => {
    setEditReferenceLinks(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: val };
      return updated;
    });
  };

  const handleRemoveEditReferenceLink = (index: number) => {
    setEditReferenceLinks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveTaskEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      setEditError('Judul tugas wajib diisi.');
      return;
    }

    const cleanSubtasks = editSubtasks
      .filter(s => s.title.trim().length > 0)
      .map(s => ({
        ...s,
        title: s.title.trim()
      }));

    const cleanReferenceLinks: ReferenceLink[] = editReferenceLinks
      .filter(l => l.url.trim().length > 0 || l.title.trim().length > 0)
      .map((l, i) => ({
        id: l.id || `ref-${Date.now()}-${i}`,
        title: l.title.trim() || l.url.trim(),
        url: l.url.trim()
      }));

    const updatedTask: TaskItem = {
      ...task,
      title: editTitle.trim(),
      category: editCategory,
      priority: editPriority,
      dueDate: editDueDate,
      estimatedMinutes: Number(editEstimatedMinutes) || 0,
      referenceLinks: cleanReferenceLinks.length > 0 ? cleanReferenceLinks : undefined,
      readingContent: editReadingContent.trim(),
      subtasks: cleanSubtasks
    };

    if (onUpdateTask) {
      onUpdateTask(updatedTask);
    }

    setIsEditing(false);
  };

  const isCompleted = task.status === 'completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0B0F19]/80 backdrop-blur-md rounded-3xl border border-slate-700/40 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">

        {/* Header Bar */}
        <div className="p-5 border-b border-slate-700/40 flex items-center justify-between bg-slate-900/40">
          <div className="flex items-center gap-2.5 min-w-0 pr-4">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 ${
              isEditing ? 'bg-amber-500 text-slate-950' : 'bg-slate-800/80 text-white'
            }`}>
              {isEditing ? <Pencil className="w-4 h-4" /> : <BookOpen className="w-4 h-4 text-cyan-400" />}
            </div>
            <div className="min-w-0">
              {isEditing ? (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded font-mono">
                      Mode Edit Tugas
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Kelola target jangka panjang & roadmap
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white truncate mt-0.5">
                    {editTitle || task.title}
                  </h2>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded font-mono">
                      LAPORAN
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded font-mono">
                      {task.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Tenggat: {task.dueDate}
                    </span>
                    {task.estimatedMinutes > 0 && (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {task.estimatedMinutes} Menit
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-white truncate mt-0.5">
                    {task.title}
                  </h2>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Tutup Modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Mode Switch (Editing vs Reading) */}
        {isEditing ? (
          /* ================================================================= */
          /* ======================== EDIT MODE FORM ========================= */
          /* ================================================================= */
          <form id="edit-task-form" onSubmit={handleSaveTaskEdit} className="p-6 overflow-y-auto space-y-4 text-xs">

            {editError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 rounded-xl font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            {/* 1. Judul Tugas */}
            <div className="space-y-1">
              <label className="font-bold text-slate-200 block">
                Judul Tugas / Milestone <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  if (editError) setEditError('');
                }}
                placeholder="Judul target atau topik tugas..."
                className="w-full px-3.5 py-2 bg-slate-900/40 border border-slate-700/30 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium transition-colors"
              />
            </div>

            {/* 2. Kategori & Prioritas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-200 block">Kategori</label>
                <CategoryDropdown
                  value={editCategory}
                  onChange={(val) => setEditCategory(val as TaskCategory)}
                  includeAllOption={false}
                  size="md"
                  className="w-full"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200 block">Prioritas</label>
                <PriorityDropdown
                  value={editPriority}
                  onChange={(val) => setEditPriority(val)}
                  className="w-full"
                />
              </div>
            </div>

            {/* 3. Tenggat Waktu & Estimasi Waktu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-200 block">
                  Tenggat Waktu / Milestone (Due Date)
                </label>
                <DatePickerPopover
                  value={editDueDate}
                  onChange={(val) => setEditDueDate(val)}
                  className="w-full"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Estimasi Waktu Belajar (Menit)</span>
                </label>
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={editEstimatedMinutes}
                  onChange={(e) => setEditEstimatedMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-900/40 border border-slate-700/30 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-colors"
                />
              </div>
            </div>

            {/* Tautan Referensi & Sumber Belajar */}
            <div className="space-y-2 pt-2 border-t border-slate-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tautan Referensi Belajar</span>
                  </label>
                  <p className="text-[10px] text-slate-400">
                    Bisa berupa link artikel, dokumentasi, video tutorial, atau GitHub
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddEditReferenceLink}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Link</span>
                </button>
              </div>

              <div className="space-y-2">
                {editReferenceLinks.map((refLink, idx) => (
                  <div key={refLink.id || idx} className="p-3 bg-slate-900/40 border border-slate-700/30 rounded-xl space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-300 text-[11px]">Link #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEditReferenceLink(idx)}
                        className="text-slate-400 hover:text-rose-400 text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Hapus</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={refLink.title}
                      onChange={(e) => handleEditReferenceLinkChange(idx, 'title', e.target.value)}
                      placeholder="Judul / Nama Referensi (cth: Dokumentasi Tailwind)"
                      className="w-full px-3 py-1.5 bg-slate-900/40 border border-slate-700/30 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30"
                    />
                    <input
                      type="url"
                      value={refLink.url}
                      onChange={(e) => handleEditReferenceLinkChange(idx, 'url', e.target.value)}
                      placeholder="URL Lengkap (https://...)"
                      className="w-full px-3 py-1.5 bg-slate-900/40 border border-slate-700/30 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Konten Materi Belajar */}
            <div className="space-y-1 pt-2 border-t border-slate-700/30">
              <label className="font-bold text-slate-200 block">
                Catatan Materi & Penjelasan Tugas
              </label>
              <textarea
                rows={5}
                value={editReadingContent}
                onChange={(e) => setEditReadingContent(e.target.value)}
                placeholder="Tuliskan materi rangkuman, instruksi detail pengerjaan, atau tips belajar..."
                className="w-full p-3 bg-slate-900/40 border border-slate-700/30 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-colors"
              />
            </div>

            {/* Checklist / Subtask Edits */}
            <div className="space-y-2 pt-2 border-t border-slate-700/30">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-bold text-slate-200 block">
                    Checklist Langkah Pengerjaan (Milestones)
                  </label>
                  <p className="text-[10px] text-slate-400">
                    Pecah tugas menjadi langkah-langkah kecil yang dapat dicentang
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddEditSubtask}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Subtask</span>
                </button>
              </div>

              <div className="space-y-2">
                {editSubtasks.map((sub, idx) => (
                  <div key={sub.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleEditSubtaskComplete(idx)}
                      className="p-1 text-slate-400 hover:text-emerald-400 cursor-pointer"
                    >
                      {sub.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <input
                      type="text"
                      value={sub.title}
                      onChange={(e) => handleEditSubtaskTitleChange(idx, e.target.value)}
                      placeholder={`Langkah ke-${idx + 1}...`}
                      className={`flex-1 px-2.5 py-1.5 bg-slate-900/40 border border-slate-700/30 rounded-lg text-xs text-white placeholder:text-slate-500 ${
                        sub.completed ? 'line-through text-slate-500' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveEditSubtask(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </form>
        ) : (
          /* ================================================================= */
          /* ======================= READER MODE VIEW ======================== */
          /* ================================================================= */
          <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6 text-xs text-slate-200">

            {/* Status Bar */}
            <div className="p-3 sm:p-3.5 bg-slate-900/40 border border-slate-700/30 rounded-2xl flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-slate-300">Status Tugas:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${isCompleted
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                    : 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                  }`}>
                  {isCompleted ? 'Sudah Selesai' : 'Sedang Berjalan / Aktif'}
                </span>
              </div>

              <button
                onClick={() => onToggleStatus(task.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-sm shrink-0 ${isCompleted
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white'
                  }`}
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isCompleted ? 'Ubah ke Belum Selesai' : 'Tandai Selesai'}</span>
              </button>
            </div>

            {/* Reading Material Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Materi & Catatan Penjelasan Tugas</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">Modul Pembaca</span>
              </div>

              <div className="p-4 bg-slate-900/40 rounded-2xl border border-slate-700/30 leading-relaxed space-y-3 font-sans text-slate-300">
                {task.readingContent ? (
                  <div className="whitespace-pre-wrap leading-relaxed text-xs">
                    {task.readingContent}
                  </div>
                ) : (
                  <p className="text-slate-400 italic text-xs">
                    Belum ada catatan materi khusus yang ditulis untuk tugas ini. Klik tombol "Edit Tugas" untuk menambahkan catatan atau roadmap belajar.
                  </p>
                )}
              </div>
            </div>

            {/* Subtasks / Checklist */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-cyan-400" />
                  <span>Checklist & Target Langkah Pengerjaan</span>
                </h3>

                <div className="space-y-1.5">
                  {task.subtasks.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => onToggleSubtask(task.id, sub.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer transition-colors ${sub.completed
                          ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300 hover:bg-emerald-950/40'
                          : 'bg-slate-900/40 border-slate-700/30 hover:bg-slate-800/40 text-slate-200'
                        }`}
                    >
                      <button className="shrink-0 text-slate-400 hover:text-emerald-400">
                        {sub.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                      <span className={`text-xs ${sub.completed ? 'line-through text-slate-400' : 'font-medium text-slate-200'}`}>
                        {sub.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAUTAN REFERENSI & SUMBER BELAJAR */}
            {task.referenceLinks && task.referenceLinks.length > 0 && (
              <div className="space-y-2 pt-2">
                <h3 className="font-bold text-xs text-white uppercase tracking-wider">
                  TAUTAN REFERENSI & SUMBER BELAJAR
                </h3>
                <div className="space-y-2">
                  {task.referenceLinks.map((link, i) => (
                    <a
                      key={link.id || i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-700/30 bg-slate-900/40 hover:bg-slate-800/40 text-slate-200 transition-colors shadow-sm group"
                    >
                      <span className="font-medium text-xs truncate mr-2 text-slate-300 group-hover:text-white">{link.title || link.url}</span>
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-amber-400 shrink-0 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Personal Notes / Jurnal Bacaan */}
            <div className="space-y-2 pt-2 border-t border-slate-700/30">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-xs">Catatan Pribadi & Refleksi Pembaca</h3>
                {saveSuccess && (
                  <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Tersimpan!
                  </span>
                )}
              </div>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tuliskan wawasan baru, rumus, catatan koding, atau kesulitan dari materi tugas ini..."
                className="w-full p-3 bg-slate-900/40 border border-slate-700/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs text-slate-200 placeholder:text-slate-500 transition-colors"
              />
              <button
                onClick={handleSaveNotes}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Catatan</span>
              </button>
            </div>

          </div>
        )}

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900/40 border-t border-slate-700/40 flex items-center justify-between">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancelEditing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Batal</span>
              </button>

              <button
                type="submit"
                form="edit-task-form"
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onClose();
                  onDeleteTask(task);
                }}
                className="flex items-center gap-1 px-3 py-1.5 text-rose-400 hover:bg-rose-950/40 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Tugas</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleStartEditing}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/50 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5 text-slate-400" />
                  <span>Edit Tugas</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
