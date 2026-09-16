// YB - 16-09-2026 Master Cosmic Board reactive composable coordinating engine, animations, powers, and gestures
import { ref, reactive, computed } from 'vue';
import { BoardEngine, POWER_TYPES, COSMIC_TILE_TYPES } from '../engine/BoardEngine.js';

export function useCosmicBoard(audioComposable, scoreComposable, missionComposable) {
    const engine = ref(new BoardEngine());
    const grid = ref([]);
    const selectedTile = ref(null);
    const swappingState = ref(null); // { r1, c1, r2, c2, dx, dy, isReverting: boolean }
    const isBusy = ref(false); // Locks user input during animations
    const isReshuffling = ref(false);
    const activeCascades = ref(0);
    const activePowerEffects = ref([]); // Visual laser/vortex/explosion overlays

    // YB - 16-09-2026 Initialize board for a level
    function setupBoard(levelData = null) {
        const rows = levelData?.rows || 8;
        const cols = levelData?.columns || 8;
        const tilePool = levelData?.available_tiles || COSMIC_TILE_TYPES;

        engine.value = new BoardEngine(rows, cols, tilePool);
        grid.value = engine.value.initBoard();

        // Seed obstacles if specified in levelData
        if (levelData?.obstacles) {
            for (const obs of levelData.obstacles) {
                const cell = engine.value.getTile(obs.row, obs.col);
                if (cell) {
                    cell.obstacle = obs.type; // 'ice', 'rock', 'lock'
                }
            }
        }

        selectedTile.value = null;
        swappingState.value = null;
        isBusy.value = false;
        activeCascades.value = 0;
        activePowerEffects.value = [];
    }

    // YB - 16-09-2026 Handle tile selection via click or tap
    async function selectTile(row, col) {
        if (isBusy.value || missionComposable.missionStatus.value !== 'in_progress') return;

        const clickedTile = engine.value.getTile(row, col);
        if (!clickedTile || clickedTile.obstacle === 'rock' || clickedTile.obstacle === 'lock') return;

        // First click
        if (!selectedTile.value) {
            selectedTile.value = { row, col, tile: clickedTile };
            audioComposable.playSwap();
            return;
        }

        // Clicked the already selected tile -> deselect
        if (selectedTile.value.row === row && selectedTile.value.col === col) {
            selectedTile.value = null;
            return;
        }

        // Clicked an adjacent tile -> attempt swap
        if (engine.value.isAdjacent(selectedTile.value.row, selectedTile.value.col, row, col)) {
            const origin = { ...selectedTile.value };
            selectedTile.value = null;
            await attemptSwap(origin.row, origin.col, row, col);
        } else {
            // Clicked a non-adjacent tile -> re-select
            selectedTile.value = { row, col, tile: clickedTile };
            audioComposable.playSwap();
        }
    }

    // YB - 16-09-2026 Handle swipe gesture from a starting cell
    async function handleSwipe(startRow, startCol, direction) {
        if (isBusy.value || missionComposable.missionStatus.value !== 'in_progress') return;

        let targetRow = startRow;
        let targetCol = startCol;

        if (direction === 'up') targetRow--;
        else if (direction === 'down') targetRow++;
        else if (direction === 'left') targetCol--;
        else if (direction === 'right') targetCol++;

        if (targetRow < 0 || targetRow >= engine.value.rows || targetCol < 0 || targetCol >= engine.value.cols) {
            return;
        }

        selectedTile.value = null;
        await attemptSwap(startRow, startCol, targetRow, targetCol);
    }

    // YB - 16-09-2026 Attempt swap between two adjacent cells with animated slide transition
    async function attemptSwap(r1, c1, r2, c2) {
        isBusy.value = true;
        const tile1 = engine.value.getTile(r1, c1);
        const tile2 = engine.value.getTile(r2, c2);

        if (!tile1 || !tile2) {
            isBusy.value = false;
            return;
        }

        // Trigger smooth sliding animation
        const dx = c2 - c1;
        const dy = r2 - r1;
        swappingState.value = { r1, c1, r2, c2, dx, dy, isReverting: false };
        audioComposable.playSwap();
        await sleep(220); // CSS slide transition

        // Perform swap in engine
        engine.value.swap(r1, c1, r2, c2);
        swappingState.value = null;

        // Power tile special activations
        const isPower1 = !!tile1.power;
        const isPower2 = !!tile2.power;

        if (isPower1 || isPower2) {
            missionComposable.useMove();
            await handlePowerInteractions(r1, c1, r2, c2, tile1, tile2);
            await runCascadeLoop();
            checkEndConditions();
            isBusy.value = false;
            return;
        }

        // Standard swap match check
        const matchResult = engine.value.findMatches();

        if (matchResult.hasMatches) {
            missionComposable.useMove();
            await processMatchesAndGravity(matchResult, { row: r2, col: c2 });
            await runCascadeLoop();
            checkEndConditions();
        } else {
            // Invalid swap -> smoothly slide back
            audioComposable.playInvalid();
            swappingState.value = { r1: r2, c1: c2, r2: r1, c2: c1, dx: -dx, dy: -dy, isReverting: true };
            await sleep(220);
            engine.value.swap(r2, c2, r1, c1); // Swap back
            swappingState.value = null;
        }

        isBusy.value = false;
    }

    // YB - 16-09-2026 Handle power tiles swap and combinations
    async function handlePowerInteractions(r1, c1, r2, c2, tile1, tile2) {
        const clearedSet = new Set();
        const key = (r, c) => `${r},${c}`;

        // Combination: Supernova + Supernova -> Universal Burst (clears entire board)
        if (tile1.power === POWER_TYPES.SUPERNOVA && tile2.power === POWER_TYPES.SUPERNOVA) {
            audioComposable.playSupernova();
            scoreComposable.addPowerActivationScore('combo', r2, c2);
            spawnPowerEffect('universal_burst', r2, c2);

            for (let r = 0; r < engine.value.rows; r++) {
                for (let c = 0; c < engine.value.cols; c++) {
                    clearedSet.add(key(r, c));
                }
            }
        }
        // Supernova + Comet: turns all tiles of that type into Comets and triggers them
        else if (
            (tile1.power === POWER_TYPES.SUPERNOVA && (tile2.power === POWER_TYPES.COMET_H || tile2.power === POWER_TYPES.COMET_V)) ||
            (tile2.power === POWER_TYPES.SUPERNOVA && (tile1.power === POWER_TYPES.COMET_H || tile1.power === POWER_TYPES.COMET_V))
        ) {
            const nonSupernova = tile1.power === POWER_TYPES.SUPERNOVA ? tile2 : tile1;
            const targetColor = nonSupernova.type;
            audioComposable.playSupernova();
            spawnPowerEffect('supernova', r2, c2);

            clearedSet.add(key(r1, c1));
            clearedSet.add(key(r2, c2));

            // Convert and trigger
            for (let r = 0; r < engine.value.rows; r++) {
                for (let c = 0; c < engine.value.cols; c++) {
                    const t = engine.value.getTile(r, c);
                    if (t && t.type === targetColor) {
                        clearedSet.add(key(r, c));
                        // Trigger column or row clear
                        triggerCometClear(r, c, Math.random() > 0.5 ? POWER_TYPES.COMET_H : POWER_TYPES.COMET_V, clearedSet);
                    }
                }
            }
        }
        // Comet + Comet: Meteor Storm (Clears entire row AND entire column)
        else if (
            (tile1.power === POWER_TYPES.COMET_H || tile1.power === POWER_TYPES.COMET_V) &&
            (tile2.power === POWER_TYPES.COMET_H || tile2.power === POWER_TYPES.COMET_V)
        ) {
            audioComposable.playComet();
            scoreComposable.addPowerActivationScore('combo', r2, c2);
            spawnPowerEffect('laser_cross', r2, c2);

            triggerCometClear(r2, c2, POWER_TYPES.COMET_H, clearedSet);
            triggerCometClear(r2, c2, POWER_TYPES.COMET_V, clearedSet);
        }
        // Comet + Black Hole: Gravity Storm (Clears 3 full rows and 3 full columns)
        else if (
            (tile1.power === POWER_TYPES.BLACK_HOLE && (tile2.power === POWER_TYPES.COMET_H || tile2.power === POWER_TYPES.COMET_V)) ||
            (tile2.power === POWER_TYPES.BLACK_HOLE && (tile1.power === POWER_TYPES.COMET_H || tile1.power === POWER_TYPES.COMET_V))
        ) {
            audioComposable.playBlackHole();
            scoreComposable.addPowerActivationScore('combo', r2, c2);
            spawnPowerEffect('vortex_storm', r2, c2);

            for (let offset = -1; offset <= 1; offset++) {
                const tr = Math.max(0, Math.min(engine.value.rows - 1, r2 + offset));
                const tc = Math.max(0, Math.min(engine.value.cols - 1, c2 + offset));
                triggerCometClear(tr, tc, POWER_TYPES.COMET_H, clearedSet);
                triggerCometClear(tr, tc, POWER_TYPES.COMET_V, clearedSet);
            }
        }
        // Bomb + Bomb: Mega Supermassive Singularity (Massive 5x5 explosion)
        else if (tile1.power === POWER_TYPES.BLACK_HOLE && tile2.power === POWER_TYPES.BLACK_HOLE) {
            audioComposable.playBlackHole();
            scoreComposable.addPowerActivationScore('combo', r2, c2);
            spawnPowerEffect('vortex_storm', r2, c2);

            for (let dr = -2; dr <= 2; dr++) {
                for (let dc = -2; dc <= 2; dc++) {
                    const nr = r2 + dr;
                    const nc = c2 + dc;
                    if (nr >= 0 && nr < engine.value.rows && nc >= 0 && nc < engine.value.cols) {
                        clearedSet.add(key(nr, nc));
                    }
                }
            }
        }
        // Single Supernova with normal tile: Clears all of that cosmic type
        else if (tile1.power === POWER_TYPES.SUPERNOVA || tile2.power === POWER_TYPES.SUPERNOVA) {
            const supernovaTile = tile1.power === POWER_TYPES.SUPERNOVA ? tile1 : tile2;
            const targetColor = tile1.power === POWER_TYPES.SUPERNOVA ? tile2.type : tile1.type;

            audioComposable.playSupernova();
            scoreComposable.addPowerActivationScore('supernova', r2, c2);
            spawnPowerEffect('supernova', r2, c2);

            clearedSet.add(key(r1, c1));
            clearedSet.add(key(r2, c2));

            for (let r = 0; r < engine.value.rows; r++) {
                for (let c = 0; c < engine.value.cols; c++) {
                    const t = engine.value.getTile(r, c);
                    if (t && t.type === targetColor) {
                        clearedSet.add(key(r, c));
                    }
                }
            }
        }
        // Single power tile trigger
        else {
            if (tile1.power) activateSinglePower(r1, c1, tile1.power, clearedSet);
            if (tile2.power) activateSinglePower(r2, c2, tile2.power, clearedSet);
        }

        // Execute cleared tiles
        const clearedCoords = Array.from(clearedSet).map(k => {
            const [r, c] = k.split(',').map(Number);
            return { row: r, col: c, tile: engine.value.getTile(r, c) };
        });

        // Notify mission of tile clears and break adjacent ice
        missionComposable.recordTileClears(clearedCoords);
        breakAdjacentIce(clearedCoords);

        engine.value.clearTiles(clearedCoords);
        await sleep(280);

        engine.value.applyGravityAndRefill();
        await sleep(220);
    }

    // YB - 16-09-2026 Trigger single power tile effect
    function activateSinglePower(row, col, powerType, clearedSet) {
        const key = (r, c) => `${r},${c}`;
        clearedSet.add(key(row, col));

        if (powerType === POWER_TYPES.COMET_H || powerType === POWER_TYPES.COMET_V) {
            audioComposable.playComet();
            scoreComposable.addPowerActivationScore('comet', row, col);
            spawnPowerEffect(powerType === POWER_TYPES.COMET_H ? 'laser_h' : 'laser_v', row, col);
            triggerCometClear(row, col, powerType, clearedSet);
        } else if (powerType === POWER_TYPES.BLACK_HOLE) {
            audioComposable.playBlackHole();
            scoreComposable.addPowerActivationScore('black_hole', row, col);
            spawnPowerEffect('black_hole', row, col);

            // Clear 3x3 surrounding
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = row + dr;
                    const nc = col + dc;
                    if (nr >= 0 && nr < engine.value.rows && nc >= 0 && nc < engine.value.cols) {
                        clearedSet.add(key(nr, nc));
                    }
                }
            }
        }
    }

    // YB - 16-09-2026 Trigger line clear for a comet
    function triggerCometClear(row, col, powerType, clearedSet) {
        const key = (r, c) => `${r},${c}`;
        if (powerType === POWER_TYPES.COMET_H) {
            for (let c = 0; c < engine.value.cols; c++) {
                clearedSet.add(key(row, c));
            }
        } else {
            for (let r = 0; r < engine.value.rows; r++) {
                clearedSet.add(key(r, col));
            }
        }
    }

    // YB - 16-09-2026 Process match clearing, power creation, and gravity drop
    async function processMatchesAndGravity(matchResult, focusCoord = null) {
        const { clearedCoords, powersToSpawn } = engine.value.resolveMatches(matchResult.matches, focusCoord);

        // Visual match flagging
        for (const item of clearedCoords) {
            if (item.tile) item.tile.isMatched = true;
        }

        audioComposable.playMatch(activeCascades.value);

        // Compute scores
        for (const m of matchResult.matches) {
            scoreComposable.addMatchScore(
                m.length,
                m.length >= 5 ? '5' : (m.length === 4 ? '4' : 'normal'),
                activeCascades.value,
                m.cells[0]
            );
        }

        // Notify mission & break ice
        missionComposable.recordTileClears(clearedCoords);
        breakAdjacentIce(clearedCoords);

        for (const p of powersToSpawn) {
            scoreComposable.addPowerCreatedScore(p.row, p.col);
        }

        missionComposable.updateScoreObjective(scoreComposable.currentScore.value);
        if (missionComposable.activeLevel.value?.star_thresholds) {
            scoreComposable.updateStars(missionComposable.activeLevel.value.star_thresholds);
        }

        await sleep(250);

        engine.value.clearTiles(clearedCoords, powersToSpawn);
        await sleep(60);

        engine.value.applyGravityAndRefill();
        await sleep(220);
    }

    // YB - 16-09-2026 Break cosmic ice on cells adjacent to cleared tiles
    function breakAdjacentIce(clearedCoords) {
        const adjacentDeltas = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (const item of clearedCoords) {
            for (const [dr, dc] of adjacentDeltas) {
                const nr = item.row + dr;
                const nc = item.col + dc;
                const neighbor = engine.value.getTile(nr, nc);
                if (neighbor && neighbor.obstacle === 'ice') {
                    neighbor.obstacle = null;
                    missionComposable.recordObstacleClear('ice');
                    scoreComposable.addMatchScore(1, 'ice', 0, { row: nr, col: nc });
                }
            }
        }
    }

    // YB - 16-09-2026 Run cascade loop continuously until board reaches equilibrium
    async function runCascadeLoop() {
        let cascadeCount = 0;
        const MAX_CASCADES = 20;

        while (cascadeCount < MAX_CASCADES) {
            const nextMatches = engine.value.findMatches();
            if (!nextMatches.hasMatches) break;

            cascadeCount++;
            activeCascades.value = cascadeCount;
            await processMatchesAndGravity(nextMatches);
        }

        activeCascades.value = 0;
    }

    // YB - 16-09-2026 Check for win/loss conditions and deadlock detection
    function checkEndConditions() {
        const status = missionComposable.checkMissionStatus();

        if (status === 'completed') {
            audioComposable.playVictory();
            // Remaining moves bonus
            scoreComposable.addRemainingMovesBonus(missionComposable.movesRemaining.value);
            missionComposable.updateScoreObjective(scoreComposable.currentScore.value);
            if (missionComposable.activeLevel.value?.star_thresholds) {
                scoreComposable.updateStars(missionComposable.activeLevel.value.star_thresholds);
            }
            return;
        }

        if (status === 'failed') {
            audioComposable.playFailed();
            return;
        }

        // Check if deadlock exists
        if (!engine.value.hasPossibleMoves()) {
            handleDeadlock();
        }
    }

    // YB - 16-09-2026 Reshuffle board upon deadlock detection
    async function handleDeadlock() {
        isReshuffling.value = true;
        await sleep(300);
        engine.value.reshuffle();
        await sleep(400);
        isReshuffling.value = false;
    }

    // YB - 16-09-2026 Add transient visual effect for power activations
    function spawnPowerEffect(type, row, col) {
        const id = `fx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        activePowerEffects.value.push({ id, type, row, col });

        setTimeout(() => {
            activePowerEffects.value = activePowerEffects.value.filter(fx => fx.id !== id);
        }, 600);
    }

    // YB - 16-09-2026 Helper promise delay
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return {
        engine,
        grid,
        selectedTile,
        swappingState,
        isBusy,
        isReshuffling,
        activeCascades,
        activePowerEffects,
        setupBoard,
        selectTile,
        handleSwipe,
    };
}
