// YB - 16-09-2026 Master Cosmic Board reactive composable coordinating engine, animations, powers, screen shake, and cascades
import { ref } from 'vue';
import { BoardEngine, POWER_TYPES, COSMIC_TILE_TYPES } from '../engine/BoardEngine.js';

export function useCosmicBoard(audioComposable, scoreComposable, missionComposable) {
    const engine = ref(new BoardEngine());
    const grid = ref([]);
    const selectedTile = ref(null);
    const swappingState = ref(null); // { r1, c1, r2, c2, dx, dy, isReverting: boolean }
    const isBusy = ref(false); // Locks user input during animations
    const isReshuffling = ref(false);
    const isCelebrating = ref(false); // Cosmic cascade / victory finale
    const activeCascades = ref(0);
    const activePowerEffects = ref([]); // Visual laser/vortex/explosion overlays
    const screenShake = ref(null); // 'light' | 'medium' | 'heavy'

    // YB - 16-09-2026 Deeply synchronize board engine state to Vue reactive ref
    function syncGrid() {
        if (!engine.value || !engine.value.grid) return;
        grid.value = engine.value.grid.map(row => [...row]);
    }

    // YB - 16-09-2026 Trigger haptic screen shake effect
    function triggerScreenShake(type = 'light') {
        screenShake.value = type;
        setTimeout(() => {
            if (screenShake.value === type) {
                screenShake.value = null;
            }
        }, 450);
    }

    // YB - 16-09-2026 Initialize board for a level
    function setupBoard(levelData = null) {
        const rows = levelData?.rows || 8;
        const cols = levelData?.columns || 8;
        const tilePool = levelData?.available_tiles || COSMIC_TILE_TYPES;

        engine.value = new BoardEngine(rows, cols, tilePool);
        engine.value.initBoard();

        // Seed obstacles if specified in levelData
        if (levelData?.obstacles) {
            for (const obs of levelData.obstacles) {
                const cell = engine.value.getTile(obs.row, obs.col);
                if (cell) {
                    cell.obstacle = obs.type; // 'ice', 'rock', 'lock'
                }
            }
        }

        syncGrid();

        selectedTile.value = null;
        swappingState.value = null;
        isBusy.value = false;
        isCelebrating.value = false;
        activeCascades.value = 0;
        activePowerEffects.value = [];
        screenShake.value = null;
    }

    // YB - 16-09-2026 Handle tile selection via click or tap
    async function selectTile(row, col) {
        if (isBusy.value || isCelebrating.value || missionComposable.missionStatus.value !== 'in_progress') return;

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
        if (isBusy.value || isCelebrating.value || missionComposable.missionStatus.value !== 'in_progress') return;

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

    // YB - 16-09-2026 Attempt swap between two adjacent cells with tactile animated slide transition
    async function attemptSwap(r1, c1, r2, c2) {
        isBusy.value = true;
        const tile1 = engine.value.getTile(r1, c1);
        const tile2 = engine.value.getTile(r2, c2);

        if (!tile1 || !tile2) {
            isBusy.value = false;
            return;
        }

        // Trigger smooth sliding animation (slowed to 300ms for satisfying Candy Crush tactile feel)
        const dx = c2 - c1;
        const dy = r2 - r1;
        swappingState.value = { r1, c1, r2, c2, dx, dy, isReverting: false };
        audioComposable.playSwap();
        await sleep(300);

        // Perform swap in engine
        engine.value.swap(r1, c1, r2, c2);
        swappingState.value = null;
        syncGrid();

        // Power tile special activations
        const isPower1 = !!tile1.power;
        const isPower2 = !!tile2.power;

        if (isPower1 || isPower2) {
            missionComposable.useMove();
            await handlePowerInteractions(r1, c1, r2, c2, tile1, tile2);
            await runCascadeLoop();
            await checkEndConditions();
            isBusy.value = false;
            return;
        }

        // Standard swap match check
        const matchResult = engine.value.findMatches();

        if (matchResult.hasMatches) {
            missionComposable.useMove();
            await processMatchesAndGravity(matchResult, { row: r2, col: c2 });
            await runCascadeLoop();
            await checkEndConditions();
        } else {
            // Invalid swap -> smoothly slide back
            audioComposable.playInvalid();
            swappingState.value = { r1: r2, c1: c2, r2: r1, c2: c1, dx: -dx, dy: -dy, isReverting: true };
            await sleep(280);
            engine.value.swap(r2, c2, r1, c1); // Swap back
            swappingState.value = null;
            syncGrid();
        }

        isBusy.value = false;
    }

    // YB - 16-09-2026 Handle power tiles swap and combinations with rich visual effects
    async function handlePowerInteractions(r1, c1, r2, c2, tile1, tile2) {
        const clearedSet = new Set();
        const key = (r, c) => `${r},${c}`;

        // Combination: Supernova + Supernova -> Universal Burst (clears entire board)
        if (tile1.power === POWER_TYPES.SUPERNOVA && tile2.power === POWER_TYPES.SUPERNOVA) {
            audioComposable.playSupernova();
            scoreComposable.addPowerActivationScore('combo', r2, c2);
            triggerScreenShake('heavy');
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
            triggerScreenShake('heavy');

            // Find all matching color targets for lightning arcs
            const targets = [];
            for (let r = 0; r < engine.value.rows; r++) {
                for (let c = 0; c < engine.value.cols; c++) {
                    const t = engine.value.getTile(r, c);
                    if (t && t.type === targetColor) {
                        targets.push({ row: r, col: c });
                    }
                }
            }

            spawnPowerEffect('supernova', r2, c2, { targets, targetColor });

            clearedSet.add(key(r1, c1));
            clearedSet.add(key(r2, c2));

            await sleep(400);

            // Convert and trigger all matching tiles into comets
            for (const tgt of targets) {
                clearedSet.add(key(tgt.row, tgt.col));
                const pType = Math.random() > 0.5 ? POWER_TYPES.COMET_H : POWER_TYPES.COMET_V;
                triggerCometClear(tgt.row, tgt.col, pType, clearedSet);
                spawnPowerEffect(pType === POWER_TYPES.COMET_H ? 'laser_h' : 'laser_v', tgt.row, tgt.col);
            }
        }
        // Comet + Comet: Meteor Storm (Clears entire row AND entire column)
        else if (
            (tile1.power === POWER_TYPES.COMET_H || tile1.power === POWER_TYPES.COMET_V) &&
            (tile2.power === POWER_TYPES.COMET_H || tile2.power === POWER_TYPES.COMET_V)
        ) {
            audioComposable.playComet();
            scoreComposable.addPowerActivationScore('combo', r2, c2);
            triggerScreenShake('light');
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
            triggerScreenShake('medium');
            spawnPowerEffect('vortex_storm', r2, c2, { radius: 2 });

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
            triggerScreenShake('heavy');
            spawnPowerEffect('vortex_storm', r2, c2, { radius: 2 });

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
            triggerScreenShake('medium');

            const targets = [];
            for (let r = 0; r < engine.value.rows; r++) {
                for (let c = 0; c < engine.value.cols; c++) {
                    const t = engine.value.getTile(r, c);
                    if (t && t.type === targetColor) {
                        targets.push({ row: r, col: c });
                        clearedSet.add(key(r, c));
                    }
                }
            }

            spawnPowerEffect('supernova', r2, c2, { targets, targetColor });
            clearedSet.add(key(r1, c1));
            clearedSet.add(key(r2, c2));

            await sleep(450);
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

        // Visually mark matched tiles
        for (const item of clearedCoords) {
            if (item.tile) item.tile.isMatched = true;
        }
        syncGrid();
        await sleep(320); // Allow pop animation to complete

        // Notify mission of tile clears and break adjacent ice
        missionComposable.recordTileClears(clearedCoords);
        breakAdjacentIce(clearedCoords);

        engine.value.clearTiles(clearedCoords);
        syncGrid();
        await sleep(80);

        engine.value.applyGravityAndRefill();
        syncGrid();
        await sleep(340); // Allow tiles to drop and settle
        await sleep(260); // Cadence pause
    }

    // YB - 16-09-2026 Trigger single power tile effect
    function activateSinglePower(row, col, powerType, clearedSet) {
        const key = (r, c) => `${r},${c}`;
        clearedSet.add(key(row, col));

        if (powerType === POWER_TYPES.COMET_H || powerType === POWER_TYPES.COMET_V) {
            audioComposable.playComet();
            scoreComposable.addPowerActivationScore('comet', row, col);
            triggerScreenShake('light');
            spawnPowerEffect(powerType === POWER_TYPES.COMET_H ? 'laser_h' : 'laser_v', row, col);
            triggerCometClear(row, col, powerType, clearedSet);
        } else if (powerType === POWER_TYPES.BLACK_HOLE) {
            audioComposable.playBlackHole();
            scoreComposable.addPowerActivationScore('black_hole', row, col);
            triggerScreenShake('medium');
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

    // YB - 16-09-2026 Process match clearing, power creation, gravity drop, and state synchronization
    async function processMatchesAndGravity(matchResult, focusCoord = null) {
        const { clearedCoords, powersToSpawn } = engine.value.resolveMatches(matchResult.matches, focusCoord);

        // Check if any matched tile detonates a power
        for (const item of clearedCoords) {
            if (item.tile?.power) {
                if (item.tile.power === POWER_TYPES.COMET_H) {
                    spawnPowerEffect('laser_h', item.row, item.col);
                    triggerScreenShake('light');
                } else if (item.tile.power === POWER_TYPES.COMET_V) {
                    spawnPowerEffect('laser_v', item.row, item.col);
                    triggerScreenShake('light');
                } else if (item.tile.power === POWER_TYPES.BLACK_HOLE) {
                    spawnPowerEffect('black_hole', item.row, item.col);
                    triggerScreenShake('medium');
                }
            }
        }

        // Step 1: Visual match flagging
        for (const item of clearedCoords) {
            if (item.tile) item.tile.isMatched = true;
        }
        syncGrid();

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
            if (p.power === POWER_TYPES.COMET_H || p.power === POWER_TYPES.COMET_V) {
                spawnPowerEffect(p.power === POWER_TYPES.COMET_H ? 'laser_h' : 'laser_v', p.row, p.col);
            } else if (p.power === POWER_TYPES.BLACK_HOLE) {
                spawnPowerEffect('black_hole', p.row, p.col);
            } else if (p.power === POWER_TYPES.SUPERNOVA) {
                spawnPowerEffect('supernova', p.row, p.col);
            }
        }

        missionComposable.updateScoreObjective(scoreComposable.currentScore.value);
        if (missionComposable.activeLevel.value?.star_thresholds) {
            scoreComposable.updateStars(missionComposable.activeLevel.value.star_thresholds);
        }

        // Step 2: Pop animation pause (320ms so player sees the burst)
        await sleep(320);

        // Step 3: Clear tiles in engine and spawn created special powers
        engine.value.clearTiles(clearedCoords, powersToSpawn);
        syncGrid();
        await sleep(80);

        // Step 4: Apply gravity drop & column refills
        engine.value.applyGravityAndRefill();
        syncGrid();

        // Step 5: Allow falling tiles to settle smoothly
        await sleep(340);

        // Step 6: Cadence pause allowing player eye to register new board state
        await sleep(260);
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
        const MAX_CASCADES = 25;

        while (cascadeCount < MAX_CASCADES) {
            const nextMatches = engine.value.findMatches();
            if (!nextMatches.hasMatches) break;

            cascadeCount++;
            activeCascades.value = cascadeCount;
            await processMatchesAndGravity(nextMatches);
        }

        activeCascades.value = 0;
    }

    // YB - 16-09-2026 Check for win/loss conditions and run celebratory Cosmic Burst finale
    async function checkEndConditions() {
        const areObjectivesMet = missionComposable.checkObjectivesMet();

        if (areObjectivesMet) {
            // Player met all level objectives! Run "Cosmic Burst" / Sugar Crush finale!
            await runCosmicBurstCelebration();
            return;
        }

        if (missionComposable.movesRemaining.value <= 0) {
            audioComposable.playFailed();
            missionComposable.checkMissionStatus(); // Will mark failed
            return;
        }

        // Check if deadlock exists
        if (!engine.value.hasPossibleMoves()) {
            await handleDeadlock();
        }
    }

    // YB - 16-09-2026 Run celebratory Sugar Crush / Cosmic Cascade finale when level is won
    async function runCosmicBurstCelebration() {
        isBusy.value = true;
        isCelebrating.value = true;

        // Finish any ongoing cascades first
        await runCascadeLoop();

        // If player has remaining moves, convert each into a special cosmic power and detonate!
        const remainingMoves = missionComposable.movesRemaining.value;

        if (remainingMoves > 0) {
            const convertedCoords = [];

            // Convert remaining moves one-by-one with celebratory sparkle
            while (missionComposable.movesRemaining.value > 0) {
                missionComposable.movesRemaining.value--;

                // Find a random normal tile on the board
                const candidates = [];
                for (let r = 0; r < engine.value.rows; r++) {
                    for (let c = 0; c < engine.value.cols; c++) {
                        const tile = engine.value.getTile(r, c);
                        if (tile && !tile.power && !tile.obstacle) {
                            candidates.push({ row: r, col: c });
                        }
                    }
                }

                if (candidates.length > 0) {
                    const pick = candidates[Math.floor(Math.random() * candidates.length)];
                    const chosenPower = Math.random() > 0.4 ? (Math.random() > 0.5 ? POWER_TYPES.COMET_H : POWER_TYPES.COMET_V) : POWER_TYPES.BLACK_HOLE;

                    const cell = engine.value.getTile(pick.row, pick.col);
                    if (cell) {
                        cell.power = chosenPower;
                        convertedCoords.push(pick);
                        audioComposable.playSwap();
                        syncGrid();
                    }
                }

                await sleep(200);
            }

            // Tally remaining moves bonus
            scoreComposable.addRemainingMovesBonus(remainingMoves);
            missionComposable.updateScoreObjective(scoreComposable.currentScore.value);
            if (missionComposable.activeLevel.value?.star_thresholds) {
                scoreComposable.updateStars(missionComposable.activeLevel.value.star_thresholds);
            }

            await sleep(400);

            // Detonate all newly created special powers in an epic cascade
            for (const coord of convertedCoords) {
                const cell = engine.value.getTile(coord.row, coord.col);
                if (cell && cell.power) {
                    const clearedSet = new Set();
                    activateSinglePower(coord.row, coord.col, cell.power, clearedSet);

                    const clearedCoords = Array.from(clearedSet).map(k => {
                        const [r, c] = k.split(',').map(Number);
                        return { row: r, col: c, tile: engine.value.getTile(r, c) };
                    });

                    engine.value.clearTiles(clearedCoords);
                    syncGrid();
                    await sleep(150);

                    engine.value.applyGravityAndRefill();
                    syncGrid();
                    await sleep(250);
                }
            }

            // Let any cascades triggered by detonated powers finish
            await runCascadeLoop();
        }

        // Finalize score and stars
        missionComposable.updateScoreObjective(scoreComposable.currentScore.value);
        if (missionComposable.activeLevel.value?.star_thresholds) {
            scoreComposable.updateStars(missionComposable.activeLevel.value.star_thresholds);
        }

        audioComposable.playVictory();

        // 1.5 second victory celebration delay before modal appears
        await sleep(1500);

        missionComposable.finalizeMissionSuccess();
        isCelebrating.value = false;
        isBusy.value = false;
    }

    // YB - 16-09-2026 Reshuffle board upon deadlock detection
    async function handleDeadlock() {
        isReshuffling.value = true;
        await sleep(350);
        engine.value.reshuffle();
        syncGrid();
        await sleep(450);
        isReshuffling.value = false;
    }

    // YB - 16-09-2026 Add transient visual effect for power activations
    function spawnPowerEffect(type, row, col, extra = {}) {
        const id = `fx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        activePowerEffects.value.push({
            id,
            type,
            row,
            col,
            ...extra
        });

        const duration = extra.duration || (type === 'supernova' || type === 'universal_burst' ? 1100 : 700);

        setTimeout(() => {
            activePowerEffects.value = activePowerEffects.value.filter(fx => fx.id !== id);
        }, duration);
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
        isCelebrating,
        activeCascades,
        activePowerEffects,
        screenShake,
        setupBoard,
        selectTile,
        handleSwipe,
        syncGrid,
    };
}
