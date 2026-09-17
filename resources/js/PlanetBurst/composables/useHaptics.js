// YB - 17-09-2026 Mobile haptic feedback coordinator supporting Capacitor and Web Vibration API
export function useHaptics() {
    // Check if device supports vibration
    const isSupported = typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator;

    // YB - 17-09-2026 Gentle tick for tile swaps and button taps
    function vibrateLight() {
        if (isSupported) {
            try {
                navigator.vibrate(12);
            } catch (e) {
                // Ignore silent browser restrictions
            }
        }
    }

    // YB - 17-09-2026 Medium pulse for 3-matches and cascades
    function vibrateMedium() {
        if (isSupported) {
            try {
                navigator.vibrate(28);
            } catch (e) {
                // Ignore silent browser restrictions
            }
        }
    }

    // YB - 17-09-2026 Powerful dual rumble for bomb blasts and laser line clears
    function vibrateHeavy() {
        if (isSupported) {
            try {
                navigator.vibrate([45, 30, 75]);
            } catch (e) {
                // Ignore silent browser restrictions
            }
        }
    }

    // YB - 17-09-2026 Celebratory fanfare rhythm for level victory
    function vibrateSuccess() {
        if (isSupported) {
            try {
                navigator.vibrate([35, 25, 45, 25, 120]);
            } catch (e) {
                // Ignore silent browser restrictions
            }
        }
    }

    return {
        vibrateLight,
        vibrateMedium,
        vibrateHeavy,
        vibrateSuccess,
    };
}
