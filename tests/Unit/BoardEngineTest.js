// YB - 16-09-2026 Unit tests for Planet Burst BoardEngine (Match detection, Powers, Gravity, Reshuffle)
import assert from 'node:assert';
import { BoardEngine, POWER_TYPES } from '../../resources/js/PlanetBurst/engine/BoardEngine.js';

console.log('--- RUNNING PLANET BURST BOARD ENGINE UNIT TESTS ---');

// Helper to fill board with checkerboard pattern (zero matches)
function fillCheckerboard(engine) {
    for (let r = 0; r < engine.rows; r++) {
        for (let c = 0; c < engine.cols; c++) {
            const type = (r + c) % 2 === 0 ? 'planet_amber' : 'planet_cyan';
            engine.setTile(r, c, engine.createTile(r, c, type));
        }
    }
}

// 1. Test Board Initialization
{
    const engine = new BoardEngine(8, 8);
    const grid = engine.initBoard();

    assert.strictEqual(grid.length, 8, 'Grid should have 8 rows');
    assert.strictEqual(grid[0].length, 8, 'Grid should have 8 columns');

    const { hasMatches } = engine.findMatches();
    assert.strictEqual(hasMatches, false, 'Initial board should have NO immediate matches');
    assert.strictEqual(engine.hasPossibleMoves(), true, 'Initial board must have at least one valid move');
    console.log('✓ Test 1 Passed: Board initialization (no immediate matches & contains valid moves)');
}

// 2. Test Horizontal 3-Match Detection
{
    const engine = new BoardEngine(8, 8);
    engine.initBoard();
    fillCheckerboard(engine);

    // Set 3 horizontal matching ruby planets
    engine.setTile(0, 0, engine.createTile(0, 0, 'planet_ruby'));
    engine.setTile(0, 1, engine.createTile(0, 1, 'planet_ruby'));
    engine.setTile(0, 2, engine.createTile(0, 2, 'planet_ruby'));

    const { hasMatches, matches } = engine.findMatches();
    assert.strictEqual(hasMatches, true, 'Should detect horizontal match');
    const match = matches.find(m => m.direction === 'horizontal');
    assert.ok(match, 'Horizontal match must be found');
    assert.strictEqual(match.length, 3, 'Match length should be 3');
    console.log('✓ Test 2 Passed: Horizontal 3-match detected correctly');
}

// 3. Test Vertical 3-Match Detection
{
    const engine = new BoardEngine(8, 8);
    engine.initBoard();
    fillCheckerboard(engine);

    // Set 3 vertical matching purple planets
    engine.setTile(1, 4, engine.createTile(1, 4, 'planet_purple'));
    engine.setTile(2, 4, engine.createTile(2, 4, 'planet_purple'));
    engine.setTile(3, 4, engine.createTile(3, 4, 'planet_purple'));

    const { hasMatches, matches } = engine.findMatches();
    assert.strictEqual(hasMatches, true, 'Should detect vertical match');
    const match = matches.find(m => m.direction === 'vertical');
    assert.ok(match, 'Vertical match must be found');
    assert.strictEqual(match.length, 3, 'Match length should be 3');
    console.log('✓ Test 3 Passed: Vertical 3-match detected correctly');
}

// 4. Test 4-Match Spawns Hyper Comet Power
{
    const engine = new BoardEngine(8, 8);
    engine.initBoard();
    fillCheckerboard(engine);

    engine.setTile(2, 0, engine.createTile(2, 0, 'planet_ruby'));
    engine.setTile(2, 1, engine.createTile(2, 1, 'planet_ruby'));
    engine.setTile(2, 2, engine.createTile(2, 2, 'planet_ruby'));
    engine.setTile(2, 3, engine.createTile(2, 3, 'planet_ruby'));

    const { matches } = engine.findMatches();
    const { powersToSpawn } = engine.resolveMatches(matches);

    assert.strictEqual(powersToSpawn.length, 1, 'Should generate 1 power');
    assert.strictEqual(powersToSpawn[0].power, POWER_TYPES.COMET_H, '4 horizontal match must spawn horizontal comet');
    console.log('✓ Test 4 Passed: 4-match creates Hyper Comet');
}

// 5. Test 5-Match Spawns Supernova Core
{
    const engine = new BoardEngine(8, 8);
    engine.initBoard();
    fillCheckerboard(engine);

    for (let c = 1; c <= 5; c++) {
        engine.setTile(4, c, engine.createTile(4, c, 'planet_purple'));
    }

    const { matches } = engine.findMatches();
    const { powersToSpawn } = engine.resolveMatches(matches);

    assert.strictEqual(powersToSpawn.length, 1, 'Should generate 1 power');
    assert.strictEqual(powersToSpawn[0].power, POWER_TYPES.SUPERNOVA, '5 match must spawn Supernova Core');
    console.log('✓ Test 5 Passed: 5-match creates Supernova Core');
}

// 6. Test L/T-Match Spawns Black Hole
{
    const engine = new BoardEngine(8, 8);
    engine.initBoard();
    fillCheckerboard(engine);

    // Create T-shape of solar planets centered at (3, 3)
    engine.setTile(3, 2, engine.createTile(3, 2, 'planet_solar'));
    engine.setTile(3, 3, engine.createTile(3, 3, 'planet_solar'));
    engine.setTile(3, 4, engine.createTile(3, 4, 'planet_solar'));
    engine.setTile(4, 3, engine.createTile(4, 3, 'planet_solar'));
    engine.setTile(5, 3, engine.createTile(5, 3, 'planet_solar'));

    const { matches } = engine.findMatches();
    const { powersToSpawn } = engine.resolveMatches(matches);

    assert.ok(powersToSpawn.some(p => p.power === POWER_TYPES.BLACK_HOLE), 'T-match must spawn Black Hole');
    console.log('✓ Test 6 Passed: T-match creates Black Hole Singularity');
}

// 7. Test Gravity & Refill
{
    const engine = new BoardEngine(8, 8);
    engine.initBoard();

    // Clear bottom row cells in column 0
    engine.setTile(7, 0, null);
    engine.setTile(6, 0, null);

    const { drops, spawns } = engine.applyGravityAndRefill();
    assert.ok(drops.length > 0, 'Tiles above should drop down');
    assert.ok(spawns.length > 0, 'New tiles should spawn to refill top');

    for (let r = 0; r < 8; r++) {
        assert.notStrictEqual(engine.getTile(r, 0), null, 'No cells should remain empty after gravity & refill');
    }
    console.log('✓ Test 7 Passed: Gravity and column refill completed without null cells');
}

// 8. Test Reshuffle on Deadlock
{
    const engine = new BoardEngine(8, 8);
    engine.initBoard();

    const reshuffled = engine.reshuffle();
    assert.strictEqual(reshuffled, true, 'Reshuffle must succeed');
    assert.strictEqual(engine.hasPossibleMoves(), true, 'Reshuffled board must contain at least one valid move');
    console.log('✓ Test 8 Passed: Reshuffle guarantees playable board');
}

console.log('--- ALL PLANET BURST BOARD ENGINE UNIT TESTS PASSED! ---');
