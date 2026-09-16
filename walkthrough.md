# Planet Burst — Cosmic Match-3 Puzzle Game

**Planet Burst** is a production-ready, original cosmic match-3 puzzle game built inside the Laravel + Vue 3 + Inertia + Capacitor application, coexisting cleanly with Guess-X.

---

## Architecture & Coexistence

### Web & API Routing
* **`GET /`**: Launches the main **Planet Burst** interface (`PlanetBurstController@index`)
* **`GET /planet-burst`**: Direct route to Planet Burst
* **`GET /guess-x`**: Preserves the existing **Guess-X** Word Game intact with all stats, modals, and auth (`GameController@index`)
* **`GET /api/planet-burst/*`**: RESTful endpoints for worlds, levels, game sessions, anti-cheat validation, leaderboards, and daily missions

### Database Schema (MySQL `planet-burst`)
1. `planet_burst_worlds`: Planetary regions (Earth Orbit, Lunar Base, Mars Ridge, Jupiter Storm, Saturn Rings, Deep Cosmos)
2. `planet_burst_levels`: 18 missions with data-driven schemas (objectives, moves, stars, obstacles)
3. `planet_burst_level_progress`: Player stars, highest score, completed timestamp
4. `planet_burst_game_sessions`: Cryptographic session tokens, seed, and anti-cheat tracking
5. `planet_burst_scores`: Verified score logs
6. `planet_burst_daily_missions`: Daily rotating cosmic challenge
7. `planet_burst_daily_scores`: High scores for today's challenge

---

## Core Systems Implemented

### 1. Match-3 Board Engine (`BoardEngine.js`)
* **Grid Dimension:** Configurable (standard 8x8)
* **Celestial Tile Entities:**
  - 🪐 **Ringed Amber Planet**
  - 🌍 **Terra Cyan Planet**
  - 🟣 **Nebula Purple Orb**
  - 🔴 **Crimson Star**
  - ❄️ **Frost Comet**
  - ☀️ **Solar Core**
* **Matching Logic:** 3, 4, 5+ linear matches (horizontal & vertical), intersecting L and T shape detection.
* **Power Tile Mechanics:**
  - **4-Match:** ☄️ **Hyper Comet** (Clears full row or full column with laser beam)
  - **5-Match:** 🌟 **Supernova Core** (Wipes all tiles of chosen cosmic type)
  - **L/T-Match:** 🕳️ **Black Hole Singularity** (Collapses 3x3 surrounding radius)
  - **Power Combos:** Comet + Comet, Comet + Black Hole, Supernova + Supernova (Universal Burst)
* **Obstacles Engine:**
  - 🧊 **Cosmic Ice**: Traps cells; shattered by matching adjacent tiles
  - 🔒 **Gravity Lock**: Freezes tile movement until cleared
  - 🪨 **Asteroid Rock**: Solid celestial debris
* **Gravity & Cascades:** Automatic drop calculations, continuous cascade evaluation loop until equilibrium.
* **Deadlock Detection & Reshuffle:** Detects when zero legal moves exist and automatically reshuffles board into a guaranteed playable state.

### 2. Audio Synthesizer (`useAudio.js`)
* Built with Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`).
* Zero external copyrighted files; instant latency-free celestial sound effects for swaps, invalid bumps, matches, comets, black holes, supernovas, victory fanfare, and failure cues.
* Mute toggle persisted to `localStorage`.

### 3. Server Security & Anti-Cheat (`GameEngineService.php`)
* Unique session tokens generated per game attempt.
* Server-side boundary checks on score limits and move consumption.
* Replay-attack prevention (rejects submissions to already finalized sessions).

---

## Verification & Test Results

### 1. Automated PHPUnit Test Suite
```text
PASS  Tests\Unit\ExampleTest
PASS  Tests\Unit\WordGameServiceTest (10 tests)
PASS  Tests\Feature\AuthControllerTest (8 tests)
PASS  Tests\Feature\ExampleTest (1 test)
PASS  Tests\Feature\GameControllerTest (5 tests)
PASS  Tests\Feature\PlanetBurstApiControllerTest (9 tests)
  ✓ planet burst home renders successfully
  ✓ guess x route remains intact
  ✓ api returns worlds collection
  ✓ start game session
  ✓ complete level success
  ✓ anti cheat blocks duplicate finalization
  ✓ anti cheat blocks excessive moves
  ✓ leaderboard returns rankings
  ✓ daily mission endpoint

Tests:    34 passed (160 assertions)
Duration: 2.43s
```

### 2. Automated BoardEngine Unit Tests (Node.js)
```text
--- RUNNING PLANET BURST BOARD ENGINE UNIT TESTS ---
✓ Test 1 Passed: Board initialization (no immediate matches & contains valid moves)
✓ Test 2 Passed: Horizontal 3-match detected correctly
✓ Test 3 Passed: Vertical 3-match detected correctly
✓ Test 4 Passed: 4-match creates Hyper Comet
✓ Test 5 Passed: 5-match creates Supernova Core
✓ Test 6 Passed: T-match creates Black Hole Singularity
✓ Test 7 Passed: Gravity and column refill completed without null cells
✓ Test 8 Passed: Reshuffle guarantees playable board
--- ALL PLANET BURST BOARD ENGINE UNIT TESTS PASSED! ---
```

### 3. Browser End-to-End Playtesting
* **Home Screen:** Verified dark cosmic aesthetic, glowing Saturn logo, and all navigation buttons.
* **Gameplay Swaps:** Clicked tile (1,2) and swapped with (2,2) to trigger horizontal match-3:
  - Tiles popped with animations and sound chimes.
  - Cascades dropped replacement tiles from the top.
  - Move count decremented: `25 -> 24`.
  - Cosmic score incremented: `0 -> 60`.
* **Galaxy Map:** Verified all 6 cosmic regions (Earth Orbit, Lunar Base, Mars Ridge, Jupiter Storm, Saturn Rings, Deep Cosmos) and 18 mission nodes.
* **Modals:** Verified Settings, Cosmic Powers Codex, and Rankings modals.
* **Guess-X Regression:** Verified Guess-X remains accessible at `/guess-x`.
