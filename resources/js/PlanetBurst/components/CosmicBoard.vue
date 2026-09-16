<template>
    <div class="relative w-full max-w-[460px] aspect-square mx-auto p-2 select-none touch-none">
        <!-- Cosmic Grid Background Frame -->
        <div
            ref="boardContainer"
            class="relative w-full h-full rounded-3xl bg-slate-950/80 border border-slate-700/60 shadow-[0_0_35px_rgba(15,23,42,0.9),inset_0_0_20px_rgba(30,41,59,0.5)] p-2 backdrop-blur-md overflow-hidden grid"
            :style="{
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
            }"
            @pointerdown="handlePointerDown"
            @pointermove="handlePointerMove"
            @pointerup="handlePointerUp"
            @pointercancel="handlePointerUp"
        >
            <!-- Background Grid Cells Subtle Outlines -->
            <template v-for="r in rows" :key="'r-'+r">
                <div
                    v-for="c in cols"
                    :key="'bg-'+r+'-'+c"
                    class="rounded-xl border border-slate-800/30 m-0.5 pointer-events-none"
                ></div>
            </template>

            <!-- Rendered Dynamic Tiles -->
            <template v-for="(row, r) in grid" :key="'row-'+r">
                <div
                    v-for="(tile, c) in row"
                    :key="tile ? tile.id : 'empty-'+r+'-'+c"
                    class="relative w-full h-full flex items-center justify-center"
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
                class="absolute inset-0 pointer-events-none z-30"
            >
                <!-- Horizontal Laser Beam -->
                <div
                    v-if="fx.type === 'laser_h' || fx.type === 'laser_cross'"
                    class="absolute left-0 right-0 h-4 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_25px_#22d3ee] -translate-y-1/2 animate-pulse"
                    :style="{ top: `${((fx.row + 0.5) / rows) * 100}%` }"
                ></div>

                <!-- Vertical Laser Beam -->
                <div
                    v-if="fx.type === 'laser_v' || fx.type === 'laser_cross'"
                    class="absolute top-0 bottom-0 w-4 bg-gradient-to-b from-transparent via-cyan-300 to-transparent shadow-[0_0_25px_#22d3ee] -translate-x-1/2 animate-pulse"
                    :style="{ left: `${((fx.col + 0.5) / cols) * 100}%` }"
                ></div>

                <!-- Black Hole Vortex -->
                <div
                    v-if="fx.type === 'black_hole' || fx.type === 'vortex_storm'"
                    class="absolute w-32 h-32 rounded-full border-4 border-purple-400/90 shadow-[0_0_40px_#a855f7] bg-purple-950/60 -translate-x-1/2 -translate-y-1/2 animate-ping"
                    :style="{
                        top: `${((fx.row + 0.5) / rows) * 100}%`,
                        left: `${((fx.col + 0.5) / cols) * 100}%`
                    }"
                ></div>

                <!-- Supernova Burst -->
                <div
                    v-if="fx.type === 'supernova' || fx.type === 'universal_burst'"
                    class="absolute inset-0 bg-gradient-to-r from-amber-400/30 via-rose-500/40 to-cyan-400/30 backdrop-blur-xs flex items-center justify-center animate-pulse"
                >
                    <div class="w-48 h-48 rounded-full border-4 border-white shadow-[0_0_60px_#ffffff] animate-ping"></div>
                </div>
            </div>

            <!-- Floating Score Popups -->
            <div
                v-for="popup in popups"
                :key="popup.id"
                class="absolute pointer-events-none z-40 -translate-x-1/2 -translate-y-1/2 font-black font-mono text-sm sm:text-base text-yellow-300 drop-shadow-[0_0_8px_rgba(234,179,8,0.9)] animate-bounce"
                :style="{
                    top: `${((popup.row + 0.5) / rows) * 100}%`,
                    left: `${((popup.col + 0.5) / cols) * 100}%`
                }"
            >
                +{{ popup.points }}
                <span v-if="popup.label" class="block text-[10px] text-cyan-200 uppercase tracking-widest font-sans">{{ popup.label }}</span>
            </div>

            <!-- Reshuffling Cosmic Deadlock Banner -->
            <div
                v-if="isReshuffling"
                class="absolute inset-0 bg-black/75 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-3 p-4"
            >
                <div class="w-12 h-12 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin"></div>
                <div class="text-cyan-200 font-black text-lg uppercase tracking-wider drop-shadow-[0_0_10px_#22d3ee]">
                    Cosmic Reshuffle!
                </div>
                <div class="text-slate-400 text-xs font-semibold">Aligning planetary orbits...</div>
            </div>
        </div>
    </div>
</template>

<script setup>
// YB - 16-09-2026 CosmicBoard presentation and touch gesture handling component
import { ref } from 'vue';
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
    powerEffects: {
        type: Array,
        default: () => [],
    },
    popups: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['tile-click', 'swipe']);

const boardContainer = ref(null);
let pointerStartX = 0;
let pointerStartY = 0;
let startCell = null;
let isDragging = false;

// YB - 16-09-2026 Compute smooth physical sliding transition style during swaps
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
                transition: 'transform 0.22s cubic-bezier(0.25, 1, 0.5, 1)',
                zIndex: 35,
            };
        } else if (swap.r2 === r && swap.c2 === c) {
            return {
                ...base,
                transform: `translate(${-swap.dx * 100}%, ${-swap.dy * 100}%)`,
                transition: 'transform 0.22s cubic-bezier(0.25, 1, 0.5, 1)',
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
    const SWIPE_THRESHOLD = 26; // px threshold for swipe

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
