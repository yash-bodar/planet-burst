<template>
    <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
        <div class="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-rose-900/60 shadow-[0_0_50px_rgba(244,63,94,0.3)] p-6 flex flex-col items-center gap-4 text-center">
            <!-- Alert Icon -->
            <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-600 to-amber-600 p-1 shadow-[0_0_25px_rgba(244,63,94,0.5)] flex items-center justify-center text-3xl">
                ⚠️
            </div>

            <!-- Title -->
            <div class="flex flex-col gap-1">
                <h2 class="text-2xl font-black uppercase tracking-wider text-rose-400">
                    Mission Failed
                </h2>
                <p class="text-xs text-slate-400 font-medium">Out of moves! Gravity lock engaged.</p>
            </div>

            <!-- Score Summary Card -->
            <div class="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
                <div class="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Score Achieved</span>
                    <span class="font-mono text-slate-200">{{ score.toLocaleString() }}</span>
                </div>
            </div>

            <!-- Actions -->
            <div class="w-full flex flex-col gap-2 pt-2">
                <button
                    type="button"
                    @click="$emit('retry')"
                    class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:scale-102 active:scale-98 transition-all cursor-pointer"
                >
                    Retry Mission ↺
                </button>

                <button
                    type="button"
                    @click="$emit('exit-to-map')"
                    class="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                    Galaxy Map
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
// YB - 16-09-2026 MissionFailedModal component with retry options
defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    score: {
        type: Number,
        default: 0,
    },
});

defineEmits(['retry', 'exit-to-map']);
</script>
