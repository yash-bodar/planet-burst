// YB - 16-09-2026 GameSession composable managing API communication, progress persistence, and offline fallback
import { ref } from 'vue';

const STORAGE_KEY_PROGRESS = 'planet_burst_progress_v1';
const STORAGE_KEY_OFFLINE_SCORES = 'planet_burst_offline_scores_v1';

export function useGameSession() {
    const currentSessionId = ref(null);
    const isSubmitting = ref(false);
    const offlineProgress = ref(loadLocalProgress());

    // YB - 16-09-2026 Load local progress from browser localStorage
    function loadLocalProgress() {
        try {
            const data = localStorage.getItem(STORAGE_KEY_PROGRESS);
            if (data) return JSON.parse(data);
        } catch (e) {
            console.error('Failed to load local progress', e);
        }
        return {
            unlocked_level_id: 1,
            unlocked_world_id: 1,
            completed_levels: {},
            total_stars: 0,
        };
    }

    // YB - 16-09-2026 Save local progress to browser localStorage
    function saveLocalProgress(progress) {
        offlineProgress.value = progress;
        try {
            localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
        } catch (e) {
            console.error('Failed to save local progress', e);
        }
    }

    // YB - 16-09-2026 Create a new game session with the backend API
    async function startSession(levelId, isDaily = false) {
        try {
            const response = await fetch('/api/planet-burst/game-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    level_id: levelId,
                    is_daily: isDaily,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                currentSessionId.value = data.session_token || data.id;
                return currentSessionId.value;
            }
        } catch (err) {
            console.warn('Network offline, generating local session token', err);
        }

        // Offline fallback session token
        currentSessionId.value = `offline_sess_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        return currentSessionId.value;
    }

    // YB - 16-09-2026 Submit completed level result to backend
    async function submitLevelResult(levelId, score, stars, movesUsed, isCompleted) {
        isSubmitting.value = true;

        // Immediately update local progress for responsive UX
        const progress = { ...offlineProgress.value };
        const prevLevelStars = progress.completed_levels[levelId]?.stars || 0;
        const prevLevelScore = progress.completed_levels[levelId]?.score || 0;

        if (isCompleted) {
            progress.completed_levels[levelId] = {
                stars: Math.max(prevLevelStars, stars),
                score: Math.max(prevLevelScore, score),
            };

            // Unlock next level
            if (levelId >= progress.unlocked_level_id) {
                progress.unlocked_level_id = levelId + 1;
            }
        }
        saveLocalProgress(progress);

        try {
            const response = await fetch(`/api/planet-burst/levels/${levelId}/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    session_token: currentSessionId.value,
                    score,
                    stars,
                    moves_used: movesUsed,
                    completed: isCompleted,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                isSubmitting.value = false;
                return result;
            }
        } catch (err) {
            console.warn('Could not sync score with server, stored locally for later sync', err);
            storeOfflineScore({ levelId, score, stars, movesUsed, isCompleted, timestamp: Date.now() });
        }

        isSubmitting.value = false;
        return { success: true, offline: true };
    }

    // YB - 16-09-2026 Submit daily challenge score
    async function submitDailyScore(score, movesUsed) {
        try {
            const response = await fetch('/api/planet-burst/daily-mission/score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    session_token: currentSessionId.value,
                    score,
                    moves_used: movesUsed,
                }),
            });
            if (response.ok) {
                return await response.json();
            }
        } catch (e) {
            console.warn('Failed to submit daily score', e);
        }
        return { success: false };
    }

    // YB - 16-09-2026 Store unsubmitted score locally when offline
    function storeOfflineScore(entry) {
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_OFFLINE_SCORES) || '[]');
            stored.push(entry);
            localStorage.setItem(STORAGE_KEY_OFFLINE_SCORES, JSON.stringify(stored));
        } catch (e) {
            console.error('Failed to store offline score', e);
        }
    }

    return {
        currentSessionId,
        isSubmitting,
        offlineProgress,
        startSession,
        submitLevelResult,
        submitDailyScore,
        saveLocalProgress,
    };
}
