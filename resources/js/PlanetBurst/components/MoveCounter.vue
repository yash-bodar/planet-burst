<template>
    <div
        class="flex flex-col items-center justify-center bg-slate-900/80 border rounded-2xl px-4 py-2 shadow-lg backdrop-blur-md min-w-[90px] transition-all duration-200"
        :class="movesRemaining <= 5 ? 'border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse' : 'border-slate-700/60'"
    >
        <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Moves
        </span>
        <span
            class="font-mono font-black text-2xl"
            :class="movesRemaining <= 5 ? 'text-rose-400' : 'text-cyan-300'"
        >
            {{ movesRemaining }}
        </span>
    </div>
</template>

<script setup>
// YB - 16-09-2026 MoveCounter display component with low move alert states
defineProps({
    movesRemaining: {
        type: Number,
        default: 0,
    },
});
</script>
