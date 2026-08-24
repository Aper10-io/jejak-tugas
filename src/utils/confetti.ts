import confetti from 'canvas-confetti';

/**
 * Tembakkan dua semburan partikel confetti dari pojok kiri bawah dan kanan bawah
 * Partikel warna: Amber, Emerald, Sky Blue, Pink, Purple
 */
export const triggerSideConfetti = () => {
  const count = 120;
  const defaults = {
    origin: { y: 0.85 },
    zIndex: 9999,
    disableForReducedMotion: true,
    colors: ['#F59E0B', '#10B981', '#38BDF8', '#EC4899', '#A855F7']
  };

  // Meriam kiri (menembak ke arah kanan atas)
  confetti({
    ...defaults,
    particleCount: count,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.85 }
  });

  // Meriam kanan (menembak ke arah kiri atas)
  confetti({
    ...defaults,
    particleCount: count,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.85 }
  });
};

// Alias for backward compatibility if needed
export const triggerTargetCelebration = triggerSideConfetti;

