<template>
    <header class="w-full flex items-center justify-between px-3 sm:px-6 py-2.5 bg-slate-950/80 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-40 select-none">
        <!-- Brand & Mission Info -->
        <div class="flex items-center gap-2.5">
            <button
                v-if="showBackButton"
                type="button"
                @click="$emit('back')"
                class="p-2 rounded-xl bg-slate-900 border border-slate-700/60 hover:border-slate-500 text-slate-300 hover:text-white transition-all cursor-pointer"
                title="Galaxy Map"
            >
                ←
            </button>

            <div class="flex flex-col">
                <div class="flex items-center gap-1.5">
                    <span class="text-base sm:text-lg">🪐</span>
                    <span class="font-black text-sm sm:text-base tracking-wider bg-gradient-to-r from-cyan-400 via-amber-300 to-rose-400 bg-clip-text text-transparent uppercase">
                        Planet Burst
                    </span>
                </div>
                <span v-if="subTitle" class="text-[10px] font-bold text-slate-400 tracking-wide">
                    {{ subTitle }}
                </span>
            </div>
        </div>

        <!-- Controls & Audio -->
        <div class="flex items-center gap-2">
            <!-- Sound Mute Toggle -->
            <button
                type="button"
                @click="$emit('toggle-audio')"
                class="p-2 rounded-xl bg-slate-900 border border-slate-700/60 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 transition-all cursor-pointer flex items-center justify-center text-sm"
                :title="isMuted ? 'Unmute Sound' : 'Mute Sound'"
            >
                <span v-if="isMuted">🔇</span>
                <span v-else>🔊</span>
            </button>

            <!-- Leaderboard Button -->
            <button
                type="button"
                @click="$emit('open-leaderboard')"
                class="p-2 rounded-xl bg-slate-900 border border-slate-700/60 hover:border-amber-500 text-slate-300 hover:text-amber-300 transition-all cursor-pointer text-sm"
                title="Leaderboards"
            >
                🏆
            </button>

            <!-- Daily Mission Button -->
            <button
                type="button"
                @click="$emit('open-daily')"
                class="p-2 rounded-xl bg-slate-900 border border-slate-700/60 hover:border-purple-500 text-slate-300 hover:text-purple-300 transition-all cursor-pointer text-sm"
                title="Daily Cosmic Challenge"
            >
                🌟
            </button>

            <!-- Settings / Help Button -->
            <button
                type="button"
                @click="$emit('open-settings')"
                class="p-2 rounded-xl bg-slate-900 border border-slate-700/60 hover:border-slate-500 text-slate-300 hover:text-white transition-all cursor-pointer text-sm"
                title="Mission Settings & Rules"
            >
                ⚙️
            </button>
        </div>
    </header>
</template>

<script setup>
// YB - 16-09-2026 CosmicHeader component managing quick actions and navigation
defineProps({
    subTitle: {
        type: String,
        default: '',
    },
    showBackButton: {
        type: Boolean,
        default: false,
    },
    isMuted: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['back', 'toggle-audio', 'open-leaderboard', 'open-daily', 'open-settings']);
</script>
