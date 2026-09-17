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
                class="flex flex-col rounded-3xl border overflow-hidden transition-all duration-300 backdrop-blur-md relative"
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

                <!-- Mission Nodes with Constellation Trail Connections -->
                <div class="p-5 grid grid-cols-3 sm:grid-cols-5 gap-3 relative z-10">
                    <button
                        v-for="level in world.levels"
                        :key="level.id"
                        type="button"
                        @click="level.is_unlocked && openBriefing(level)"
                        :disabled="!level.is_unlocked"
                        class="relative flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer group"
                        :class="[
                            level.is_unlocked
                                ? 'bg-slate-950/80 border-slate-700/80 hover:border-cyan-400 hover:scale-105 active:scale-95 shadow-md'
                                : 'bg-slate-950/30 border-slate-800/30 cursor-not-allowed opacity-50'
                        ]"
                    >
                        <!-- Active Glowing Pulse for Current Highest Level -->
                        <div
                            v-if="level.is_unlocked && (!level.stars || level.stars === 0)"
                            class="absolute -inset-0.5 rounded-2xl border-2 border-cyan-400/80 animate-pulse pointer-events-none shadow-[0_0_12px_#22d3ee]"
                        ></div>

                        <!-- Mission Badge Number -->
                        <span class="font-mono font-black text-lg text-white group-hover:text-cyan-300 transition-colors">
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

        <!-- Pre-Mission Briefing Modal -->
        <MissionBriefingModal
            :is-open="!!selectedBriefingLevel"
            :level="selectedBriefingLevel"
            @close="selectedBriefingLevel = null"
            @launch="launchFromBriefing"
        />
    </div>
</template>

<script setup>
// YB - 17-09-2026 GalaxyMap presentation component with world constellation nodes and Pre-Mission Briefing modal
import { ref, computed } from 'vue';
import MissionBriefingModal from './MissionBriefingModal.vue';

const props = defineProps({
    worlds: {
        type: Array,
        required: true,
    },
});

const emit = defineEmits(['select-level']);

const selectedBriefingLevel = ref(null);

function openBriefing(level) {
    selectedBriefingLevel.value = level;
}

function launchFromBriefing(level) {
    selectedBriefingLevel.value = null;
    emit('select-level', level);
}

const totalStars = computed(() => {
    let count = 0;
    for (const w of props.worlds) {
        for (const lvl of (w.levels || [])) {
            count += lvl.stars || 0;
        }
    }
    return count;
});

const maxPossibleStars = computed(() => {
    let totalLevels = 0;
    for (const w of props.worlds) {
        totalLevels += (w.levels || []).length;
    }
    return totalLevels * 3;
});

function getWorldBannerGradient(worldId) {
    const gradients = [
        'from-blue-900/80 via-cyan-900/60 to-slate-900/80 border-b border-cyan-500/30',
        'from-slate-800/80 via-indigo-950/60 to-slate-900/80 border-b border-indigo-500/30',
        'from-rose-950/80 via-red-900/60 to-slate-900/80 border-b border-rose-500/30',
        'from-amber-950/80 via-orange-900/60 to-slate-900/80 border-b border-amber-500/30',
        'from-yellow-950/80 via-amber-900/60 to-slate-900/80 border-b border-yellow-500/30',
        'from-sky-950/80 via-blue-900/60 to-slate-900/80 border-b border-sky-500/30',
        'from-orange-950/80 via-red-950/60 to-slate-900/80 border-b border-orange-500/30',
        'from-purple-950/80 via-fuchsia-900/60 to-slate-900/80 border-b border-purple-500/30',
        'from-stone-900/80 via-slate-900/60 to-slate-950/80 border-b border-stone-500/30',
        'from-purple-950/90 via-slate-950 to-black border-b border-cyan-400/40',
    ];
    return gradients[(worldId - 1) % gradients.length] || gradients[0];
}
</script>
