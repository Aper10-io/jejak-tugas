import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Check, 
  Layers, 
  Code2, 
  GraduationCap, 
  BookOpen, 
  FileText, 
  FolderKanban, 
  MoreHorizontal 
} from 'lucide-react';
import { TaskCategory } from '../types';

export const CATEGORY_OPTIONS: { value: 'Semua' | TaskCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'Semua', label: 'Semua Kategori', icon: Layers },
  { value: 'Pemrograman', label: 'Pemrograman', icon: Code2 },
  { value: 'Belajar', label: 'Belajar', icon: GraduationCap },
  { value: 'Membaca', label: 'Membaca', icon: BookOpen },
  { value: 'Tugas Kuliah', label: 'Tugas Kuliah', icon: FileText },
  { value: 'Proyek', label: 'Proyek', icon: FolderKanban },
  { value: 'Lainnya', label: 'Lainnya', icon: MoreHorizontal }
];

export const TASK_FORM_CATEGORIES: { value: TaskCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'Pemrograman', label: 'Pemrograman', icon: Code2 },
  { value: 'Belajar', label: 'Belajar', icon: GraduationCap },
  { value: 'Membaca', label: 'Membaca', icon: BookOpen },
  { value: 'Tugas Kuliah', label: 'Tugas Kuliah', icon: FileText },
  { value: 'Proyek', label: 'Proyek', icon: FolderKanban },
  { value: 'Lainnya', label: 'Lainnya', icon: MoreHorizontal }
];

interface CategoryDropdownProps {
  value: string;
  onChange: (val: string) => void;
  includeAllOption?: boolean;
  className?: string;
  size?: 'sm' | 'md';
  placeholder?: string;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  value,
  onChange,
  includeAllOption = true,
  className = '',
  size = 'md',
  placeholder = 'Pilih Kategori'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const options = includeAllOption ? CATEGORY_OPTIONS : TASK_FORM_CATEGORIES;

  const selectedOption = options.find(opt => opt.value === value) || (
    includeAllOption ? CATEGORY_OPTIONS[0] : TASK_FORM_CATEGORIES[0]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const SelectedIcon = selectedOption?.icon || Layers;

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      
      {/* Trigger Button */}
      <button
        type="button"
        id="category-dropdown-trigger"
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{ borderColor: '#E2E8F0' }}
        className={`w-full flex items-center justify-between gap-2.5 bg-white text-slate-700 font-medium rounded-lg text-sm transition-all duration-150 border hover:border-slate-300 hover:bg-slate-50/70 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 cursor-pointer ${
          size === 'sm' ? 'py-1.5 px-3 text-xs' : 'py-2 px-3.5'
        } ${isOpen ? 'ring-2 ring-stone-900/10 border-stone-400 bg-white' : ''}`}
      >
        <div className="flex items-center gap-2 min-w-0 truncate">
          <SelectedIcon className={`shrink-0 text-slate-500 ${size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
          <span className="truncate text-slate-700 font-medium">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>

        <ChevronDown 
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${
            size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
          } ${isOpen ? 'rotate-180 text-stone-900' : ''}`} 
        />
      </button>

      {/* Dropdown Menu Container */}
      {isOpen && (
        <div
          id="category-dropdown-menu"
          role="listbox"
          className="absolute left-0 mt-1.5 w-56 sm:w-60 bg-white rounded-xl border border-slate-100 shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-left"
        >
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
            {options.map((option) => {
              const isSelected = option.value === value || (option.value === 'Semua' && (value === 'Semua' || !value));
              const IconComp = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between text-left px-3.5 py-2.5 text-sm transition-colors duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100 text-slate-900 font-medium'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IconComp 
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isSelected ? 'text-stone-900' : 'text-slate-400 group-hover:text-slate-600'
                      }`} 
                    />
                    <span className="truncate">{option.label}</span>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-stone-900 shrink-0 ml-2 stroke-[2.5]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
