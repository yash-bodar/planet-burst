<template>
    <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
        <div class="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700/80 shadow-[0_0_50px_rgba(34,211,238,0.3)] p-6 flex flex-col items-center gap-4 text-center">
            <!-- Stellar Icon Banner -->
            <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-500 to-amber-400 p-1 shadow-[0_0_25px_rgba(245,158,11,0.6)] flex items-center justify-center text-3xl animate-bounce">
                🚀
            </div>

            <!-- Title -->
            <div class="flex flex-col gap-1">
                <h2 class="text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-amber-300 via-yellow-200 to-cyan-300 bg-clip-text text-transparent">
                    Mission Complete!
                </h2>
                <p class="text-xs text-slate-400 font-medium">Cosmic sector successfully charted</p>
            </div>

            <!-- Stars Awarded -->
            <div class="flex items-center justify-center gap-2 py-2">
                <div
                    v-for="star in 3"
                    :key="star"
                    class="text-4xl transition-transform duration-500"
                    :class="star <= starsEarned ? 'text-amber-400 scale-125 drop-shadow-[0_0_15px_rgba(251,191,36,1)]' : 'text-slate-700 opacity-40'"
                >
                    ★
                </div>
            </div>

            <!-- Score Summary Card -->
            <div class="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
                <div class="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Mission Score</span>
                    <span class="font-mono text-slate-200">{{ score.toLocaleString() }}</span>
                </div>
                <div class="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>Unused Moves Bonus</span>
                    <span class="font-mono text-cyan-400">+{{ movesBonus.toLocaleString() }}</span>
                </div>
                <div class="h-px bg-slate-800 my-1"></div>
                <div class="flex items-center justify-between text-sm font-black text-white">
                    <span>Total Score</span>
                    <span class="font-mono text-amber-300 text-lg">{{ (score + movesBonus).toLocaleString() }}</span>
                </div>
            </div>

            <!-- Actions -->
            <div class="w-full flex flex-col gap-2 pt-2">
                <button
                    type="button"
                    @click="$emit('next-mission')"
                    class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:scale-102 active:scale-98 transition-all cursor-pointer"
                >
                    Next Mission →
                </button>

                <div class="flex items-center gap-2 w-full">
                    <button
                        type="button"
                        @click="$emit('replay')"
                        class="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                        Replay
                    </button>
                    <button
                        type="button"
                        @click="$emit('exit-to-map')"
                        class="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                    >
                        Galaxy Map
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// YB - 16-09-2026 MissionCompleteModal celebrating mission victory with score and star rewards
defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    starsEarned: {
        type: Number,
        default: 0,
    },
    score: {
        type: Number,
        default: 0,
    },
    movesBonus: {
        type: Number,
        default: 0,
    },
});

defineEmits(['next-mission', 'replay', 'exit-to-map']);
</script>
