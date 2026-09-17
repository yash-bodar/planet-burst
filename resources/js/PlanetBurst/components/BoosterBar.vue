<template>
    <div class="w-full flex flex-col items-center gap-1.5 select-none">
        <!-- Active Booster Hint & Cancel Banner -->
        <div
            v-if="activeBooster"
            class="flex items-center justify-between w-full max-w-sm px-3 py-1 bg-cyan-950/80 border border-cyan-400/80 rounded-xl text-xs backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.4)] animate-pulse"
        >
            <span class="font-bold text-cyan-200 flex items-center gap-1.5">
                <span class="text-sm">{{ activeBoosterIcon }}</span>
                <span>{{ activeBoosterHint }}</span>
            </span>
            <button
                type="button"
                @click="emit('cancel')"
                class="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white font-black text-[11px] cursor-pointer"
            >
                Cancel ✕
            </button>
        </div>

        <!-- Horizontal Booster Dock -->
        <div class="flex items-center justify-center gap-2 sm:gap-3 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-1.5 backdrop-blur-xl shadow-lg">
            <!-- 1. Cosmic Hammer -->
            <button
                type="button"
                @click="onBoosterClick('hammer')"
                :disabled="inventory.hammer <= 0"
                class="relative w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group"
                :class="activeBooster === 'hammer'
                    ? 'bg-cyan-500/30 border-2 border-cyan-400 shadow-[0_0_15px_#22d3ee] scale-110'
                    : 'bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/60 hover:bg-slate-800'"
            >
                <span class="text-lg group-hover:scale-110 transition-transform">🔨</span>
                <span class="text-[9px] font-black uppercase tracking-tighter text-slate-400 leading-none mt-0.5">Hammer</span>
                <!-- Badge Count -->
                <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-md">
                    {{ inventory.hammer }}
                </div>
            </button>

            <!-- 2. UFO Gravity Shuffle -->
            <button
                type="button"
                @click="onBoosterClick('ufo')"
                :disabled="inventory.ufo <= 0"
                class="relative w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group"
                :class="activeBooster === 'ufo'
                    ? 'bg-purple-500/30 border-2 border-purple-400 shadow-[0_0_15px_#a855f7] scale-110'
                    : 'bg-slate-900/90 border border-slate-700/80 hover:border-purple-500/60 hover:bg-slate-800'"
            >
                <span class="text-lg group-hover:scale-110 transition-transform">🛸</span>
                <span class="text-[9px] font-black uppercase tracking-tighter text-slate-400 leading-none mt-0.5">Shuffle</span>
                <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-md">
                    {{ inventory.ufo }}
                </div>
            </button>

            <!-- 3. Ion Ray Gun -->
            <button
                type="button"
                @click="onBoosterClick('ion_ray')"
                :disabled="inventory.ion_ray <= 0"
                class="relative w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group"
                :class="activeBooster === 'ion_ray'
                    ? 'bg-amber-500/30 border-2 border-amber-400 shadow-[0_0_15px_#f59e0b] scale-110'
                    : 'bg-slate-900/90 border border-slate-700/80 hover:border-amber-500/60 hover:bg-slate-800'"
            >
                <span class="text-lg group-hover:scale-110 transition-transform">⚡</span>
                <span class="text-[9px] font-black uppercase tracking-tighter text-slate-400 leading-none mt-0.5">Ion Ray</span>
                <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-md">
                    {{ inventory.ion_ray }}
                </div>
            </button>

            <!-- 4. Free Swap -->
            <button
                type="button"
                @click="onBoosterClick('free_swap')"
                :disabled="inventory.free_swap <= 0"
                class="relative w-12 h-12 rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed group"
                :class="activeBooster === 'free_swap'
                    ? 'bg-emerald-500/30 border-2 border-emerald-400 shadow-[0_0_15px_#10b981] scale-110'
                    : 'bg-slate-900/90 border border-slate-700/80 hover:border-emerald-500/60 hover:bg-slate-800'"
            >
                <span class="text-lg group-hover:scale-110 transition-transform">🔄</span>
                <span class="text-[9px] font-black uppercase tracking-tighter text-slate-400 leading-none mt-0.5">Free Swap</span>
                <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-md">
                    {{ inventory.free_swap }}
                </div>
            </button>
        </div>
    </div>
</template>

<script setup>
// YB - 17-09-2026 BoosterBar component rendering tactile in-game booster arsenal with badge counts
import { computed } from 'vue';

const props = defineProps({
    inventory: {
        type: Object,
        required: true,
    },
    activeBooster: {
        type: String,
        default: null,
    },
});

const emit = defineEmits(['select', 'cancel', 'trigger-instant']);

function onBoosterClick(type) {
    if (type === 'ufo') {
        // UFO Shuffle is instant!
        emit('trigger-instant', 'ufo');
    } else {
        emit('select', type);
    }
}

const activeBoosterIcon = computed(() => {
    switch (props.activeBooster) {
        case 'hammer': return '🔨';
        case 'ufo': return '🛸';
        case 'ion_ray': return '⚡';
        case 'free_swap': return '🔄';
        default: return '✦';
    }
});

const activeBoosterHint = computed(() => {
    switch (props.activeBooster) {
        case 'hammer': return 'Tap any planet or obstacle to smash!';
        case 'ion_ray': return 'Tap any planet to clear its entire row!';
        case 'free_swap': return 'Swap any 2 adjacent planets without using a move!';
        default: return '';
    }
});
</script>
