<template>
    <div
        class="relative flex flex-col items-center justify-center rounded-2xl p-1.5 min-w-[76px] sm:min-w-[88px] transition-all duration-300"
        :class="movesRemaining <= 5 ? 'scale-105' : ''"
    >
        <!-- Outer Glowing Radial Ring -->
        <div
            class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex flex-col items-center justify-center shadow-lg border backdrop-blur-md overflow-hidden"
            :class="movesRemaining <= 5
                ? 'bg-rose-950/80 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
                : 'bg-slate-900/90 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]'"
        >
            <!-- Background Radial Glow -->
            <div
                class="absolute inset-0 opacity-40 pointer-events-none"
                :class="movesRemaining <= 5 ? 'bg-radial from-rose-500 to-transparent' : 'bg-radial from-cyan-500 to-transparent'"
            ></div>

            <span class="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 leading-none">
                MOVES
            </span>
            <span
                class="font-mono font-black text-xl sm:text-2xl leading-tight tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                :class="movesRemaining <= 5 ? 'text-rose-400' : 'text-white'"
            >
                {{ movesRemaining }}
            </span>
        </div>
    </div>
</template>

<script setup>
// YB - 16-09-2026 Cosmic Reactor MoveCounter display with high-tech radial glow and low-move pulse
defineProps({
    movesRemaining: {
        type: Number,
        default: 0,
    },
});
</script>
