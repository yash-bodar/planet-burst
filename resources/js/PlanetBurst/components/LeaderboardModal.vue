<template>
    <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
        <div class="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700/80 shadow-[0_0_50px_rgba(245,158,11,0.2)] p-6 flex flex-col gap-4 text-center max-h-[85vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="text-2xl">🏆</span>
                    <h2 class="text-lg font-black uppercase tracking-wider text-white">
                        Cosmic Rankings
                    </h2>
                </div>
                <button
                    type="button"
                    @click="$emit('close')"
                    class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer text-sm"
                >
                    ✕
                </button>
            </div>

            <!-- Tab Switcher -->
            <div class="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                    type="button"
                    @click="activeTab = 'global'"
                    class="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    :class="activeTab === 'global' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'text-slate-400 hover:text-white'"
                >
                    Global Explorers
                </button>
                <button
                    type="button"
                    @click="activeTab = 'daily'"
                    class="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    :class="activeTab === 'daily' ? 'bg-purple-500 text-white shadow-md font-black' : 'text-slate-400 hover:text-white'"
                >
                    Today's Challenge
                </button>
            </div>

            <!-- List Area -->
            <div class="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
                <div
                    v-for="(item, idx) in currentList"
                    :key="item.id || idx"
                    class="flex items-center justify-between px-3 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all text-xs"
                >
                    <div class="flex items-center gap-3">
                        <span
                            class="w-6 h-6 rounded-full flex items-center justify-center font-mono font-black text-xs"
                            :class="[
                                idx === 0 ? 'bg-amber-400 text-slate-950 shadow-[0_0_8px_#f59e0b]' :
                                idx === 1 ? 'bg-slate-300 text-slate-950' :
                                idx === 2 ? 'bg-amber-700 text-white' : 'text-slate-500'
                            ]"
                        >
                            {{ idx + 1 }}
                        </span>

                        <span class="font-bold text-slate-200">
                            {{ item.user_name || item.name || 'Cosmic Pilot' }}
                        </span>
                    </div>

                    <div class="flex items-center gap-3">
                        <span v-if="item.stars" class="flex items-center gap-0.5 text-amber-400 font-mono text-[11px]">
                            ★ {{ item.stars }}
                        </span>
                        <span class="font-mono font-black text-white text-sm">
                            {{ (item.score || item.highest_score || 0).toLocaleString() }}
                        </span>
                    </div>
                </div>

                <div v-if="currentList.length === 0" class="py-8 text-slate-500 text-xs font-medium">
                    No records logged for this sector yet.
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// YB - 16-09-2026 LeaderboardModal component showing global and daily high scores
import { ref, computed } from 'vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    globalLeaderboard: {
        type: Array,
        default: () => [],
    },
    dailyLeaderboard: {
        type: Array,
        default: () => [],
    },
});

defineEmits(['close']);

const activeTab = ref('global');

const currentList = computed(() => {
    return activeTab.value === 'global' ? props.globalLeaderboard : props.dailyLeaderboard;
});
</script>
