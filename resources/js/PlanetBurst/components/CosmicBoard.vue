<template>
    <div
        class="cosmic-board-wrapper relative w-full max-w-[480px] aspect-square mx-auto p-2 select-none touch-none transition-transform"
        :class="shakeClass"
    >
        <!-- Outer Glowing Ambient Aura -->
        <div class="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-tr from-cyan-500/20 via-purple-600/20 to-amber-500/20 blur-xl opacity-75 pointer-events-none"></div>

        <!-- High-Tech Sci-Fi Frame Container -->
        <div
            ref="boardContainer"
            class="relative w-full h-full rounded-3xl bg-slate-950/90 border-2 border-slate-700/80 shadow-[0_0_40px_rgba(15,23,42,0.95),inset_0_0_25px_rgba(30,41,59,0.7)] p-2 backdrop-blur-xl overflow-hidden grid"
            :style="{
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
            }"
            @pointerdown="handlePointerDown"
            @pointermove="handlePointerMove"
            @pointerup="handlePointerUp"
            @pointercancel="handlePointerUp"
        >
            <!-- Corner Sci-Fi Tech Brackets -->
            <div class="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-cyan-400/80 rounded-tl pointer-events-none z-30"></div>
            <div class="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-cyan-400/80 rounded-tr pointer-events-none z-30"></div>
            <div class="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-cyan-400/80 rounded-bl pointer-events-none z-30"></div>
            <div class="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-cyan-400/80 rounded-br pointer-events-none z-30"></div>

            <!-- Background Grid Cell Wells -->
            <template v-for="r in rows" :key="'r-'+r">
                <div
                    v-for="c in cols"
                    :key="'bg-'+r+'-'+c"
                    class="rounded-2xl bg-slate-900/40 border border-slate-800/50 m-0.5 pointer-events-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
                    :style="{
                        gridRow: r,
                        gridColumn: c,
                    }"
                ></div>
            </template>

            <!-- Rendered Dynamic Cosmic Tiles -->
            <template v-for="(row, r) in grid" :key="'row-'+r">
                <div
                    v-for="(tile, c) in row"
                    :key="tile ? tile.id : 'empty-'+r+'-'+c"
                    class="relative w-full h-full flex items-center justify-center cursor-pointer"
                    :style="getTileWrapperStyle(r, c)"
                    @click="onTileClick(r, c)"
                >
                    <CosmicTile
                        v-if="tile"
                        :tile="tile"
                        :is-selected="isSelected(r, c)"
                    />
                </div>
            </template>

            <!-- Power Effect Overlay Layer -->
            <div
                v-for="fx in powerEffects"
                :key="fx.id"
                class="absolute inset-0 pointer-events-none z-40 overflow-hidden"
            >
                <!-- 1. Horizontal Laser Beam (Comet H) -->
                <div
                    v-if="fx.type === 'laser_h' || fx.type === 'laser_cross'"
                    class="laser-beam-horizontal absolute left-0 right-0 -translate-y-1/2 flex items-center justify-center"
                    :style="{ top: `${((fx.row + 0.5) / rows) * 100}%` }"
                >
                    <div class="w-full h-7 bg-cyan-300 shadow-[0_0_35px_#22d3ee,0_0_15px_#ffffff] rounded-full animate-laser-pulse opacity-95"></div>
                    <div class="absolute inset-x-0 h-1.5 bg-white shadow-[0_0_10px_#ffffff]"></div>
                    <div class="absolute w-12 h-12 rounded-full bg-white blur-xs animate-ping"></div>
                </div>

                <!-- 2. Vertical Laser Beam (Comet V) -->
                <div
                    v-if="fx.type === 'laser_v' || fx.type === 'laser_cross'"
                    class="laser-beam-vertical absolute top-0 bottom-0 -translate-x-1/2 flex items-center justify-center"
                    :style="{ left: `${((fx.col + 0.5) / cols) * 100}%` }"
                >
                    <div class="h-full w-7 bg-cyan-300 shadow-[0_0_35px_#22d3ee,0_0_15px_#ffffff] rounded-full animate-laser-pulse opacity-95"></div>
                    <div class="absolute inset-y-0 w-1.5 bg-white shadow-[0_0_10px_#ffffff]"></div>
                    <div class="absolute w-12 h-12 rounded-full bg-white blur-xs animate-ping"></div>
                </div>

                <!-- 3. Cosmic Bomb Shockwave (Black Hole / Vortex) -->
                <div
                    v-if="fx.type === 'black_hole' || fx.type === 'vortex_storm'"
                    class="bomb-shockwave-container absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    :style="{
                        top: `${((fx.row + 0.5) / rows) * 100}%`,
                        left: `${((fx.col + 0.5) / cols) * 100}%`
                    }"
                >
                    <!-- Expanding Plasma Ring -->
                    <div
                        class="rounded-full border-4 border-purple-400 bg-purple-600/30 backdrop-blur-xs shadow-[0_0_50px_#c084fc,inset_0_0_30px_#a855f7] animate-shockwave-expand"
                        :class="fx.radius === 2 ? 'w-80 h-80' : 'w-48 h-48'"
                    ></div>
                    <!-- Core Black Hole Event Horizon -->
                    <div class="absolute w-20 h-20 rounded-full bg-black border-2 border-purple-300 shadow-[0_0_40px_#7e22ce] animate-spin"></div>
                    <div class="absolute w-8 h-8 rounded-full bg-white shadow-[0_0_20px_#ffffff] animate-ping"></div>
                </div>

                <!-- 4. Supernova Color Bomb Electrical Arcs & Burst -->
                <div
                    v-if="fx.type === 'supernova'"
                    class="absolute inset-0"
                >
                    <!-- Center Supernova Star Burst -->
                    <div
                        class="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20"
                        :style="{
                            top: `${((fx.row + 0.5) / rows) * 100}%`,
                            left: `${((fx.col + 0.5) / cols) * 100}%`
                        }"
                    >
                        <div class="w-28 h-28 rounded-full bg-radial from-white via-amber-300 to-rose-500 shadow-[0_0_60px_#f59e0b,0_0_30px_#ec4899] animate-pulse"></div>
                        <div class="absolute w-12 h-12 rounded-full bg-white shadow-[0_0_25px_#ffffff] animate-ping"></div>
                    </div>

                    <!-- SVG Lightning Bolt Arcs from Supernova to All Targets -->
                    <svg v-if="fx.targets && fx.targets.length > 0" class="absolute inset-0 w-full h-full z-10">
                        <defs>
                            <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#ffffff" />
                                <stop offset="50%" stop-color="#38bdf8" />
                                <stop offset="100%" stop-color="#a855f7" />
                            </linearGradient>
                        </defs>
                        <line
                            v-for="(tgt, tIdx) in fx.targets"
                            :key="'arc-'+tIdx"
                            :x1="`${((fx.col + 0.5) / cols) * 100}%`"
                            :y1="`${((fx.row + 0.5) / rows) * 100}%`"
                            :x2="`${((tgt.col + 0.5) / cols) * 100}%`"
                            :y2="`${((tgt.row + 0.5) / rows) * 100}%`"
                            stroke="url(#lightningGrad)"
                            stroke-width="3.5"
                            stroke-linecap="round"
                            class="animate-lightning-arc"
                        />
                    </svg>

                    <!-- Target Detonation Glow Points -->
                    <div
                        v-for="(tgt, tIdx) in (fx.targets || [])"
                        :key="'tgt-glow-'+tIdx"
                        class="absolute -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full border-2 border-white shadow-[0_0_25px_#38bdf8] bg-cyan-400/40 animate-ping z-30"
                        :style="{
                            top: `${((tgt.row + 0.5) / rows) * 100}%`,
                            left: `${((tgt.col + 0.5) / cols) * 100}%`
                        }"
                    ></div>
                </div>

                <!-- 5. Universal Burst (Color Bomb + Color Bomb full screen flash) -->
                <div
                    v-if="fx.type === 'universal_burst'"
                    class="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center animate-universal-flash z-50"
                >
                    <div class="w-96 h-96 rounded-full border-8 border-cyan-300 shadow-[0_0_120px_#ffffff] animate-ping"></div>
                </div>
            </div>

            <!-- Floating Score Popups -->
            <div
                v-for="popup in popups"
                :key="popup.id"
                class="absolute pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 font-black font-mono text-base sm:text-lg text-yellow-300 drop-shadow-[0_0_12px_rgba(234,179,8,1)] animate-score-float"
                :style="{
                    top: `${((popup.row + 0.5) / rows) * 100}%`,
                    left: `${((popup.col + 0.5) / cols) * 100}%`
                }"
            >
                +{{ popup.points }}
                <span v-if="popup.label" class="block text-[11px] text-cyan-200 font-sans tracking-widest uppercase font-extrabold drop-shadow-[0_0_8px_#22d3ee]">
                    {{ popup.label }}
                </span>
            </div>

            <!-- Reshuffling Cosmic Deadlock Banner -->
            <div
                v-if="isReshuffling"
                class="absolute inset-0 bg-black/85 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-3 p-4 animate-fade-in"
            >
                <div class="w-14 h-14 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin shadow-[0_0_25px_#22d3ee]"></div>
                <div class="text-cyan-200 font-black text-xl uppercase tracking-wider drop-shadow-[0_0_15px_#22d3ee]">
                    Cosmic Reshuffle!
                </div>
                <div class="text-slate-300 text-xs font-semibold">Realignment of celestial orbits...</div>
            </div>

            <!-- Cosmic Burst / Sugar Crush Finale Banner -->
            <div
                v-if="isCelebrating"
                class="absolute top-4 inset-x-4 bg-gradient-to-r from-amber-500/90 via-purple-600/90 to-cyan-500/90 border border-white/60 rounded-2xl p-3 shadow-[0_0_40px_rgba(234,179,8,0.8)] backdrop-blur-md z-50 flex items-center justify-center gap-2 animate-bounce pointer-events-none"
            >
                <span class="text-2xl">⚡</span>
                <div class="text-center">
                    <div class="text-white font-black text-sm uppercase tracking-widest drop-shadow-[0_0_10px_#ffffff]">
                        COSMIC BURST!
                    </div>
                    <div class="text-amber-200 text-[10px] font-bold">
                        Cascading remaining moves into bonus burst!
                    </div>
                </div>
                <span class="text-2xl">🌟</span>
            </div>
        </div>
    </div>
</template>

<script setup>
// YB - 16-09-2026 CosmicBoard component coordinating tactile animations, gestures, and cinematic power overlays
import { ref, computed } from 'vue';
import CosmicTile from './CosmicTile.vue';

const props = defineProps({
    grid: {
        type: Array,
        required: true,
    },
    rows: {
        type: Number,
        default: 8,
    },
    cols: {
        type: Number,
        default: 8,
    },
    selectedTile: {
        type: Object,
        default: null,
    },
    swappingState: {
        type: Object,
        default: null,
    },
    isReshuffling: {
        type: Boolean,
        default: false,
    },
    isCelebrating: {
        type: Boolean,
        default: false,
    },
    powerEffects: {
        type: Array,
        default: () => [],
    },
    popups: {
        type: Array,
        default: () => [],
    },
    screenShake: {
        type: String,
        default: null,
    },
});

const emit = defineEmits(['tile-click', 'swipe']);

const boardContainer = ref(null);
let pointerStartX = 0;
let pointerStartY = 0;
let startCell = null;
let isDragging = false;

// YB - 16-09-2026 Map screen shake type to CSS class
const shakeClass = computed(() => {
    if (props.screenShake === 'light') return 'shake-light';
    if (props.screenShake === 'medium') return 'shake-medium';
    if (props.screenShake === 'heavy') return 'shake-heavy';
    return '';
});

// YB - 16-09-2026 Compute smooth physical sliding transition style during swaps with tactile easing
function getTileWrapperStyle(r, c) {
    const base = {
        gridRow: r + 1,
        gridColumn: c + 1,
    };

    const swap = props.swappingState;
    if (swap) {
        if (swap.r1 === r && swap.c1 === c) {
            return {
                ...base,
                transform: `translate(${swap.dx * 100}%, ${swap.dy * 100}%)`,
                transition: 'transform 0.30s cubic-bezier(0.34, 1.4, 0.64, 1)',
                zIndex: 35,
            };
        } else if (swap.r2 === r && swap.c2 === c) {
            return {
                ...base,
                transform: `translate(${-swap.dx * 100}%, ${-swap.dy * 100}%)`,
                transition: 'transform 0.30s cubic-bezier(0.34, 1.4, 0.64, 1)',
                zIndex: 35,
            };
        }
    }

    return base;
}

// YB - 16-09-2026 Check whether a grid cell is currently selected
function isSelected(r, c) {
    return props.selectedTile?.row === r && props.selectedTile?.col === c;
}

// YB - 16-09-2026 Emit tile click event
function onTileClick(r, c) {
    emit('tile-click', r, c);
}

// YB - 16-09-2026 Convert pointer event coordinates to row and column
function getCellFromPointer(e) {
    if (!boardContainer.value) return null;
    const rect = boardContainer.value.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return null;

    const col = Math.floor((x / rect.width) * props.cols);
    const row = Math.floor((y / rect.height) * props.rows);

    return { row, col };
}

// YB - 16-09-2026 Pointer down handler for mouse/touch start
function handlePointerDown(e) {
    const cell = getCellFromPointer(e);
    if (!cell) return;

    pointerStartX = e.clientX;
    pointerStartY = e.clientY;
    startCell = cell;
    isDragging = true;
}

// YB - 16-09-2026 Pointer move handler detecting swipe threshold
function handlePointerMove(e) {
    if (!isDragging || !startCell) return;

    const dx = e.clientX - pointerStartX;
    const dy = e.clientY - pointerStartY;
    const SWIPE_THRESHOLD = 24; // px threshold for swipe

    if (Math.abs(dx) > SWIPE_THRESHOLD || Math.abs(dy) > SWIPE_THRESHOLD) {
        let direction = null;

        if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? 'right' : 'left';
        } else {
            direction = dy > 0 ? 'down' : 'up';
        }

        if (direction) {
            emit('swipe', startCell.row, startCell.col, direction);
            isDragging = false;
            startCell = null;
        }
    }
}

// YB - 16-09-2026 Pointer up handler reset
function handlePointerUp() {
    isDragging = false;
    startCell = null;
}
</script>

<style scoped>
/* Screen Shake Vibrations */
.shake-light {
    animation: shakeLight 0.35s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
.shake-medium {
    animation: shakeMedium 0.45s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
.shake-heavy {
    animation: shakeHeavy 0.55s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shakeLight {
    10%, 90% { transform: translate3d(-2px, 1px, 0); }
    20%, 80% { transform: translate3d(2px, -1px, 0); }
    30%, 50%, 70% { transform: translate3d(-3px, 2px, 0); }
    40%, 60% { transform: translate3d(3px, -2px, 0); }
}

@keyframes shakeMedium {
    10%, 90% { transform: translate3d(-4px, 3px, 0); }
    20%, 80% { transform: translate3d(4px, -3px, 0); }
    30%, 50%, 70% { transform: translate3d(-6px, 4px, 0); }
    40%, 60% { transform: translate3d(6px, -4px, 0); }
}

@keyframes shakeHeavy {
    10%, 90% { transform: translate3d(-8px, 6px, 0) scale(1.02); }
    20%, 80% { transform: translate3d(8px, -6px, 0) scale(0.98); }
    30%, 50%, 70% { transform: translate3d(-10px, 8px, 0) scale(1.03); }
    40%, 60% { transform: translate3d(10px, -8px, 0) scale(0.97); }
}

/* Power FX Animations */
@keyframes laserPulse {
    0% { transform: scaleY(0.4); opacity: 0.6; }
    50% { transform: scaleY(1.3); opacity: 1; filter: brightness(2); }
    100% { transform: scaleY(0.2); opacity: 0; }
}

.animate-laser-pulse {
    animation: laserPulse 0.55s ease-out forwards;
}

@keyframes shockwaveExpand {
    0% { transform: scale(0.1); opacity: 1; }
    50% { opacity: 0.9; }
    100% { transform: scale(1.5); opacity: 0; }
}

.animate-shockwave-expand {
    animation: shockwaveExpand 0.65s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
}

@keyframes lightningArc {
    0% { stroke-dasharray: 4, 4; opacity: 1; filter: drop-shadow(0 0 8px #38bdf8); }
    50% { stroke-dasharray: 12, 6; opacity: 1; filter: drop-shadow(0 0 16px #ffffff); }
    100% { stroke-dasharray: 20, 10; opacity: 0; }
}

.animate-lightning-arc {
    animation: lightningArc 0.65s ease-out forwards;
}

@keyframes universalFlash {
    0% { opacity: 0; }
    30% { opacity: 0.95; }
    100% { opacity: 0; }
}

.animate-universal-flash {
    animation: universalFlash 0.95s ease-out forwards;
}

@keyframes scoreFloat {
    0% { transform: translate(-50%, -50%) scale(0.7); opacity: 0; }
    25% { transform: translate(-50%, -85%) scale(1.25); opacity: 1; }
    75% { transform: translate(-50%, -120%) scale(1.05); opacity: 1; }
    100% { transform: translate(-50%, -145%) scale(0.9); opacity: 0; }
}

.animate-score-float {
    animation: scoreFloat 1.1s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
}
</style>
