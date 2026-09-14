import React from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'motion/react';
import { TaskItem, StreakData } from '../types';
import { ProfileContent } from './ProfileContent';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: TaskItem[];
  streakData: StreakData;
  userName: string;
  onUpdateUserName: (name: string) => void;
  userInitials?: string;
  onUpdateUserInitials?: (initials: string) => void;
  firstJoinedDate?: string;
  appUsageSeconds?: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  tasks,
  streakData,
  userName,
  onUpdateUserName,
  userInitials = 'JT',
  onUpdateUserInitials,
  firstJoinedDate,
  appUsageSeconds = 0
}) => {
  const dragControls = useDragControls();

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Threshold: >100px drag down or fast flick down velocity >350px/s
    if (info.offset.y > 100 || info.velocity.y > 350) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden">
          
          {/* Backdrop overlay with fade-in / fade-out */}
          <motion.div
            key="profile-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={onClose}
            aria-hidden="true"
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs cursor-pointer -z-10"
          />

          {/* Bottom Sheet Drawer (Mobile) & Modal Card (Desktop) */}
          <motion.div
            key="profile-modal-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="Profil dan Pengaturan Pengguna"
            initial={{ y: '100%', opacity: 0.8 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 350,
              mass: 0.8
            }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.05, bottom: 0.65 }}
            onDragEnd={handleDragEnd}
            className="relative w-full max-w-lg sm:max-w-xl bg-white text-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 p-5 sm:p-6 max-h-[88vh] sm:max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Top Interactive Drag Handle Bar (Touch / Pointer zone) */}
            <div
              onPointerDown={(e) => dragControls.start(e)}
              title="Tarik ke bawah untuk menutup"
              className="w-full pt-1 pb-3 sm:pb-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none group"
            >
              <div className="w-14 h-1.5 bg-slate-300 group-hover:bg-slate-400 group-active:bg-slate-500 rounded-full transition-colors" />
              <span className="text-[9px] text-slate-400 font-medium tracking-wide mt-1 sm:hidden group-hover:text-slate-600">
                Tarik ke bawah untuk menutup
              </span>
            </div>

            {/* Profile Content */}
            <ProfileContent
              tasks={tasks}
              streakData={streakData}
              userName={userName}
              onUpdateUserName={onUpdateUserName}
              userInitials={userInitials}
              onUpdateUserInitials={onUpdateUserInitials}
              onClose={onClose}
              firstJoinedDate={firstJoinedDate}
              appUsageSeconds={appUsageSeconds}
            />
          </motion.div>

        </div>
      )}
    </AnimatePresence>
  );
};

