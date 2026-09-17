# Planet Burst — Deep Space Match-3 Adventure

A production-grade, cosmic-themed Match-3 puzzle game featuring 100 hand-crafted levels across 10 celestial worlds, tactical boosters, Candy Crush-inspired special power combos, an interactive constellation galaxy map, and full Android native packaging via Capacitor.

Built with **Laravel 12**, **Vue 3 (Composition API)**, **Inertia.js**, **Tailwind CSS**, and **Capacitor Android**.

---

## 🌌 Game Concept & Features

### 1. 🪐 10 Celestial Worlds & 100 Mission Levels
- **10 Unique Worlds:**
  1. *Solar Expanse* (Levels 1–10) — Terrestrial basics & initial energy collection.
  2. *Asteroid Belt* (Levels 11–20) — Rocky obstacles & score velocity challenges.
  3. *Crimson Rings* (Levels 21–30) — Gas giant atmospheric puzzles.
  4. *Cryo Nebula* (Levels 31–40) — Frost hazards & frozen crystal extraction.
  5. *Solar Flare Realm* (Levels 41–50) — Plasma firestorms & rapid turns.
  6. *Void Singularity* (Levels 51–60) — Gravitational vortex mechanics.
  7. *Emerald Horizon* (Levels 61–70) — Bioluminescent alien energy grids.
  8. *Stellar Nursery* (Levels 71–80) — High-density star creation puzzles.
  9. *Pulsar Nexus* (Levels 81–90) — Rapid energy bursts & pulse rhythms.
  10. *Galactic Core* (Levels 91–100) — The ultimate cosmic challenge.

### 2. ⚡ Special Celestial Powers & Combinations
- **4-in-a-Line:** Creates a **Striped Beam Planet** (clears an entire row or column when detonated).
- **T-Shape or L-Shape (5 matched):** Generates a **Cosmic Plasma Bomb** (blasts a $3 \times 3$ grid around the target).
- **5-in-a-Line:** Forges a glowing **Supernova Core** (swapping with any normal planet vaporizes every tile of that color).
- **Tactical Power Swaps & Combos:**
  - **Striped + Striped:** Dual cross beam obliterates an entire row and column simultaneously.
  - **Bomb + Bomb:** Giant Super-Blast detonates a massive $5 \times 5$ grid (25 tiles).
  - **Bomb + Striped:** Triple cross beam clears 3 full rows and 3 full columns simultaneously.
  - **Supernova + Striped:** Transforms every planet of the matched color into a Striped Planet and triggers a chain reaction.
  - **Supernova + Bomb:** Transforms every planet of the matched color into Plasma Bombs and triggers an explosive wave.
  - **Supernova + Supernova:** Cataclysmic cosmic board wipe, vaporizing every celestial body on the grid.
  - **Strict Match Mechanics:** Swapping a single special tile with a normal tile requires a valid 3+ match to detonate; non-matching normal swaps revert cleanly.

### 3. 🚀 In-Game Tactical Boosters
- **Cosmic Smasher (Hammer):** Vaporizes any targeted single tile without expending a move.
- **UFO Orbital Shuffle:** Summons an alien scout craft to redistribute all planets on the board.
- **Ion Ray Disruptor:** Emits a high-energy particle line that purges an entire horizontal or vertical axis.
- **Free Quantum Swap:** Swaps two adjacent planets without consuming a precious turn.

### 4. 🗺️ Constellation Galaxy Map & Mission Pods
- **Interactive SVG Constellation Path:** Smooth bezier trajectory connecting all 100 level nodes with star badges and locked/unlocked state visuals.
- **Pre-Level Mission Briefing Modal:** View mission targets, planet goals, move allocations, and select active boosters before launch.
- **Mission Objective Pod:** Floating glassmorphic HUD showing miniature 3D SVG planet icons and dynamic progress indicators.
- **Dynamic Liquid Plasma Star Meter:** Real-time animated score bar illuminating 1, 2, and 3-star milestone nodes.

### 5. 📳 Mobile Packaging & Haptics
- **Capacitor 8.5 Android Integration:** Full Android Studio project with custom splash screen, portrait lock, and dark status bars.
- **Web Haptics API:** Custom tactile vibration feedback on swaps, 4-matches, 5-matches, and explosive power combos.

---

## 💻 1. Cloning & Local Setup

Follow these steps to run Planet Burst on your local machine:

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/planet-burst.git
cd planet-burst
```

### Step 2: Install Dependencies
```bash
composer install
npm install
```

### Step 3: Configure Environment (`.env`)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
php artisan key:generate
```

Ensure your database settings are configured:
```ini
APP_NAME="Planet Burst"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost/planet-burst/public

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=planet-burst
DB_USERNAME=root
DB_PASSWORD=root
```

### Step 4: Run Migrations and Seeders
```bash
php artisan migrate:fresh --seed
```
This populates the database with:
- 10 Celestial Worlds
- 100 Hand-crafted Levels
- Default player progress and leaderboard records

### Step 5: Build Assets & Start Dev Server
```bash
npm run build
```
Or start the Vite watcher:
```bash
npm run dev
```

Visit the application at:
```
http://localhost/planet-burst/public
```

---

## 📱 2. Android Mobile Packaging (Capacitor)

Planet Burst includes a ready-to-build Android wrapper configured with Capacitor.

### Configuration (`capacitor.config.json`)
```json
{
  "appId": "com.company.planet-burst",
  "appName": "Planet Burst",
  "webDir": "public/build",
  "server": {
    "url": "http://192.168.1.180/planet-burst/public",
    "cleartext": true
  },
  "android": {
    "allowMixedContent": true,
    "captureInput": true,
    "backgroundColor": "#030712"
  }
}
```

### Sync & Run in Android Studio
```bash
npx cap sync android
npx cap open android
```
- In Android Studio, click **Run** (Green play button) on your connected phone or emulator.
- For local Wi-Fi live testing, update `server.url` in `capacitor.config.json` with your local IP address.

---

## 🧪 3. Running Automated Tests

Run the backend PHPUnit test suite:
```bash
php artisan test
```

Tests cover:
- World & Level API endpoints (`/api/planet-burst/worlds`, `/api/planet-burst/levels/{id}`)
- Score submission and leaderboard verification
- Game state persistence
- Route redirects and authentication safety

---

## 🛠️ Tech Stack & Architecture

- **Backend:** Laravel 12, PHP 8.3, Eloquent ORM, MySQL
- **Frontend:** Vue 3 (Composition API), Inertia.js, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Audio & Haptics:** Web Audio API synth oscillators (zero external MP3 dependencies) + Web Vibration API
- **Mobile Engine:** Capacitor 8.5 Android Native Bridge
- **Coding Standards:** PSR-12, SOLID Principles, Thin Controllers, Typed Services
