/**
 * Utility functions for formatting dates and application usage time.
 */

const INDONESIAN_MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const INDONESIAN_SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

/**
 * Format ISO date string into Indonesian format (e.g., "September 2026")
 */
export const formatJoinedDate = (dateString?: string): string => {
  if (!dateString) return 'September 2026';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Baru Saja';
    const month = INDONESIAN_MONTHS[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${year}`;
  } catch {
    return 'Baru Saja';
  }
};

/**
 * Format seconds of screen/tab usage into human-readable string.
 * Always shows seconds so the counter visibly ticks in real-time.
 * Example outputs: "0s", "45s", "15m 30s", "1j 37m 45s"
 */
export const formatAppUsageTime = (totalSeconds: number): string => {
  if (!totalSeconds || totalSeconds <= 0) return '0s';

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}j ${minutes}m ${seconds}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

export interface RemainingDaysInfo {
  label: string;
  diffDays: number;
  colorClass: string;
  iconType: 'alert' | 'clock' | 'calendar';
  formattedDueDate: string;
  rawDueDate: string;
}

/**
 * Parse a due date string and return dynamic remaining days countdown alert info.
 */
export const getRemainingDaysInfo = (dueDateStr?: string): RemainingDaysInfo => {
  if (!dueDateStr) {
    return {
      label: 'Tanpa tenggat',
      diffDays: 0,
      colorClass: 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
      iconType: 'calendar',
      formattedDueDate: '-',
      rawDueDate: '-'
    };
  }

  // Parse date string (handles YYYY-MM-DD or standard ISO strings)
  const parts = dueDateStr.split('T')[0].split('-');
  let targetDate: Date;
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    targetDate = new Date(year, month, day);
  } else {
    targetDate = new Date(dueDateStr);
  }

  if (isNaN(targetDate.getTime())) {
    return {
      label: dueDateStr,
      diffDays: 0,
      colorClass: 'bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700',
      iconType: 'calendar',
      formattedDueDate: dueDateStr,
      rawDueDate: dueDateStr
    };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());

  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const dayStr = String(target.getDate()).padStart(2, '0');
  const monthStr = INDONESIAN_SHORT_MONTHS[target.getMonth()];
  const formattedDueDate = `${dayStr} ${monthStr} ${target.getFullYear()}`;

  let label: string;
  let colorClass: string;
  let iconType: 'alert' | 'clock' | 'calendar' = 'clock';

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    label = `Terlewat ${overdueDays} hari`;
    colorClass = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50';
    iconType = 'alert';
  } else if (diffDays === 0) {
    label = 'Hari ini';
    colorClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
    iconType = 'clock';
  } else if (diffDays === 1) {
    label = 'Besok';
    colorClass = 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
    iconType = 'clock';
  } else {
    label = `${diffDays} hari lagi`;
    colorClass = 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700';
    iconType = 'clock';
  }

  return {
    label,
    diffDays,
    colorClass,
    iconType,
    formattedDueDate,
    rawDueDate: dueDateStr
  };
};

/**
 * Short label for compact card display (e.g. "Hari ini", "Besok", "3 hari lagi", or "12 Okt")
 */
export const formatDueDateShort = (dueDateStr?: string): string => {
  if (!dueDateStr) return 'Hari ini';
  const info = getRemainingDaysInfo(dueDateStr);
  if (info.label && info.label !== dueDateStr) {
    return info.label;
  }
  return info.formattedDueDate || dueDateStr;
};



