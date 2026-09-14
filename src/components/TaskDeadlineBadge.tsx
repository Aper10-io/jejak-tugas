import React from 'react';
import { getRemainingDaysInfo } from '../utils/timeFormat';
import { Clock, AlertCircle, Calendar } from 'lucide-react';

interface TaskDeadlineBadgeProps {
  dueDate?: string;
  className?: string;
}

export const TaskDeadlineBadge: React.FC<TaskDeadlineBadgeProps> = ({ dueDate, className = '' }) => {
  const { label, colorClass, iconType, formattedDueDate, rawDueDate } = getRemainingDaysInfo(dueDate);

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors shadow-2xs select-none shrink-0 ${colorClass} ${className}`}
      title={`Tenggat: ${formattedDueDate} (${rawDueDate})`}
    >
      {iconType === 'alert' ? (
        <AlertCircle className="w-3 h-3 shrink-0 stroke-[2.2]" />
      ) : (
        <Clock className="w-3 h-3 shrink-0 stroke-[2.2]" />
      )}
      <span className="whitespace-nowrap">{label}</span>
    </span>
  );
};
