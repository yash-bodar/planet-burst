// YB - 16-09-2026 Mission rules, objectives tracking, and win/loss evaluation for Planet Burst
import { ref, computed } from 'vue';

export function useMission() {
    const activeLevel = ref(null);
    const movesRemaining = ref(0);
    const initialMoves = ref(0);
    const objectives = ref([]);
    const missionStatus = ref('in_progress'); // 'in_progress' | 'completed' | 'failed'

    // YB - 16-09-2026 Initialize mission with level data
    function loadMission(levelData) {
        activeLevel.value = levelData;
        initialMoves.value = levelData.move_limit || 25;
        movesRemaining.value = initialMoves.value;
        missionStatus.value = 'in_progress';

        // Deep copy objectives
        objectives.value = (levelData.objectives || []).map(obj => ({
            type: obj.type, // 'score' | 'collect_tile' | 'clear_ice'
            target: obj.target,
            current: 0,
            tileType: obj.tileType || null,
            isCompleted: false,
        }));
    }

    // YB - 16-09-2026 Decrement move counter after a valid swap
    function useMove() {
        if (movesRemaining.value > 0) {
            movesRemaining.value--;
        }
        checkMissionStatus();
    }

    // YB - 16-09-2026 Register cleared tiles toward mission objectives
    function recordTileClears(clearedTiles) {
        for (const item of clearedTiles) {
            const tile = item.tile;
            if (!tile) continue;

            for (const obj of objectives.value) {
                if (obj.type === 'collect_tile' && obj.tileType === tile.type) {
                    obj.current = Math.min(obj.target, obj.current + 1);
                    if (obj.current >= obj.target) {
                        obj.isCompleted = true;
                    }
                }
            }
        }
        checkMissionStatus();
    }

    // YB - 16-09-2026 Register cleared obstacles toward mission objectives
    function recordObstacleClear(obstacleType) {
        for (const obj of objectives.value) {
            if (obj.type === 'clear_ice' && obstacleType === 'ice') {
                obj.current = Math.min(obj.target, obj.current + 1);
                if (obj.current >= obj.target) {
                    obj.isCompleted = true;
                }
            }
        }
        checkMissionStatus();
    }

    // YB - 16-09-2026 Register current score toward score objectives
    function updateScoreObjective(currentScore) {
        for (const obj of objectives.value) {
            if (obj.type === 'score') {
                obj.current = currentScore;
                if (obj.current >= obj.target) {
                    obj.isCompleted = true;
                }
            }
        }
        checkMissionStatus();
    }

    // YB - 16-09-2026 Check whether all objectives are fulfilled without prematurely locking modals
    function checkObjectivesMet() {
        return objectives.value.length > 0 && objectives.value.every(obj => obj.isCompleted);
    }

    // YB - 16-09-2026 Check whether all objectives are fulfilled or moves depleted
    function checkMissionStatus() {
        if (missionStatus.value !== 'in_progress') return missionStatus.value;

        const allDone = checkObjectivesMet();

        if (allDone) {
            // Objectives completed! Board engine will run cosmic cascade bonus before final modal
            return 'objectives_met';
        }

        if (movesRemaining.value <= 0) {
            missionStatus.value = 'failed';
            return 'failed';
        }

        return 'in_progress';
    }

    // YB - 16-09-2026 Finalize mission completion after animations and bonus tally complete
    function finalizeMissionSuccess() {
        missionStatus.value = 'completed';
    }

    const allObjectivesMet = computed(() => {
        return objectives.value.length > 0 && objectives.value.every(obj => obj.isCompleted);
    });

    return {
        activeLevel,
        movesRemaining,
        initialMoves,
        objectives,
        missionStatus,
        allObjectivesMet,
        loadMission,
        useMove,
        recordTileClears,
        recordObstacleClear,
        updateScoreObjective,
        checkMissionStatus,
        checkObjectivesMet,
        finalizeMissionSuccess,
    };
}
