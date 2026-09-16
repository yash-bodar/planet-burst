<template>
    <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
        <div
            v-for="(obj, idx) in objectives"
            :key="idx"
            class="relative flex items-center gap-1.5 bg-slate-900/90 border rounded-2xl px-2.5 py-1.5 backdrop-blur-md shadow-md transition-all duration-300"
            :class="obj.isCompleted
                ? 'border-emerald-400/90 bg-emerald-950/40 shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                : 'border-slate-700/80 hover:border-slate-600'"
        >
            <!-- Target Planet / Obstacle Icon Bubble -->
            <div
                class="w-7 h-7 rounded-xl flex items-center justify-center text-sm shadow-inner relative overflow-hidden"
                :class="obj.isCompleted ? 'bg-emerald-900/60' : 'bg-slate-800/80'"
            >
                <span v-if="obj.type === 'score'">🎯</span>
                <span v-else-if="obj.type === 'clear_ice'">❄️</span>
                <span v-else-if="obj.tileType === 'planet_amber'">🪐</span>
                <span v-else-if="obj.tileType === 'planet_cyan'">🌍</span>
                <span v-else-if="obj.tileType === 'planet_purple'">🟣</span>
                <span v-else-if="obj.tileType === 'planet_ruby'">🔴</span>
                <span v-else-if="obj.tileType === 'planet_ice'">☄️</span>
                <span v-else-if="obj.tileType === 'planet_solar'">☀️</span>
                <span v-else>💎</span>

                <!-- Animated Completed Aura -->
                <div v-if="obj.isCompleted" class="absolute inset-0 bg-emerald-400/20 animate-pulse"></div>
            </div>

            <!-- Target Progress Values -->
            <div class="flex flex-col">
                <div class="flex items-baseline gap-1 font-mono text-xs font-black">
                    <span :class="obj.isCompleted ? 'text-emerald-300 drop-shadow-[0_0_6px_#34d399]' : 'text-white'">
                        {{ obj.type === 'score' ? Math.min(obj.current, obj.target).toLocaleString() : obj.current }}
                    </span>
                    <span class="text-slate-500 text-[10px]">/</span>
                    <span class="text-slate-400 text-[10px]">
                        {{ obj.type === 'score' ? obj.target.toLocaleString() : obj.target }}
                    </span>
                </div>
            </div>

            <!-- Completion Checkmark Badge -->
            <div
                v-if="obj.isCompleted"
                class="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow-[0_0_8px_#34d399]"
            >
                ✓
            </div>
        </div>
    </div>
</template>

<script setup>
// YB - 16-09-2026 MissionObjective component displaying target goals with glowing pods and completion checkmarks
defineProps({
    objectives: {
        type: Array,
        default: () => [],
    },
});
</script>
