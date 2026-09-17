<template>
    <div
        v-if="isOpen && level"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
    >
        <div class="relative w-full max-w-sm rounded-3xl bg-slate-950/95 border-2 border-cyan-500/60 p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col items-center gap-5">
            <!-- Close Button -->
            <button
                type="button"
                @click="$emit('close')"
                class="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
            >
                ✕
            </button>

            <!-- Mission Region & Title Header -->
            <div class="flex flex-col items-center text-center">
                <span class="text-[10px] uppercase tracking-widest font-black text-cyan-400">
                    MISSION #{{ level.level_number }}
                </span>
                <h2 class="text-2xl font-black text-white tracking-wide mt-0.5">
                    {{ level.title || 'Cosmic Sector' }}
                </h2>
            </div>

            <!-- 3 Star Rating Record -->
            <div class="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-2 shadow-inner">
                <div class="flex items-center gap-1 text-xl">
                    <span
                        v-for="s in 3"
                        :key="s"
                        :class="s <= (level.stars || 0)
                            ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,1)]'
                            : 'text-slate-700 opacity-40'"
                    >
                        ★
                    </span>
                </div>
                <div v-if="level.high_score" class="text-xs font-mono font-bold text-slate-300 border-l border-slate-700 pl-2">
                    Best: {{ level.high_score.toLocaleString() }}
                </div>
            </div>

            <!-- Mission Objectives Target List -->
            <div class="w-full flex flex-col gap-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5">
                <span class="text-[10px] font-black uppercase tracking-wider text-slate-400">Mission Objectives</span>
                <div class="flex flex-col gap-2">
                    <div
                        v-for="(obj, idx) in (level.objectives || [])"
                        :key="idx"
                        class="flex items-center justify-between bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs"
                    >
                        <span class="font-bold text-slate-200 flex items-center gap-2">
                            <span v-if="obj.type === 'score'">🎯 Target Score</span>
                            <span v-else-if="obj.type === 'clear_ice'">❄️ Clear Cosmic Ice</span>
                            <span v-else>🪐 Collect Celestial Tiles</span>
                        </span>
                        <span class="font-mono font-black text-cyan-300">
                            {{ obj.target.toLocaleString() }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Move Limit Banner -->
            <div class="w-full flex items-center justify-between px-3 py-2 bg-slate-900/80 border border-slate-800 rounded-xl text-xs font-bold text-slate-400">
                <span>Move Limit</span>
                <span class="font-mono font-black text-white text-sm">
                    {{ level.move_limit || 25 }} Moves
                </span>
            </div>

            <!-- Launch Mission Action Button -->
            <button
                type="button"
                @click="$emit('launch', level)"
                class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-black text-sm uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
                <span>🚀 LAUNCH MISSION</span>
            </button>
        </div>
    </div>
</template>

<script setup>
// YB - 17-09-2026 MissionBriefingModal displaying pre-mission targets, move limits, and launch trigger
defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    level: {
        type: Object,
        default: null,
    },
});

defineEmits(['close', 'launch']);
</script>
