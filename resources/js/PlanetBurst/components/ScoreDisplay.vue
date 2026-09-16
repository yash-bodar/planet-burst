<template>
    <div class="flex flex-col items-center gap-1 w-full max-w-[200px]">
        <div class="flex items-center justify-between w-full text-xs font-bold text-slate-400">
            <span class="tracking-wider uppercase text-[10px] text-cyan-300">Cosmic Score</span>
            <div class="flex items-center gap-1">
                <!-- Stars -->
                <span
                    v-for="star in 3"
                    :key="star"
                    class="transition-all duration-300 text-sm"
                    :class="star <= starsEarned ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] scale-110' : 'text-slate-600 opacity-40'"
                >
                    ★
                </span>
            </div>
        </div>

        <div class="w-full flex items-baseline justify-between bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 py-1 shadow-inner">
            <span class="font-mono font-black text-xl text-white tracking-wider">
                {{ formattedScore }}
            </span>
            <span v-if="targetScore" class="font-mono text-xs text-slate-500">
                / {{ targetScore.toLocaleString() }}
            </span>
        </div>

        <!-- Progress to next star -->
        <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
                class="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-amber-300 transition-all duration-300"
                :style="{ width: `${progressPercent}%` }"
            ></div>
        </div>
    </div>
</template>

<script setup>
// YB - 16-09-2026 ScoreDisplay component with dynamic star thresholds and progress bar
import { computed } from 'vue';

const props = defineProps({
    score: {
        type: Number,
        default: 0,
    },
    starsEarned: {
        type: Number,
        default: 0,
    },
    starThresholds: {
        type: Array,
        default: () => [5000, 10000, 15000],
    },
    targetScore: {
        type: Number,
        default: null,
    },
});

const formattedScore = computed(() => {
    return props.score.toLocaleString();
});

const progressPercent = computed(() => {
    if (!props.starThresholds || props.starThresholds.length === 0) return 0;
    const maxThreshold = props.starThresholds[props.starThresholds.length - 1];
    return Math.min(100, Math.round((props.score / maxThreshold) * 100));
});
</script>
