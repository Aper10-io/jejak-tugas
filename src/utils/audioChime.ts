/**
 * Web Audio API - Zen Tibetan Singing Bowl / Gentle Temple Bell Synthesizer.
 * Synthesizes deep, warm, and soothing harmonic resonance without external MP3 files.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (typeof window === 'undefined') return null;

    if (!audioCtx || audioCtx.state === 'closed') {
      const AudioContextClass = 
        window.AudioContext || 
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }

    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }

    return audioCtx;
  } catch (err) {
    console.warn('Web Audio API is not accessible:', err);
    return null;
  }
}

/**
 * Check if sound notifications are enabled in user localStorage preferences.
 */
export function isSoundNotificationEnabled(): boolean {
  try {
    return localStorage.getItem('jejak_sound_notification') !== 'false';
  } catch {
    return true;
  }
}

/**
 * Synthesizes a deep, warm Zen Tibetan Singing Bowl / Temple Bell sound.
 * 
 * Audio Characteristics:
 * - Fundamental frequency: ~432Hz (warm A4 pitch) with 'sine' waveform
 * - Harmonic overtone: ~864Hz (gentle upper ring) with 'sine' waveform
 * - Envelope: Smooth 0.08s attack and long 2.8s-3.0s exponential decay (no clicks/pops)
 * - Balanced volume: headset-safe, gentle, and relaxing
 */
export function playZenSingingBowl(): void {
  if (!isSoundNotificationEnabled()) {
    return;
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const duration = 2.8; // Total reverberation time in seconds
    const attackTime = 0.08; // 80ms gentle soft attack

    // 1. Primary Fundamental Oscillator (432Hz - warm meditative body)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(432, now);

    // 2. Harmonic Overtone Oscillator (864Hz - serene temple bell shimmer)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(864, now);

    // Master Gain Envelopes
    // Fundamental tone envelope
    gain1.gain.setValueAtTime(0.0001, now);
    gain1.gain.linearRampToValueAtTime(0.26, now + attackTime);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Harmonic overtone envelope (softer presence, slightly faster decay)
    gain2.gain.setValueAtTime(0.0001, now);
    gain2.gain.linearRampToValueAtTime(0.09, now + attackTime);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.8));

    // Audio routing
    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(ctx.destination);
    gain2.connect(ctx.destination);

    // Trigger playback
    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
  } catch (err) {
    console.warn('Error synthesizing Zen singing bowl sound:', err);
  }
}

/**
 * Standard timer completion chime entry point.
 */
export function playTimerCompletionSound(_type: 'focus' | 'break' = 'focus'): void {
  playZenSingingBowl();
}
