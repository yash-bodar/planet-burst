<template>
    <div class="flex items-center gap-2 flex-wrap justify-center max-w-xs">
        <div
            v-for="(obj, idx) in objectives"
            :key="idx"
            class="flex items-center gap-2 bg-slate-900/80 border rounded-xl px-2.5 py-1 backdrop-blur-xs transition-all duration-200"
            :class="obj.isCompleted ? 'border-emerald-500/80 bg-emerald-950/30' : 'border-slate-700/60'"
        >
            <!-- Target Icon -->
            <div class="flex items-center justify-center w-5 h-5 text-sm">
                <span v-if="obj.type === 'score'">🎯</span>
                <span v-else-if="obj.type === 'clear_ice'">❄️</span>
                <span v-else-if="obj.tileType === 'planet_amber'">🪐</span>
                <span v-else-if="obj.tileType === 'planet_cyan'">🌍</span>
                <span v-else-if="obj.tileType === 'planet_purple'">🟣</span>
                <span v-else-if="obj.tileType === 'planet_ruby'">🔴</span>
                <span v-else-if="obj.tileType === 'planet_ice'">☄️</span>
                <span v-else-if="obj.tileType === 'planet_solar'">☀️</span>
                <span v-else>💎</span>
            </div>

            <!-- Target Progress -->
            <div class="flex items-center gap-1 font-mono text-xs font-bold">
                <span :class="obj.isCompleted ? 'text-emerald-400' : 'text-slate-200'">
                    {{ obj.type === 'score' ? Math.min(obj.current, obj.target).toLocaleString() : obj.current }}
                </span>
                <span class="text-slate-500">/</span>
                <span class="text-slate-400">
                    {{ obj.type === 'score' ? obj.target.toLocaleString() : obj.target }}
                </span>
            </div>

            <!-- Completion Checkmark -->
            <span v-if="obj.isCompleted" class="text-emerald-400 font-bold text-xs">✓</span>
        </div>
    </div>
</template>

<script setup>
// YB - 16-09-2026 MissionObjective component displaying target goals and progress
defineProps({
    objectives: {
        type: Array,
        default: () => [],
    },
});
</script>
