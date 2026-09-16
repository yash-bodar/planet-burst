// YB - 16-09-2026 Web Audio synthesizer abstraction for Planet Burst cosmic sound effects
import { ref } from 'vue';

const STORAGE_KEY_AUDIO_MUTED = 'planet_burst_muted_v1';

export function useAudio() {
    const isMuted = ref(localStorage.getItem(STORAGE_KEY_AUDIO_MUTED) === 'true');
    let audioCtx = null;

    // YB - 16-09-2026 Initialize or resume Web Audio Context on user interaction
    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // YB - 16-09-2026 Toggle audio mute status and persist to localStorage
    function toggleMute() {
        isMuted.value = !isMuted.value;
        localStorage.setItem(STORAGE_KEY_AUDIO_MUTED, isMuted.value ? 'true' : 'false');
    }

    // YB - 16-09-2026 Play tile swap swoosh sound
    function playSwap() {
        if (isMuted.value) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(580, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
    }

    // YB - 16-09-2026 Play invalid swap bump sound
    function playInvalid() {
        if (isMuted.value) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.setValueAtTime(120, ctx.currentTime + 0.06);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    }

    // YB - 16-09-2026 Play cosmic match chime with cascade pitch scaling
    function playMatch(cascade = 0) {
        if (isMuted.value) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const baseNotes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
        const noteIndex = Math.min(cascade, baseNotes.length - 1);
        const freq = baseNotes[noteIndex];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.18);

        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
    }

    // YB - 16-09-2026 Play comet laser beam sound effect
    function playComet() {
        if (isMuted.value) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
    }

    // YB - 16-09-2026 Play black hole gravitational collapse sound
    function playBlackHole() {
        if (isMuted.value) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.45);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
    }

    // YB - 16-09-2026 Play supernova universal burst sound
    function playSupernova() {
        if (isMuted.value) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        // Two oscillators for celestial harmony
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);

            gain.gain.setValueAtTime(0.12, ctx.currentTime + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.5);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + i * 0.05);
            osc.stop(ctx.currentTime + i * 0.05 + 0.5);
        });
    }

    // YB - 16-09-2026 Play mission victory fanfare
    function playVictory() {
        if (isMuted.value) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const chords = [523.25, 659.25, 783.99, 1046.50];
        chords.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

            gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.45);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.1);
            osc.stop(ctx.currentTime + idx * 0.1 + 0.45);
        });
    }

    // YB - 16-09-2026 Play mission failed sound
    function playFailed() {
        if (isMuted.value) return;
        const ctx = getAudioContext();
        if (!ctx) return;

        const notes = [330, 311.13, 293.66, 261.63];
        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

            gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(ctx.currentTime + idx * 0.12);
            osc.stop(ctx.currentTime + idx * 0.12 + 0.3);
        });
    }

    return {
        isMuted,
        toggleMute,
        playSwap,
        playInvalid,
        playMatch,
        playComet,
        playBlackHole,
        playSupernova,
        playVictory,
        playFailed,
    };
}
