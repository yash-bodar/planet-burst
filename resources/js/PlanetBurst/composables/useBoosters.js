// YB - 17-09-2026 In-game tactical booster arsenal state and handler for Planet Burst
import { ref } from 'vue';

const STORAGE_KEY_BOOSTERS = 'planet_burst_boosters_v1';

export function useBoosters() {
    // Initial inventory with 3 free charges per booster
    const defaultInventory = {
        hammer: 3,
        ufo: 3,
        ion_ray: 3,
        free_swap: 3,
    };

    const saved = localStorage.getItem(STORAGE_KEY_BOOSTERS);
    const inventory = ref(saved ? { ...defaultInventory, ...JSON.parse(saved) } : defaultInventory);
    const activeBooster = ref(null); // null | 'hammer' | 'ufo' | 'ion_ray' | 'free_swap'

    // YB - 17-09-2026 Persist booster charges to localStorage
    function saveInventory() {
        localStorage.setItem(STORAGE_KEY_BOOSTERS, JSON.stringify(inventory.value));
    }

    // YB - 17-09-2026 Select or toggle active booster mode
    function selectBooster(type) {
        if (inventory.value[type] <= 0) return;

        if (activeBooster.value === type) {
            activeBooster.value = null; // Deselect
        } else {
            activeBooster.value = type;
        }
    }

    // YB - 17-09-2026 Consume one charge of a booster
    function consumeBooster(type) {
        if (inventory.value[type] > 0) {
            inventory.value[type]--;
            saveInventory();
        }
        activeBooster.value = null;
    }

    // YB - 17-09-2026 Cancel active booster mode
    function cancelBooster() {
        activeBooster.value = null;
    }

    return {
        inventory,
        activeBooster,
        selectBooster,
        consumeBooster,
        cancelBooster,
    };
}
