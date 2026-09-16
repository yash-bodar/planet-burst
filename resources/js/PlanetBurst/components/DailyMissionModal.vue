<template>
    <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
        <div class="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.3)] p-6 flex flex-col items-center gap-4 text-center">
            <!-- Icon -->
            <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-amber-400 p-1 shadow-[0_0_25px_rgba(168,85,247,0.6)] flex items-center justify-center text-3xl">
                🌟
            </div>

            <div class="flex flex-col gap-1">
                <span class="text-[10px] uppercase font-black tracking-widest text-purple-400">Daily Challenge</span>
                <h2 class="text-xl font-black text-white">
                    {{ dailyMission?.title || 'Nebula Inversion' }}
                </h2>
                <p class="text-xs text-slate-400 font-medium">
                    A cosmic alignment appears once every 24 hours.
                </p>
            </div>

            <!-- Objective Details -->
            <div class="w-full bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col gap-2.5 text-left text-xs">
                <div class="flex items-center justify-between text-slate-400">
                    <span>Target Score</span>
                    <span class="font-mono text-white font-bold">{{ (dailyMission?.target_score || 12000).toLocaleString() }}</span>
                </div>
                <div class="flex items-center justify-between text-slate-400">
                    <span>Move Limit</span>
                    <span class="font-mono text-cyan-400 font-bold">{{ dailyMission?.move_limit || 22 }} Moves</span>
                </div>
                <div class="flex items-center justify-between text-slate-400">
                    <span>Your Today's Best</span>
                    <span class="font-mono text-amber-300 font-bold">
                        {{ dailyScore > 0 ? dailyScore.toLocaleString() : 'Not played yet' }}
                    </span>
                </div>
            </div>

            <!-- Action -->
            <div class="w-full flex flex-col gap-2 pt-2">
                <button
                    type="button"
                    @click="$emit('start-daily')"
                    class="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-purple-500/25 hover:scale-102 active:scale-98 transition-all cursor-pointer"
                >
                    Launch Daily Mission →
                </button>

                <button
                    type="button"
                    @click="$emit('close')"
                    class="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
// YB - 16-09-2026 DailyMissionModal component displaying daily challenge rules and best score
defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    dailyMission: {
        type: Object,
        default: null,
    },
    dailyScore: {
        type: Number,
        default: 0,
    },
});

defineEmits(['start-daily', 'close']);
</script>
