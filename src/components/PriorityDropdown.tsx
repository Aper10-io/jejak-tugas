import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { TaskPriority } from '../types';

export interface PriorityOption {
  value: TaskPriority;
  label: string;
  dotColor: string;
  bgColor: string;
  textColor: string;
}

export const PRIORITY_OPTIONS: PriorityOption[] = [
  { 
    value: 'tinggi', 
    label: 'Prioritas Tinggi (Mendesak)', 
    dotColor: 'bg-rose-500', 
    bgColor: 'bg-rose-50', 
    textColor: 'text-rose-700' 
  },
  { 
    value: 'sedang', 
    label: 'Prioritas Sedang', 
    dotColor: 'bg-amber-500', 
    bgColor: 'bg-amber-50', 
    textColor: 'text-amber-700' 
  },
  { 
    value: 'rendah', 
    label: 'Prioritas Rendah (Santai)', 
    dotColor: 'bg-emerald-500', 
    bgColor: 'bg-emerald-50', 
    textColor: 'text-emerald-700' 
  }
];

interface PriorityDropdownProps {
  value: TaskPriority;
  onChange: (val: TaskPriority) => void;
  className?: string;
}

export const PriorityDropdown: React.FC<PriorityDropdownProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = PRIORITY_OPTIONS.find(opt => opt.value === value) || PRIORITY_OPTIONS[1];

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

  return (
    <div className={`relative inline-block text-left w-full ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        id="priority-dropdown-trigger"
        onClick={() => setIsOpen(prev => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        style={{ borderColor: '#E2E8F0' }}
        className={`w-full flex items-center justify-between gap-2.5 bg-white text-slate-700 font-medium rounded-lg text-sm py-2 px-3.5 transition-all duration-150 border hover:border-slate-300 hover:bg-slate-50/70 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-400 cursor-pointer ${
          isOpen ? 'ring-2 ring-stone-900/10 border-stone-400 bg-white' : ''
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 truncate">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${selectedOption.dotColor}`} />
          <span className="truncate text-slate-700 font-medium">
            {selectedOption.label}
          </span>
        </div>

        <ChevronDown 
          className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-stone-900' : ''
          }`} 
        />
      </button>

      {/* Dropdown Menu Container */}
      {isOpen && (
        <div
          id="priority-dropdown-menu"
          role="listbox"
          className="absolute left-0 mt-1.5 w-full bg-white rounded-xl border border-slate-100 shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top"
        >
          <div className="divide-y divide-slate-50">
            {PRIORITY_OPTIONS.map((option) => {
              const isSelected = option.value === value;

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
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${option.dotColor}`} />
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
