<template>
    <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
    >
        <div class="relative w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 flex flex-col gap-4 text-center max-h-[85vh] overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <span class="text-xl">⚙️</span>
                    <h2 class="text-lg font-black uppercase tracking-wider text-white">
                        Settings & Codex
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

            <div class="flex-1 overflow-y-auto flex flex-col gap-4 pr-1 text-left">
                <!-- Audio Toggle Setting -->
                <div class="flex items-center justify-between p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <div class="flex flex-col">
                        <span class="text-xs font-bold text-white">Sound Effects</span>
                        <span class="text-[10px] text-slate-400">Synthesizer audio & chimes</span>
                    </div>
                    <button
                        type="button"
                        @click="$emit('toggle-audio')"
                        class="px-3 py-1.5 rounded-xl border font-mono text-xs font-black transition-all cursor-pointer"
                        :class="!isMuted ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'"
                    >
                        {{ !isMuted ? 'ENABLED' : 'MUTED' }}
                    </button>
                </div>

                <!-- Cosmic Powers Guide -->
                <div class="flex flex-col gap-2">
                    <span class="text-[11px] font-black uppercase tracking-wider text-cyan-400">Cosmic Powers Codex</span>

                    <div class="flex flex-col gap-2 text-xs">
                        <div class="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-2.5">
                            <span class="text-base">☄️</span>
                            <div>
                                <strong class="text-cyan-300 block">Hyper Comet (4-Match)</strong>
                                <span class="text-slate-400 text-[11px]">Blasts an entire row or column with a beam of celestial energy.</span>
                            </div>
                        </div>

                        <div class="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-2.5">
                            <span class="text-base">🕳️</span>
                            <div>
                                <strong class="text-purple-300 block">Black Hole (L / T Match)</strong>
                                <span class="text-slate-400 text-[11px]">Collapses a 3x3 surrounding radius, drawing adjacent matter inward.</span>
                            </div>
                        </div>

                        <div class="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-2.5">
                            <span class="text-base">🌟</span>
                            <div>
                                <strong class="text-amber-300 block">Supernova Core (5-Match)</strong>
                                <span class="text-slate-400 text-[11px]">Swap with any planet to trigger a burst clearing all tiles of that type!</span>
                            </div>
                        </div>

                        <div class="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-start gap-2.5">
                            <span class="text-base">🧊</span>
                            <div>
                                <strong class="text-sky-300 block">Cosmic Ice Obstacle</strong>
                                <span class="text-slate-400 text-[11px]">Trapped frozen space cells. Shatter ice by matching adjacent tiles.</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
// YB - 16-09-2026 SettingsModal component providing audio configuration and cosmic powers codex
defineProps({
    isOpen: {
        type: Boolean,
        default: false,
    },
    isMuted: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['close', 'toggle-audio']);
</script>
