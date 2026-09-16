<template>
    <div
        class="cosmic-tile-container relative flex items-center justify-center select-none cursor-pointer w-full h-full p-0.5"
        :class="{
            'is-selected': isSelected,
            'is-matched': tile?.isMatched,
            'is-new': tile?.isNew
        }"
    >
        <!-- Ice Obstacle Layer (under/around tile) -->
        <div
            v-if="tile?.obstacle === 'ice'"
            class="absolute inset-0.5 rounded-xl bg-cyan-400/35 border-2 border-cyan-200/80 backdrop-blur-xs z-10 flex items-center justify-center shadow-[inset_0_0_12px_rgba(34,211,238,0.6)]"
        >
            <div class="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-white/80"></div>
            <div class="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-white/80"></div>
            <span class="text-xs">❄️</span>
        </div>

        <!-- Gravity Lock Obstacle Layer -->
        <div
            v-if="tile?.obstacle === 'lock'"
            class="absolute inset-1 rounded-xl border-2 border-dashed border-amber-400/90 z-20 flex items-center justify-center bg-black/40 backdrop-blur-xs animate-pulse"
        >
            <span class="text-xs drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]">🔒</span>
        </div>

        <!-- Asteroid Rock Obstacle (Unmatchable) -->
        <div
            v-if="tile?.obstacle === 'rock'"
            class="w-full h-full rounded-2xl bg-gradient-to-br from-stone-600 via-stone-700 to-stone-900 border-2 border-stone-500 shadow-inner flex items-center justify-center z-10"
        >
            <span class="text-xl">🪨</span>
        </div>

        <!-- Normal or Special Cosmic Tile Graphic -->
        <div
            v-else-if="tile"
            class="cosmic-tile-body relative w-full h-full rounded-2xl flex items-center justify-center transition-transform duration-150"
            :class="[
                tileThemeClasses,
                { 'scale-90': isSelected }
            ]"
        >
            <!-- Original Vector Cosmic Artwork -->
            <svg viewBox="0 0 64 64" class="w-[82%] h-[82%] drop-shadow-md transition-transform duration-200">
                <!-- 🪐 Ringed Amber Planet -->
                <g v-if="tile.type === 'planet_amber'">
                    <defs>
                        <radialGradient id="amberGrad" cx="40%" cy="40%" r="60%">
                            <stop offset="0%" stop-color="#fef08a" />
                            <stop offset="60%" stop-color="#f59e0b" />
                            <stop offset="100%" stop-color="#78350f" />
                        </radialGradient>
                    </defs>
                    <!-- Planet Body -->
                    <circle cx="32" cy="32" r="18" fill="url(#amberGrad)" />
                    <!-- Atmosphere Band -->
                    <ellipse cx="32" cy="30" rx="17" ry="4" fill="#d97706" opacity="0.4" />
                    <!-- Planetary Rings -->
                    <ellipse cx="32" cy="32" rx="28" ry="8" fill="none" stroke="#fef08a" stroke-width="3" opacity="0.9" transform="rotate(-20 32 32)" />
                    <ellipse cx="32" cy="32" rx="24" ry="6" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.7" transform="rotate(-20 32 32)" />
                </g>

                <!-- 🌍 Terra Cyan Planet -->
                <g v-else-if="tile.type === 'planet_cyan'">
                    <defs>
                        <radialGradient id="cyanGrad" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stop-color="#67e8f9" />
                            <stop offset="60%" stop-color="#06b6d4" />
                            <stop offset="100%" stop-color="#0e7490" />
                        </radialGradient>
                    </defs>
                    <circle cx="32" cy="32" r="19" fill="url(#cyanGrad)" />
                    <!-- Swirling Continents -->
                    <path d="M 24 24 Q 28 18 34 22 Q 40 25 38 32 Q 32 34 26 30 Z" fill="#10b981" opacity="0.85" />
                    <path d="M 28 38 Q 36 36 38 42 Q 32 46 26 44 Z" fill="#10b981" opacity="0.8" />
                    <!-- Atmosphere Glow Ring -->
                    <circle cx="32" cy="32" r="19" fill="none" stroke="#a5f3fc" stroke-width="1.5" opacity="0.6" />
                </g>

                <!-- 🟣 Nebula Purple Orb -->
                <g v-else-if="tile.type === 'planet_purple'">
                    <defs>
                        <radialGradient id="purpleGrad" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stop-color="#f0abfc" />
                            <stop offset="55%" stop-color="#a855f7" />
                            <stop offset="100%" stop-color="#581c87" />
                        </radialGradient>
                    </defs>
                    <circle cx="32" cy="32" r="18" fill="url(#purpleGrad)" />
                    <!-- Orbital Pulsar Rings -->
                    <circle cx="32" cy="32" r="12" fill="none" stroke="#e879f9" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.8" />
                    <circle cx="32" cy="32" r="5" fill="#ffffff" opacity="0.9" />
                </g>

                <!-- 🔴 Crimson Star -->
                <g v-else-if="tile.type === 'planet_ruby'">
                    <defs>
                        <radialGradient id="rubyGrad" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stop-color="#fda4af" />
                            <stop offset="55%" stop-color="#f43f5e" />
                            <stop offset="100%" stop-color="#881337" />
                        </radialGradient>
                    </defs>
                    <circle cx="32" cy="32" r="18" fill="url(#rubyGrad)" />
                    <!-- Solar Coronas -->
                    <path d="M 32 8 L 34 20 L 46 22 L 36 30 L 40 42 L 32 34 L 24 42 L 28 30 L 18 22 L 30 20 Z" fill="#fb7185" opacity="0.5" />
                    <circle cx="27" cy="27" r="4" fill="#ffffff" opacity="0.6" />
                </g>

                <!-- ❄️ Frost Comet -->
                <g v-else-if="tile.type === 'planet_ice'">
                    <defs>
                        <radialGradient id="iceGrad" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stop-color="#e0f2fe" />
                            <stop offset="60%" stop-color="#38bdf8" />
                            <stop offset="100%" stop-color="#0369a1" />
                        </radialGradient>
                    </defs>
                    <!-- Octagonal Crystal Planet -->
                    <polygon points="32,12 45,17 50,30 45,43 32,48 19,43 14,30 19,17" fill="url(#iceGrad)" />
                    <!-- Crystal Shards -->
                    <polygon points="32,18 40,30 32,42 24,30" fill="#ffffff" opacity="0.6" />
                </g>

                <!-- ☀️ Solar Core -->
                <g v-else>
                    <defs>
                        <radialGradient id="solarGrad" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stop-color="#ffffff" />
                            <stop offset="40%" stop-color="#fde047" />
                            <stop offset="85%" stop-color="#ea580c" />
                            <stop offset="100%" stop-color="#7c2d12" />
                        </radialGradient>
                    </defs>
                    <circle cx="32" cy="32" r="18" fill="url(#solarGrad)" />
                    <!-- Sun Flare Sparks -->
                    <circle cx="32" cy="10" r="2.5" fill="#fde047" />
                    <circle cx="32" cy="54" r="2.5" fill="#fde047" />
                    <circle cx="10" cy="32" r="2.5" fill="#fde047" />
                    <circle cx="54" cy="32" r="2.5" fill="#fde047" />
                </g>
            </svg>

            <!-- 🌟 Special Power Badges & Overlays (Candy Crush style powers) -->
            <!-- 1. Horizontal Striped Candy/Comet (Clears Row) -->
            <div
                v-if="tile.power === 'comet_h'"
                class="absolute inset-0 flex flex-col items-center justify-around py-2 px-1 pointer-events-none z-20"
            >
                <div class="w-full h-1 bg-white shadow-[0_0_8px_#ffffff] rounded-full opacity-90"></div>
                <div class="w-full h-1.5 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_12px_#38bdf8] rounded-full"></div>
                <div class="w-full h-1 bg-white shadow-[0_0_8px_#ffffff] rounded-full opacity-90"></div>
                <!-- Mini directional markers -->
                <div class="absolute inset-0 flex items-center justify-between px-1">
                    <span class="text-[9px] font-black text-white drop-shadow-[0_0_4px_#000000]">◀</span>
                    <span class="text-[9px] font-black text-white drop-shadow-[0_0_4px_#000000]">▶</span>
                </div>
            </div>

            <!-- 2. Vertical Striped Candy/Comet (Clears Column) -->
            <div
                v-else-if="tile.power === 'comet_v'"
                class="absolute inset-0 flex items-center justify-around px-2 py-1 pointer-events-none z-20"
            >
                <div class="h-full w-1 bg-white shadow-[0_0_8px_#ffffff] rounded-full opacity-90"></div>
                <div class="h-full w-1.5 bg-gradient-to-b from-transparent via-white to-transparent shadow-[0_0_12px_#38bdf8] rounded-full"></div>
                <div class="h-full w-1 bg-white shadow-[0_0_8px_#ffffff] rounded-full opacity-90"></div>
                <!-- Mini directional markers -->
                <div class="absolute inset-0 flex flex-col items-center justify-between py-1">
                    <span class="text-[9px] font-black text-white drop-shadow-[0_0_4px_#000000]">▲</span>
                    <span class="text-[9px] font-black text-white drop-shadow-[0_0_4px_#000000]">▼</span>
                </div>
            </div>

            <!-- 3. Big Cosmic Bomb (Black Hole from T, L, or + shape) - Explodes 3x3 -->
            <div
                v-else-if="tile.power === 'black_hole'"
                class="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
                <div class="relative w-8 h-8 rounded-full bg-slate-950/90 border-2 border-purple-400 shadow-[0_0_18px_#a855f7] flex items-center justify-center animate-pulse">
                    <span class="text-sm">💣</span>
                    <div class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b] animate-ping"></div>
                </div>
            </div>

            <!-- 4. Color Bomb (Supernova from 5 in a straight line) - Clears all of chosen type -->
            <div
                v-else-if="tile.power === 'supernova'"
                class="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
                <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-300 via-rose-500 via-purple-500 to-cyan-400 border-2 border-white shadow-[0_0_22px_#ffffff] flex items-center justify-center animate-spin" style="animation-duration: 6s;">
                    <div class="w-4 h-4 rounded-full bg-white/90 shadow-[0_0_10px_#ffffff] flex items-center justify-center text-[10px]">
                        ★
                    </div>
                </div>
            </div>
        </div>

        <!-- Pulsing Selection Reticle -->
        <div
            v-if="isSelected"
            class="absolute -inset-0.5 rounded-2xl border-2 border-cyan-400 shadow-[0_0_16px_#22d3ee] pointer-events-none animate-pulse z-30"
        >
            <div class="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-white"></div>
            <div class="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-white"></div>
            <div class="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-white"></div>
            <div class="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-white"></div>
        </div>
    </div>
</template>

<script setup>
// YB - 16-09-2026 Cosmic Tile presentation component for Planet Burst
import { computed } from 'vue';

const props = defineProps({
    tile: {
        type: Object,
        default: null,
    },
    isSelected: {
        type: Boolean,
        default: false,
    },
});

const tileThemeClasses = computed(() => {
    switch (props.tile?.type) {
        case 'planet_amber':
            return 'bg-amber-950/40 border border-amber-500/30 hover:border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.2)]';
        case 'planet_cyan':
            return 'bg-cyan-950/40 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_12px_rgba(6,182,212,0.2)]';
        case 'planet_purple':
            return 'bg-purple-950/40 border border-purple-500/30 hover:border-purple-400/60 shadow-[0_0_12px_rgba(168,85,247,0.2)]';
        case 'planet_ruby':
            return 'bg-rose-950/40 border border-rose-500/30 hover:border-rose-400/60 shadow-[0_0_12px_rgba(244,63,94,0.2)]';
        case 'planet_ice':
            return 'bg-sky-950/40 border border-sky-400/30 hover:border-sky-300/60 shadow-[0_0_12px_rgba(56,189,248,0.2)]';
        case 'planet_solar':
            return 'bg-orange-950/40 border border-yellow-500/30 hover:border-yellow-400/60 shadow-[0_0_12px_rgba(234,88,12,0.2)]';
        default:
            return 'bg-slate-900/40 border border-slate-700/50';
    }
});
</script>

<style scoped>
.cosmic-tile-container {
    user-select: none;
    touch-action: none;
}

.is-selected .cosmic-tile-body {
    transform: scale(1.08);
}

.is-matched .cosmic-tile-body {
    animation: matchPop 0.28s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.is-new .cosmic-tile-body {
    animation: dropIn 0.24s ease-out forwards;
}

@keyframes matchPop {
    0% {
        transform: scale(1);
        filter: brightness(1);
    }
    40% {
        transform: scale(1.22);
        filter: brightness(2) drop-shadow(0 0 12px #ffffff);
    }
    100% {
        transform: scale(0);
        opacity: 0;
    }
}

@keyframes dropIn {
    0% {
        transform: translateY(-20px) scale(0.6);
        opacity: 0.2;
    }
    100% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
}
</style>
