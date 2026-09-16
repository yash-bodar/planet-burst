<template>
    <div class="w-full max-w-xl mx-auto flex flex-col gap-6 py-4 px-3 select-none">
        <!-- Galaxy Overview Header -->
        <div class="flex items-center justify-between bg-slate-900/80 border border-slate-700/60 rounded-2xl p-4 shadow-xl backdrop-blur-md">
            <div class="flex flex-col">
                <span class="text-xs uppercase font-black tracking-widest text-cyan-400">Cosmic Expedition</span>
                <h1 class="text-xl font-black text-white">Galaxy Navigation</h1>
            </div>

            <!-- Total Stars Collected -->
            <div class="flex items-center gap-2 bg-slate-950/80 border border-amber-500/40 rounded-xl px-3 py-1.5 shadow-inner">
                <span class="text-amber-400 text-lg">★</span>
                <span class="font-mono font-black text-amber-300 text-base">
                    {{ totalStars }}
                </span>
                <span class="text-slate-500 font-mono text-xs">/ {{ maxPossibleStars }}</span>
            </div>
        </div>

        <!-- Worlds List -->
        <div class="flex flex-col gap-6">
            <div
                v-for="world in worlds"
                :key="world.id"
                class="flex flex-col rounded-3xl border overflow-hidden transition-all duration-300 backdrop-blur-md"
                :class="world.is_unlocked ? 'bg-slate-900/70 border-slate-700/80 shadow-lg' : 'bg-slate-950/40 border-slate-800/40 opacity-60'"
            >
                <!-- World Header Banner -->
                <div
                    class="flex items-center justify-between px-5 py-4 bg-gradient-to-r"
                    :class="getWorldBannerGradient(world.id)"
                >
                    <div class="flex items-center gap-3">
                        <span class="text-3xl filter drop-shadow-md">{{ world.icon }}</span>
                        <div class="flex flex-col">
                            <span class="text-[10px] font-black uppercase tracking-wider text-slate-300">
                                Region {{ world.order }}
                            </span>
                            <h2 class="text-lg font-black text-white drop-shadow-sm">
                                {{ world.name }}
                            </h2>
                        </div>
                    </div>

                    <div v-if="!world.is_unlocked" class="flex items-center gap-1 text-xs font-bold text-slate-400">
                        <span>🔒 Locked</span>
                    </div>
                </div>

                <!-- Mission Nodes -->
                <div class="p-5 grid grid-cols-3 gap-3">
                    <button
                        v-for="level in world.levels"
                        :key="level.id"
                        type="button"
                        @click="level.is_unlocked && $emit('select-level', level)"
                        :disabled="!level.is_unlocked"
                        class="flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer"
                        :class="[
                            level.is_unlocked
                                ? 'bg-slate-950/80 border-slate-700/80 hover:border-cyan-400 hover:scale-105 active:scale-95 shadow-md'
                                : 'bg-slate-950/30 border-slate-800/30 cursor-not-allowed opacity-50'
                        ]"
                    >
                        <!-- Mission Badge Number -->
                        <span class="font-mono font-black text-lg text-white">
                            {{ level.level_number }}
                        </span>

                        <!-- Stars -->
                        <div class="flex items-center gap-0.5 mt-1 text-xs">
                            <span
                                v-for="s in 3"
                                :key="s"
                                :class="s <= (level.stars || 0) ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)]' : 'text-slate-700'"
                            >
                                ★
                            </span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// YB - 16-09-2026 GalaxyMap presentation component with worlds and level nodes
import { computed } from 'vue';

const props = defineProps({
    worlds: {
        type: Array,
        required: true,
    },
});

defineEmits(['select-level']);

const totalStars = computed(() => {
    let count = 0;
    for (const w of props.worlds) {
        for (const l of (w.levels || [])) {
            count += l.stars || 0;
        }
    }
    return count;
});

const maxPossibleStars = computed(() => {
    let count = 0;
    for (const w of props.worlds) {
        count += (w.levels || []).length * 3;
    }
    return Math.max(1, count);
});

// YB - 16-09-2026 Return world-specific cosmic background gradient
function getWorldBannerGradient(worldId) {
    switch (worldId) {
        case 1:
            return 'from-emerald-900/60 to-cyan-900/40 border-b border-emerald-500/30';
        case 2:
            return 'from-slate-800/80 to-sky-900/40 border-b border-sky-500/30';
        case 3:
            return 'from-rose-950/80 to-amber-950/40 border-b border-rose-500/30';
        case 4:
            return 'from-amber-950/80 to-orange-950/40 border-b border-amber-500/30';
        case 5:
            return 'from-purple-950/80 to-indigo-950/40 border-b border-purple-500/30';
        case 6:
            return 'from-indigo-950/80 to-violet-950/40 border-b border-violet-500/30';
        default:
            return 'from-slate-900 to-slate-950 border-b border-slate-700';
    }
}
</script>
