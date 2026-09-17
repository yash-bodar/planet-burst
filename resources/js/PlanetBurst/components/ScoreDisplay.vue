<template>
    <div class="flex flex-col items-center gap-1.5 w-full max-w-[180px] sm:max-w-[200px]">
        <!-- Top Row: Score Header & Formatted Points -->
        <div class="flex items-baseline justify-between w-full px-1">
            <span class="tracking-widest uppercase text-[9px] font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)] flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                SCORE
            </span>
            <div class="font-mono font-black text-base sm:text-lg text-white tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
                {{ formattedScore }}
            </div>
        </div>

        <!-- Dynamic Liquid Plasma Meter Track with 3 Milestone Stars -->
        <div class="relative w-full h-3.5 bg-slate-950/95 border border-slate-700/80 rounded-full p-0.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)]">
            <!-- Liquid Plasma Animated Fill -->
            <div
                class="plasma-fill-bar h-full rounded-full relative transition-all duration-400 overflow-hidden shadow-[0_0_12px_rgba(34,211,238,0.9)]"
                :style="{ width: `${progressPercent}%` }"
            >
                <!-- Plasma Liquid Wave Shimmer Overlay -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-plasma-wave"></div>
                <!-- Leading Edge Luminous Core Particle -->
                <div class="absolute right-0 top-0 bottom-0 w-2.5 bg-white/90 rounded-full blur-[1px] shadow-[0_0_8px_#ffffff]"></div>
            </div>

            <!-- 3 Physical Star Milestone Pins Along The Track -->
            <div
                v-for="starIndex in 3"
                :key="'star-node-'+starIndex"
                class="star-milestone-pin absolute -top-1.5 -translate-x-1/2 flex items-center justify-center transition-all duration-300 z-20 cursor-pointer"
                :style="{ left: `${getStarMilestonePercent(starIndex)}%` }"
            >
                <!-- Star Socket / Radiant Badge -->
                <div
                    class="relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                    :class="starIndex <= starsEarned
                        ? 'bg-gradient-to-tr from-amber-400 to-yellow-200 border-2 border-white shadow-[0_0_15px_#fbbf24,0_0_25px_#f59e0b] scale-115 animate-star-ignite'
                        : 'bg-slate-900/90 border border-slate-700 text-slate-600 opacity-60 shadow-inner'"
                >
                    <!-- 3D Star Vector Icon -->
                    <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 transition-transform">
                        <polygon
                            points="12,2 15,8.5 22,9.3 17,14.2 18.5,21.2 12,17.5 5.5,21.2 7,14.2 2,9.3 9,8.5"
                            :fill="starIndex <= starsEarned ? '#78350f' : '#475569'"
                            :stroke="starIndex <= starsEarned ? '#ffffff' : '#334155'"
                            stroke-width="1.2"
                        />
                    </svg>

                    <!-- Star Ignition Rotating Rays -->
                    <div
                        v-if="starIndex === starsEarned"
                        class="absolute -inset-1 rounded-full border border-amber-300/80 blur-[1px] animate-spin pointer-events-none"
                        style="animation-duration: 4s;"
                    ></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// YB - 17-09-2026 ScoreDisplay component with animated liquid plasma fluid progress and physical 3D star milestone pins
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
    const max = props.starThresholds[props.starThresholds.length - 1] || 15000;
    return Math.min(100, Math.round(((props.score || 0) / max) * 100));
});

// Calculate the milestone percentage along the meter for Star 1, 2, and 3
function getStarMilestonePercent(starIndex) {
    if (!props.starThresholds || props.starThresholds.length === 0) {
        return starIndex * 33.33;
    }
    const max = props.starThresholds[props.starThresholds.length - 1] || 15000;
    const threshold = props.starThresholds[starIndex - 1] || (max * (starIndex / 3));
    return Math.max(12, Math.min(96, Math.round((threshold / max) * 100)));
}
</script>

<style scoped>
/* Animated Liquid Plasma Fluid Gradient */
.plasma-fill-bar {
    background: linear-gradient(
        90deg,
        #06b6d4,
        #3b82f6,
        #8b5cf6,
        #ec4899,
        #f59e0b,
        #06b6d4
    );
    background-size: 200% 100%;
    animation: plasmaFlow 3s linear infinite;
}

@keyframes plasmaFlow {
    0% { background-position: 100% 0%; }
    100% { background-position: 0% 0%; }
}

@keyframes plasmaWave {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
}

.animate-plasma-wave {
    animation: plasmaWave 2.2s ease-in-out infinite;
}

@keyframes starIgnite {
    0% { transform: scale(0.9); }
    50% { transform: scale(1.3); filter: drop-shadow(0 0 12px #fbbf24); }
    100% { transform: scale(1.15); }
}

.animate-star-ignite {
    animation: starIgnite 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
</style>
