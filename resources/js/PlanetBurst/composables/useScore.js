// YB - 16-09-2026 Centralized Scoring Composable & Configuration for Planet Burst
import { ref, computed } from 'vue';

export const SCORE_CONFIG = {
    MATCH_3: 60,
    MATCH_4: 120,
    MATCH_5: 250,
    MATCH_SHAPE: 200, // L or T match
    POWER_CREATED: 150,
    COMET_TRIGGER: 300,
    BLACK_HOLE_TRIGGER: 500,
    SUPERNOVA_TRIGGER: 800,
    POWER_COMBO: 1000,
    ICE_CLEARED: 100,
    REMAINING_MOVE_BONUS: 250,
    CASCADE_MULTIPLIERS: [1.0, 1.2, 1.5, 2.0, 2.5, 3.0, 4.0, 5.0],
};

export function useScore() {
    const currentScore = ref(0);
    const starProgress = ref(0); // 0 to 3
    const comboStreak = ref(0);
    const recentScorePopups = ref([]);

    // YB - 16-09-2026 Reset score state for a new mission
    function resetScore() {
        currentScore.value = 0;
        starProgress.value = 0;
        comboStreak.value = 0;
        recentScorePopups.value = [];
    }

    // YB - 16-09-2026 Calculate and add score for a match event
    function addMatchScore(matchCount, matchType = 'normal', cascadeLevel = 0, originCoord = null) {
        let base = SCORE_CONFIG.MATCH_3;
        if (matchType === 'shape') {
            base = SCORE_CONFIG.MATCH_SHAPE;
        } else if (matchCount === 4) {
            base = SCORE_CONFIG.MATCH_4;
        } else if (matchCount >= 5) {
            base = SCORE_CONFIG.MATCH_5;
        }

        const multIndex = Math.min(cascadeLevel, SCORE_CONFIG.CASCADE_MULTIPLIERS.length - 1);
        const multiplier = SCORE_CONFIG.CASCADE_MULTIPLIERS[multIndex];
        const points = Math.round(base * multiplier);

        currentScore.value += points;

        if (originCoord) {
            spawnPopup(points, originCoord.row, originCoord.col, multiplier > 1 ? `x${multiplier}` : null);
        }

        return points;
    }

    // YB - 16-09-2026 Add score for power creation
    function addPowerCreatedScore(row, col) {
        currentScore.value += SCORE_CONFIG.POWER_CREATED;
        spawnPopup(SCORE_CONFIG.POWER_CREATED, row, col, 'POWER UP');
    }

    // YB - 16-09-2026 Add score for power activation
    function addPowerActivationScore(powerType, row, col) {
        let points = SCORE_CONFIG.COMET_TRIGGER;
        if (powerType === 'black_hole') points = SCORE_CONFIG.BLACK_HOLE_TRIGGER;
        if (powerType === 'supernova') points = SCORE_CONFIG.SUPERNOVA_TRIGGER;
        if (powerType === 'combo') points = SCORE_CONFIG.POWER_COMBO;

        currentScore.value += points;
        spawnPopup(points, row, col, 'BURST!');
        return points;
    }

    // YB - 16-09-2026 Add remaining moves completion bonus
    function addRemainingMovesBonus(movesLeft) {
        const bonus = movesLeft * SCORE_CONFIG.REMAINING_MOVE_BONUS;
        currentScore.value += bonus;
        return bonus;
    }

    // YB - 16-09-2026 Spawn a floating score pop-up on the board
    function spawnPopup(points, row, col, label = null) {
        const id = `popup_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        recentScorePopups.value.push({ id, points, row, col, label });

        setTimeout(() => {
            recentScorePopups.value = recentScorePopups.value.filter(p => p.id !== id);
        }, 1200);
    }

    // YB - 16-09-2026 Compute stars earned based on level thresholds
    function updateStars(thresholds) {
        if (!thresholds || thresholds.length < 3) return 0;
        let stars = 0;
        if (currentScore.value >= thresholds[0]) stars = 1;
        if (currentScore.value >= thresholds[1]) stars = 2;
        if (currentScore.value >= thresholds[2]) stars = 3;
        starProgress.value = stars;
        return stars;
    }

    return {
        currentScore,
        starProgress,
        comboStreak,
        recentScorePopups,
        resetScore,
        addMatchScore,
        addPowerCreatedScore,
        addPowerActivationScore,
        addRemainingMovesBonus,
        updateStars,
    };
}
