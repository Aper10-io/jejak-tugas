import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  RotateCcw
} from 'lucide-react';

interface DatePickerPopoverProps {
  value: string; // ISO format 'YYYY-MM-DD'
  onChange: (val: string) => void;
  className?: string;
}

const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

export const DatePickerPopover: React.FC<DatePickerPopoverProps> = ({
  value,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Parse initial selected date
  const parseDate = (dStr: string) => {
    if (!dStr) return new Date();
    const parts = dStr.split('-');
    if (parts.length === 3) {
      return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    }
    return new Date();
  };

  const selectedDate = parseDate(value);
  const [viewDate, setViewDate] = useState<Date>(selectedDate);

  // Sync viewDate when value changes
  useEffect(() => {
    setViewDate(parseDate(value));
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
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

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  // Generate day grid cells
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    // 0 is Sunday, convert so 0 is Monday
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInCurrentMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDayOffset = getFirstDayOfMonth(viewYear, viewMonth);
  const daysInPrevMonth = getDaysInMonth(viewYear, viewMonth - 1);

  // Today helpers
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const formatDisplay = (dStr: string) => {
    if (!dStr) return 'Pilih Tanggal';
    const d = parseDate(dStr);
    const day = d.getDate();
    const month = MONTH_NAMES[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleSelectDay = (day: number) => {
    const monthStr = String(viewMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const fullDate = `${viewYear}-${monthStr}-${dayStr}`;
    onChange(fullDate);
    setIsOpen(false);
  };

  const handleSetQuickDate = (daysFromToday: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    const monthStr = String(d.getMonth() + 1).padStart(2, '0');
    const dayStr = String(d.getDate()).padStart(2, '0');
    const fullDate = `${d.getFullYear()}-${monthStr}-${dayStr}`;
    onChange(fullDate);
    setViewDate(d);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left w-full ${className}`} ref={popoverRef}>
      {/* Input / Trigger Button */}
      <button
        type="button"
        id="datepicker-trigger-btn"
        onClick={() => setIsOpen(prev => !prev)}
        className={`w-full flex items-center justify-between gap-2.5 bg-white text-slate-800 font-medium rounded-xl text-sm py-2 px-3.5 transition-all duration-150 border border-slate-200 shadow-sm hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 cursor-pointer ${
          isOpen ? 'ring-2 ring-amber-500/20 border-amber-500/50 bg-white' : ''
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 truncate">
          <CalendarIcon className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="truncate text-slate-800 font-medium">
            {formatDisplay(value)}
          </span>
        </div>

        <ChevronDown 
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-amber-500' : ''
          }`} 
        />
      </button>

      {/* Popover Card */}
      {isOpen && (
        <div
          id="datepicker-popover-card"
          className="absolute left-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-slate-100 shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-150 origin-top-left text-slate-800"
        >
          {/* Header Month/Year Navigation */}
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="font-bold text-slate-900 text-sm">
              {MONTH_NAMES[viewMonth]} <span className="text-slate-400 font-normal">{viewYear}</span>
            </h4>
            
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Bulan Sebelumnya"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Bulan Berikutnya"
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_NAMES.map((day) => (
              <div key={day} className="text-[11px] font-semibold text-slate-400 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Previous month trailing days */}
            {Array.from({ length: firstDayOffset }).map((_, i) => {
              const dayNum = daysInPrevMonth - firstDayOffset + i + 1;
              return (
                <div
                  key={`prev-${i}`}
                  className="h-8 flex items-center justify-center text-xs text-slate-300 pointer-events-none"
                >
                  {dayNum}
                </div>
              );
            })}

            {/* Current month days */}
            {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = dateStr === value;
              const isToday = dateStr === todayStr;

              return (
                <button
                  key={`cur-${dayNum}`}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`h-8 w-full flex items-center justify-center rounded-xl text-xs font-medium transition-all duration-150 relative cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-white font-bold shadow-xs'
                      : isToday
                      ? 'bg-amber-50/70 text-amber-900 font-bold border border-amber-300 hover:bg-amber-100'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span>{dayNum}</span>
                  {isToday && !isSelected && (
                    <span className="w-1 h-1 bg-amber-500 rounded-full absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Shortcuts Footer */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleSetQuickDate(0)}
              className="flex-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-center transition-colors cursor-pointer"
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => handleSetQuickDate(1)}
              className="flex-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-center transition-colors cursor-pointer"
            >
              Besok
            </button>
            <button
              type="button"
              onClick={() => handleSetQuickDate(3)}
              className="flex-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-center transition-colors cursor-pointer"
            >
              +3 Hari
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
