<template>
    <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
    <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
        <div
            v-for="(obj, idx) in objectives"
            :key="idx"
            class="relative flex items-center gap-2 bg-slate-900/90 border rounded-2xl px-2.5 py-1.5 backdrop-blur-xl shadow-lg transition-all duration-300"
            :class="obj.isCompleted
                ? 'border-emerald-400/90 bg-emerald-950/50 shadow-[0_0_20px_rgba(52,211,153,0.35)] scale-102'
                : 'border-slate-700/80 hover:border-slate-600'"
        >
            <!-- Miniature 3D-Styled Vector Graphic Pod -->
            <div
                class="w-7 h-7 rounded-xl flex items-center justify-center relative overflow-hidden shadow-inner flex-shrink-0"
                :class="obj.isCompleted ? 'bg-emerald-900/50 border border-emerald-400/60' : 'bg-slate-950/80 border border-slate-800'"
            >
                <!-- 🎯 Score Target Graphic -->
                <svg v-if="obj.type === 'score'" viewBox="0 0 32 32" class="w-5 h-5">
                    <circle cx="16" cy="16" r="14" fill="#1e293b" stroke="#f59e0b" stroke-width="2" />
                    <circle cx="16" cy="16" r="10" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5" />
                    <circle cx="16" cy="16" r="5" fill="#ef4444" />
                    <circle cx="16" cy="16" r="2" fill="#ffffff" />
                </svg>

                <!-- ❄️ Cosmic Ice Obstacle Graphic -->
                <svg v-else-if="obj.type === 'clear_ice'" viewBox="0 0 32 32" class="w-5 h-5">
                    <defs>
                        <radialGradient id="iceIconGrad" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stop-color="#e0f2fe" />
                            <stop offset="60%" stop-color="#38bdf8" />
                            <stop offset="100%" stop-color="#0284c7" />
                        </radialGradient>
                    </defs>
                    <polygon points="16,4 26,9 29,20 23,28 9,28 3,20 6,9" fill="url(#iceIconGrad)" stroke="#bae6fd" stroke-width="1" />
                    <polygon points="16,8 22,16 16,24 10,16" fill="#ffffff" opacity="0.6" />
                </svg>

                <!-- 🪐 3D Ringed Amber Planet -->
                <svg v-else-if="obj.tileType === 'planet_amber'" viewBox="0 0 32 32" class="w-5 h-5">
                    <defs>
                        <radialGradient id="miniAmber" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stop-color="#fef08a" />
                            <stop offset="60%" stop-color="#f59e0b" />
                            <stop offset="100%" stop-color="#78350f" />
                        </radialGradient>
                    </defs>
                    <circle cx="16" cy="16" r="9" fill="url(#miniAmber)" />
                    <ellipse cx="16" cy="15" rx="8" ry="2" fill="#d97706" opacity="0.4" />
                    <ellipse cx="16" cy="16" rx="14" ry="4" fill="none" stroke="#fef08a" stroke-width="1.5" opacity="0.9" transform="rotate(-20 16 16)" />
                </svg>

                <!-- 🌍 3D Terra Cyan Planet -->
                <svg v-else-if="obj.tileType === 'planet_cyan'" viewBox="0 0 32 32" class="w-5 h-5">
                    <defs>
                        <radialGradient id="miniCyan" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stop-color="#67e8f9" />
                            <stop offset="60%" stop-color="#06b6d4" />
                            <stop offset="100%" stop-color="#0e7490" />
                        </radialGradient>
                    </defs>
                    <circle cx="16" cy="16" r="9" fill="url(#miniCyan)" />
                    <path d="M 12 12 Q 15 8 18 11 Q 20 13 19 16 Q 16 17 13 15 Z" fill="#10b981" opacity="0.85" />
                    <circle cx="16" cy="16" r="9" fill="none" stroke="#a5f3fc" stroke-width="1" opacity="0.6" />
                </svg>

                <!-- 🟣 3D Nebula Purple Orb -->
                <svg v-else-if="obj.tileType === 'planet_purple'" viewBox="0 0 32 32" class="w-5 h-5">
                    <defs>
                        <radialGradient id="miniPurple" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stop-color="#f0abfc" />
                            <stop offset="55%" stop-color="#a855f7" />
                            <stop offset="100%" stop-color="#581c87" />
                        </radialGradient>
                    </defs>
                    <circle cx="16" cy="16" r="9" fill="url(#miniPurple)" />
                    <circle cx="16" cy="16" r="6" fill="none" stroke="#e879f9" stroke-width="1" stroke-dasharray="2,2" opacity="0.8" />
                    <circle cx="16" cy="16" r="2.5" fill="#ffffff" opacity="0.9" />
                </svg>

                <!-- 🔴 3D Crimson Star -->
                <svg v-else-if="obj.tileType === 'planet_ruby'" viewBox="0 0 32 32" class="w-5 h-5">
                    <defs>
                        <radialGradient id="miniRuby" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stop-color="#fda4af" />
                            <stop offset="55%" stop-color="#f43f5e" />
                            <stop offset="100%" stop-color="#881337" />
                        </radialGradient>
                    </defs>
                    <circle cx="16" cy="16" r="9" fill="url(#miniRuby)" />
                    <path d="M 16 4 L 17 10 L 23 11 L 18 15 L 20 21 L 16 17 L 12 21 L 14 15 L 9 11 L 15 10 Z" fill="#fb7185" opacity="0.5" />
                    <circle cx="14" cy="14" r="2" fill="#ffffff" opacity="0.6" />
                </svg>

                <!-- ☄️ 3D Frost Comet -->
                <svg v-else-if="obj.tileType === 'planet_ice'" viewBox="0 0 32 32" class="w-5 h-5">
                    <defs>
                        <radialGradient id="miniIce" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stop-color="#e0f2fe" />
                            <stop offset="60%" stop-color="#38bdf8" />
                            <stop offset="100%" stop-color="#0369a1" />
                        </radialGradient>
                    </defs>
                    <polygon points="16,6 23,9 26,16 23,23 16,26 9,23 6,16 9,9" fill="url(#miniIce)" />
                    <polygon points="16,10 20,16 16,22 12,16" fill="#ffffff" opacity="0.6" />
                </svg>

                <!-- ☀️ 3D Solar Core -->
                <svg v-else viewBox="0 0 32 32" class="w-5 h-5">
                    <defs>
                        <radialGradient id="miniSolar" cx="35%" cy="35%" r="65%">
                            <stop offset="0%" stop-color="#ffffff" />
                            <stop offset="40%" stop-color="#fde047" />
                            <stop offset="85%" stop-color="#ea580c" />
                            <stop offset="100%" stop-color="#7c2d12" />
                        </radialGradient>
                    </defs>
                    <circle cx="16" cy="16" r="9" fill="url(#miniSolar)" />
                    <circle cx="16" cy="5" r="1.5" fill="#fde047" />
                    <circle cx="16" cy="27" r="1.5" fill="#fde047" />
                    <circle cx="5" cy="16" r="1.5" fill="#fde047" />
                    <circle cx="27" cy="16" r="1.5" fill="#fde047" />
                </svg>

                <!-- Completed Radiant Aura -->
                <div v-if="obj.isCompleted" class="absolute inset-0 bg-emerald-400/25 animate-pulse"></div>
            </div>

            <!-- Target Values & Progress Bar -->
            <div class="flex flex-col min-w-[42px]">
                <div class="flex items-baseline gap-1 font-mono text-xs font-black">
                    <span :class="obj.isCompleted ? 'text-emerald-300 drop-shadow-[0_0_8px_#34d399]' : 'text-white'">
                        {{ obj.type === 'score' ? Math.min(obj.current, obj.target).toLocaleString() : obj.current }}
                    </span>
                    <span class="text-slate-500 text-[10px]">/</span>
                    <span class="text-slate-400 text-[10px]">
                        {{ obj.type === 'score' ? obj.target.toLocaleString() : obj.target }}
                    </span>
                </div>

                <!-- Mini Progress Fill Track -->
                <div class="w-full h-1 bg-slate-950 rounded-full overflow-hidden mt-0.5">
                    <div
                        class="h-full rounded-full transition-all duration-300"
                        :class="obj.isCompleted ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-cyan-400'"
                        :style="{ width: `${Math.min(100, Math.round((obj.current / obj.target) * 100))}%` }"
                    ></div>
                </div>
            </div>

            <!-- Animated Gold/Emerald Checkmark Badge -->
            <div
                v-if="obj.isCompleted"
                class="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-[0_0_12px_#34d399] animate-bounce flex-shrink-0"
            >
                ✓
            </div>
        </div>
    </div>
</template>

<script setup>
// YB - 17-09-2026 MissionObjective component with authentic miniature 3D-styled vector planets and animated completion badges
defineProps({
    objectives: {
        type: Array,
        default: () => [],
    },
});
</script>
