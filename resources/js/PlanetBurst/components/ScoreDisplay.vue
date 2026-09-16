<template>
    <div class="flex flex-col items-center gap-1 w-full max-w-[170px] sm:max-w-[190px]">
        <!-- Top Row: Score Title & 3 Stars -->
        <div class="flex items-center justify-between w-full px-1">
            <span class="tracking-widest uppercase text-[9px] font-black text-cyan-300 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]">
                SCORE
            </span>
            <div class="flex items-center gap-1.5">
                <!-- 3 Dynamic Stars -->
                <div
                    v-for="star in 3"
                    :key="star"
                    class="relative flex items-center justify-center transition-all duration-300"
                >
                    <span
                        class="text-xs sm:text-sm font-black transition-all duration-300"
                        :class="star <= starsEarned
                            ? 'text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,1)] scale-125'
                            : 'text-slate-700 opacity-40'"
                    >
                        ★
                    </span>
                    <!-- Star Ignition Flare -->
                    <div
                        v-if="star === starsEarned"
                        class="absolute -inset-1 rounded-full bg-amber-400/30 blur-xs animate-ping pointer-events-none"
                    ></div>
                </div>
            </div>
        </div>

        <!-- Center Score Pod -->
        <div class="w-full flex items-baseline justify-between bg-slate-900/90 border border-slate-700/80 rounded-xl px-2.5 py-1 shadow-inner backdrop-blur-md">
            <span class="font-mono font-black text-lg sm:text-xl text-white tracking-wider drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                {{ formattedScore }}
            </span>
            <span v-if="targetScore" class="font-mono text-[10px] text-slate-500 font-bold">
                /{{ targetScore >= 1000 ? Math.round(targetScore / 1000) + 'k' : targetScore }}
            </span>
        </div>

        <!-- Dynamic Plasma Progress Bar -->
        <div class="w-full h-2 bg-slate-950/90 border border-slate-800 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
                class="h-full rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-400 transition-all duration-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                :style="{ width: `${progressPercent}%` }"
            ></div>
        </div>
    </div>
</template>

<script setup>
// YB - 16-09-2026 ScoreDisplay component with liquid plasma progress meter and animated star nodes
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
    return (props.score || 0).toLocaleString();
});

const progressPercent = computed(() => {
    if (!props.starThresholds || props.starThresholds.length === 0) return 0;
    const max = props.starThresholds[props.starThresholds.length - 1] || 10000;
    return Math.min(100, Math.round(((props.score || 0) / max) * 100));
});
</script>
