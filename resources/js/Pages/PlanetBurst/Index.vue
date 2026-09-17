<template>
    <Head title="Planet Burst — Cosmic Match-3 Adventure" />
    <div class="relative min-h-screen bg-slate-950 text-slate-100 font-sans select-none overflow-x-hidden flex flex-col justify-between">
        <!-- Ambient Cosmic Background with Starfield and Nebula Glow -->
        <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div class="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl"></div>
            <div class="absolute top-1/2 -right-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl"></div>
            <!-- Subtle cosmic grid lines -->
            <div class="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        </div>

        <!-- Sticky Header in Game / Map View -->
        <CosmicHeader
            v-if="currentView !== 'home'"
            :sub-title="headerSubtitle"
            :show-back-button="currentView === 'game'"
            :is-muted="audio.isMuted.value"
            @back="exitToGalaxyMap"
            @toggle-audio="audio.toggleMute"
            @open-leaderboard="showLeaderboardModal = true"
            @open-daily="showDailyModal = true"
            @open-settings="showSettingsModal = true"
        />

        <!-- ============================================== -->
        <!-- VIEW 1: HOME SCREEN                            -->
        <!-- ============================================== -->
        <main
            v-if="currentView === 'home'"
            class="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-md mx-auto w-full gap-8"
        >
            <!-- Game Title & Planet Graphic -->
            <div class="flex flex-col items-center text-center gap-3 animate-pop">
                <div class="relative w-32 h-32 flex items-center justify-center">
                    <div class="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse"></div>
                    <!-- Giant Cosmic Planet Logo -->
                    <svg viewBox="0 0 100 100" class="w-28 h-28 drop-shadow-[0_0_25px_#22d3ee]">
                        <defs>
                            <radialGradient id="homePlanetGrad" cx="35%" cy="35%" r="65%">
                                <stop offset="0%" stop-color="#a5f3fc" />
                                <stop offset="45%" stop-color="#06b6d4" />
                                <stop offset="85%" stop-color="#3b82f6" />
                                <stop offset="100%" stop-color="#1e1b4b" />
                            </radialGradient>
                        </defs>
                        <circle cx="50" cy="50" r="32" fill="url(#homePlanetGrad)" />
                        <!-- Continental Swirls -->
                        <path d="M 38 36 Q 44 26 54 32 Q 64 38 60 48 Q 50 52 42 46 Z" fill="#34d399" opacity="0.8" />
                        <!-- Planetary Glowing Ring -->
                        <ellipse cx="50" cy="50" rx="46" ry="14" fill="none" stroke="#fef08a" stroke-width="4.5" opacity="0.9" transform="rotate(-22 50 50)" />
                        <ellipse cx="50" cy="50" rx="42" ry="11" fill="none" stroke="#67e8f9" stroke-width="2" opacity="0.75" transform="rotate(-22 50 50)" />
                    </svg>
                </div>

                <div class="flex flex-col gap-1">
                    <span class="text-xs uppercase font-black tracking-widest text-cyan-400">Deep Space Match-3 Adventure</span>
                    <h1 class="text-4xl sm:text-5xl font-black uppercase tracking-wider bg-gradient-to-r from-amber-300 via-cyan-300 to-rose-400 bg-clip-text text-transparent drop-shadow-md">
                        Planet Burst
                    </h1>
                </div>
            </div>

            <!-- Main Menu Action Buttons -->
            <div class="w-full flex flex-col gap-3 max-w-xs">
                <!-- Play Button (Continues next unlocked mission) -->
                <button
                    type="button"
                    @click="playNextUnlockedMission"
                    class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-base uppercase tracking-wider shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                    <span>▶ PLAY MISSION</span>
                    <span class="font-mono text-sm bg-slate-950/20 px-2 py-0.5 rounded-lg">#{{ nextLevelNumber }}</span>
                </button>

                <!-- Galaxy Map Button -->
                <button
                    type="button"
                    @click="currentView = 'galaxy_map'"
                    class="w-full py-3 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-700/80 hover:border-cyan-500 text-slate-200 hover:text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                    <span>🌌 Galaxy Map</span>
                </button>

                <!-- Daily Cosmic Mission Button -->
                <button
                    type="button"
                    @click="showDailyModal = true"
                    class="w-full py-3 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-purple-500/50 hover:border-purple-400 text-purple-200 hover:text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                    <span>🌟 Daily Challenge</span>
                </button>

                <!-- Leaderboards Button -->
                <button
                    type="button"
                    @click="showLeaderboardModal = true"
                    class="w-full py-3 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-amber-500/50 hover:border-amber-400 text-amber-200 hover:text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                    <span>🏆 Rankings</span>
                </button>

                <!-- Audio Toggle & Codex -->
                <div class="flex items-center justify-between gap-2 pt-2">
                    <button
                        type="button"
                        @click="audio.toggleMute"
                        class="flex-1 py-2 px-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                        <span>{{ audio.isMuted.value ? '🔇 Sound Off' : '🔊 Sound On' }}</span>
                    </button>
                    <button
                        type="button"
                        @click="showSettingsModal = true"
                        class="flex-1 py-2 px-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                        <span>⚙️ Settings</span>
                    </button>
                </div>
            </div>
        </main>

        <!-- ============================================== -->
        <!-- VIEW 2: GALAXY MAP                             -->
        <!-- ============================================== -->
        <main v-else-if="currentView === 'galaxy_map'" class="relative z-10 flex-1">
            <GalaxyMap
                :worlds="worldsData"
                @select-level="startLevel"
            />
        </main>

        <!-- ============================================== -->
        <!-- VIEW 3: ACTIVE GAME MISSION                    -->
        <!-- ============================================== -->
        <main
            v-else-if="currentView === 'game'"
            class="relative z-10 flex-1 flex flex-col items-center justify-between px-2 sm:px-4 py-2 max-w-xl mx-auto w-full gap-2 sm:gap-3"
        >
            <!-- Game Top Cockpit Navigation Bar -->
            <div class="w-full flex items-center justify-between px-1 py-1">
                <button
                    type="button"
                    @click="exitToGalaxyMap"
                    class="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/80 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                    <span>←</span>
                    <span class="uppercase tracking-wider">Map</span>
                </button>

                <!-- Mission Indicator Badge -->
                <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-md">
                    <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    <span class="font-mono text-xs font-black text-cyan-300 uppercase tracking-wider">
                        {{ mission.activeLevel.value?.title || 'Mission' }}
                    </span>
                </div>

                <!-- Quick Action Buttons: Sound & Restart -->
                <div class="flex items-center gap-1.5">
                    <button
                        type="button"
                        @click="audio.toggleMute"
                        class="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-md"
                        :title="audio.isMuted.value ? 'Unmute' : 'Mute'"
                    >
                        <span>{{ audio.isMuted.value ? '🔇' : '🔊' }}</span>
                    </button>
                    <button
                        type="button"
                        @click="restartCurrentLevel"
                        class="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-md"
                        title="Restart Level"
                    >
                        <span>↺</span>
                    </button>
                </div>
            </div>

            <!-- Unified Mission HUD Console -->
            <div class="w-full bg-slate-950/70 border border-slate-800/80 rounded-3xl p-2.5 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.5)] flex items-center justify-between gap-2">
                <!-- 1. Left: Move Counter Reactor -->
                <div class="flex-shrink-0">
                    <MoveCounter :moves-remaining="mission.movesRemaining.value" />
                </div>

                <!-- 2. Center: Mission Objectives Pod -->
                <div class="flex-1 flex items-center justify-center px-1">
                    <MissionObjective :objectives="mission.objectives.value" />
                </div>

                <!-- 3. Right: Score & 3-Star Meter -->
                <div class="flex-shrink-0">
                    <ScoreDisplay
                        :score="score.currentScore.value"
                        :stars-earned="score.starProgress.value"
                        :star-thresholds="mission.activeLevel.value?.star_thresholds"
                    />
                </div>
            </div>

            <!-- Main Cosmic Board Grid Area -->
            <div class="w-full flex-1 flex items-center justify-center my-auto">
                <CosmicBoard
                    :grid="board.grid.value"
                    :rows="mission.activeLevel.value?.rows || 8"
                    :cols="mission.activeLevel.value?.columns || 8"
                    :selected-tile="board.selectedTile.value"
                    :swapping-state="board.swappingState.value"
                    :is-reshuffling="board.isReshuffling.value"
                    :is-celebrating="board.isCelebrating.value"
                    :power-effects="board.activePowerEffects.value"
                    :popups="score.recentScorePopups.value"
                    :screen-shake="board.screenShake.value"
                    @tile-click="board.selectTile"
                    @swipe="board.handleSwipe"
                />
            </div>

            <!-- In-Game Booster Arsenal Dock -->
            <div class="w-full flex items-center justify-center py-0.5">
                <BoosterBar
                    :inventory="boosters.inventory.value"
                    :active-booster="boosters.activeBooster.value"
                    @select="boosters.selectBooster"
                    @cancel="boosters.cancelBooster"
                    @trigger-instant="board.triggerInstantBooster"
                />
            </div>

            <!-- Subtle Bottom Status -->
            <div class="w-full flex items-center justify-between px-3 py-0.5 text-[11px] text-slate-500 font-medium">
                <span class="flex items-center gap-1">
                    <span class="text-cyan-400">✦</span>
                    <span>Match 4 for Striped Comets • 5 for Supernovas • L/T for Bombs</span>
                </span>
                <button
                    type="button"
                    @click="showSettingsModal = true"
                    class="hover:text-slate-300 transition-colors cursor-pointer"
                >
                    Help & Settings ⚙
                </button>
            </div>
        </main>

        <!-- Modals -->
        <MissionCompleteModal
            :is-open="mission.missionStatus.value === 'completed'"
            :stars-earned="score.starProgress.value"
            :score="score.currentScore.value"
            :moves-bonus="mission.movesRemaining.value * 250"
            @next-mission="goToNextMission"
            @replay="restartCurrentLevel"
            @exit-to-map="exitToGalaxyMap"
        />

        <MissionFailedModal
            :is-open="mission.missionStatus.value === 'failed'"
            :score="score.currentScore.value"
            @retry="restartCurrentLevel"
            @exit-to-map="exitToGalaxyMap"
        />

        <DailyMissionModal
            :is-open="showDailyModal"
            :daily-mission="dailyMissionData"
            :daily-score="dailyScoreAchieved"
            @start-daily="startDailyChallenge"
            @close="showDailyModal = false"
        />

        <LeaderboardModal
            :is-open="showLeaderboardModal"
            :global-leaderboard="globalLeaderboardData"
            :daily-leaderboard="dailyLeaderboardData"
            @close="showLeaderboardModal = false"
        />

        <SettingsModal
            :is-open="showSettingsModal"
            :is-muted="audio.isMuted.value"
            @toggle-audio="audio.toggleMute"
            @close="showSettingsModal = false"
        />
    </div>
</template>

<script setup>
// YB - 16-09-2026 Planet Burst Main Game View coordinating composables, modals, and screen navigation
import { ref, computed, onMounted, watch } from 'vue';
import { Head } from '@inertiajs/vue3';
import confetti from 'canvas-confetti';

import CosmicHeader from '../../PlanetBurst/components/CosmicHeader.vue';
import CosmicBoard from '../../PlanetBurst/components/CosmicBoard.vue';
import ScoreDisplay from '../../PlanetBurst/components/ScoreDisplay.vue';
import MoveCounter from '../../PlanetBurst/components/MoveCounter.vue';
import MissionObjective from '../../PlanetBurst/components/MissionObjective.vue';
import GalaxyMap from '../../PlanetBurst/components/GalaxyMap.vue';
import BoosterBar from '../../PlanetBurst/components/BoosterBar.vue';
import MissionCompleteModal from '../../PlanetBurst/components/MissionCompleteModal.vue';
import MissionFailedModal from '../../PlanetBurst/components/MissionFailedModal.vue';
import DailyMissionModal from '../../PlanetBurst/components/DailyMissionModal.vue';
import LeaderboardModal from '../../PlanetBurst/components/LeaderboardModal.vue';
import SettingsModal from '../../PlanetBurst/components/SettingsModal.vue';

import { useAudio } from '../../PlanetBurst/composables/useAudio.js';
import { useScore } from '../../PlanetBurst/composables/useScore.js';
import { useMission } from '../../PlanetBurst/composables/useMission.js';
import { useBoosters } from '../../PlanetBurst/composables/useBoosters.js';
import { useCosmicBoard } from '../../PlanetBurst/composables/useCosmicBoard.js';
import { useGameSession } from '../../PlanetBurst/composables/useGameSession.js';
import { DEFAULT_WORLDS_DATA } from '../../PlanetBurst/engine/DefaultLevels.js';

const props = defineProps({
    initialWorlds: {
        type: Array,
        default: () => [],
    },
    initialLeaderboard: {
        type: Array,
        default: () => [],
    },
    initialDaily: {
        type: Object,
        default: null,
    },
});

// Composables
const audio = useAudio();
const score = useScore();
const mission = useMission();
const boosters = useBoosters();
const board = useCosmicBoard(audio, score, mission, boosters);
const session = useGameSession();

// Navigation & View State
const currentView = ref('home'); // 'home' | 'galaxy_map' | 'game'
const showDailyModal = ref(false);
const showLeaderboardModal = ref(false);
const showSettingsModal = ref(false);

// World and Mission Data
const worldsData = ref(props.initialWorlds.length > 0 ? props.initialWorlds : DEFAULT_WORLDS_DATA);
const globalLeaderboardData = ref(props.initialLeaderboard || []);
const dailyLeaderboardData = ref([]);
const dailyMissionData = ref(props.initialDaily || {
    id: 999,
    title: 'Supernova Storm',
    target_score: 12000,
    move_limit: 22,
    objectives: [{ type: 'score', target: 12000 }],
});
const dailyScoreAchieved = ref(0);

// Synchronize unlocked levels with user progress
onMounted(() => {
    syncLocalProgressWithWorlds();
    fetchBackendData();
});

// YB - 16-09-2026 Sync local storage progression with world definitions
function syncLocalProgressWithWorlds() {
    const progress = session.offlineProgress.value;
    const unlockedLevelId = progress.unlocked_level_id || 1;

    for (const world of worldsData.value) {
        let anyLevelUnlocked = false;
        for (const level of (world.levels || [])) {
            level.is_unlocked = level.level_number <= unlockedLevelId;
            level.stars = progress.completed_levels[level.level_number]?.stars || 0;
            if (level.is_unlocked) anyLevelUnlocked = true;
        }
        world.is_unlocked = anyLevelUnlocked || world.order === 1;
    }
}

// YB - 16-09-2026 Fetch dynamic world and leaderboard records from Laravel API
async function fetchBackendData() {
    try {
        const [worldsRes, leaderRes, dailyRes] = await Promise.all([
            fetch('/api/planet-burst/worlds').catch(() => null),
            fetch('/api/planet-burst/leaderboard').catch(() => null),
            fetch('/api/planet-burst/daily-mission').catch(() => null),
        ]);

        if (worldsRes?.ok) {
            const data = await worldsRes.json();
            if (data.worlds && data.worlds.length > 0) {
                worldsData.value = data.worlds;
                syncLocalProgressWithWorlds();
            }
        }
        if (leaderRes?.ok) {
            const data = await leaderRes.json();
            globalLeaderboardData.value = data.leaderboard || [];
        }
        if (dailyRes?.ok) {
            const data = await dailyRes.json();
            dailyMissionData.value = data.daily_mission || dailyMissionData.value;
            dailyLeaderboardData.value = data.leaderboard || [];
            dailyScoreAchieved.value = data.user_score || 0;
        }
    } catch (err) {
        console.warn('Backend API currently unreachable, running in offline mode', err);
    }
}

// Subtitle for Cosmic Header
const headerSubtitle = computed(() => {
    if (currentView.value === 'galaxy_map') return 'Select Celestial Mission';
    if (currentView.value === 'game') return mission.activeLevel.value?.title || 'Mission';
    return '';
});

// Highest unlocked mission number
const nextLevelNumber = computed(() => {
    return session.offlineProgress.value.unlocked_level_id || 1;
});

// YB - 16-09-2026 Launch next unlocked level directly from home
function playNextUnlockedMission() {
    const targetNum = nextLevelNumber.value;
    let foundLevel = null;

    for (const world of worldsData.value) {
        for (const lvl of (world.levels || [])) {
            if (lvl.level_number === targetNum) {
                foundLevel = lvl;
                break;
            }
        }
        if (foundLevel) break;
    }

    startLevel(foundLevel || worldsData.value[0].levels[0]);
}

// YB - 16-09-2026 Start a mission and initialize board
async function startLevel(levelData) {
    score.resetScore();
    mission.loadMission(levelData);
    board.setupBoard(levelData);
    currentView.value = 'game';

    // Request backend game session
    await session.startSession(levelData.id || levelData.level_number);
}

// YB - 16-09-2026 Restart active level
function restartCurrentLevel() {
    if (mission.activeLevel.value) {
        startLevel(mission.activeLevel.value);
    }
}

// YB - 16-09-2026 Exit from game to galaxy navigation map
function exitToGalaxyMap() {
    currentView.value = 'galaxy_map';
    syncLocalProgressWithWorlds();
}

// YB - 16-09-2026 Proceed to next mission after victory
function goToNextMission() {
    const currentNum = mission.activeLevel.value?.level_number || 1;
    const nextNum = currentNum + 1;
    let nextLevel = null;

    for (const world of worldsData.value) {
        for (const lvl of (world.levels || [])) {
            if (lvl.level_number === nextNum) {
                nextLevel = lvl;
                break;
            }
        }
        if (nextLevel) break;
    }

    if (nextLevel) {
        startLevel(nextLevel);
    } else {
        exitToGalaxyMap();
    }
}

// YB - 16-09-2026 Launch daily challenge mission
function startDailyChallenge() {
    showDailyModal.value = false;
    const missionObj = {
        id: 9999,
        level_number: 'Daily',
        title: dailyMissionData.value?.title || 'Daily Cosmic Storm',
        rows: 8,
        columns: 8,
        move_limit: dailyMissionData.value?.move_limit || 22,
        star_thresholds: [6000, 10000, 15000],
        objectives: dailyMissionData.value?.objectives || [{ type: 'score', target: 12000 }],
    };
    startLevel(missionObj);
}

// Trigger celebratory confetti on victory
watch(() => mission.missionStatus.value, (newStatus) => {
    if (newStatus === 'completed') {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#22d3ee', '#fbbf24', '#f43f5e', '#a855f7'],
        });

        // Submit score to backend
        const lvl = mission.activeLevel.value;
        if (lvl) {
            const finalScore = score.currentScore.value + (mission.movesRemaining.value * 250);
            session.submitLevelResult(
                lvl.id || lvl.level_number,
                finalScore,
                score.starProgress.value,
                mission.initialMoves.value - mission.movesRemaining.value,
                true
            );
            syncLocalProgressWithWorlds();
        }
    }
});
</script>
