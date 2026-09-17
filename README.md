# 🪐 Planet Burst — Deep Space Match-3 Adventure

A production-ready, cosmic-themed Match-3 puzzle game featuring 100 hand-crafted levels across 10 celestial worlds, Candy Crush-inspired special power combinations, tactical boosters, an interactive constellation galaxy map, dynamic liquid plasma score meter, synthesizer audio, physical haptic feedback, and complete Android native packaging via Capacitor.

Built with **Laravel 12**, **Vue 3 (Composition API)**, **Inertia.js**, **Tailwind CSS v4**, and **Capacitor 8.5 Android**.

---

## 📋 Table of Contents
1. [Game Overview & Features](#-game-overview--features)
2. [Special Celestial Powers & Combos Matrix](#-special-celestial-powers--combos-matrix)
3. [Tactical Booster Arsenal](#-tactical-booster-arsenal)
4. [Prerequisites Checklist](#-prerequisites-checklist)
5. [Step-by-Step Local Setup Guide](#-step-by-step-local-setup-guide)
6. [Complete Android Mobile App Guide (Capacitor)](#-complete-android-mobile-app-guide-capacitor)
   - [Development Mode (Live Wi-Fi Hot Reload)](#1-development-mode-live-wi-fi-hot-reload)
   - [Standalone Offline / Production APK Build](#2-standalone-offline--production-apk-build)
   - [Generating a Signed Release APK / Google Play AAB](#3-generating-a-signed-release-apk--google-play-aab)
7. [Troubleshooting & FAQs](#-troubleshooting--faqs)
8. [Automated Testing](#-automated-testing)
9. [Tech Stack & Architecture](#-tech-stack--architecture)

---

## 🌌 Game Overview & Features

### 1. 🪐 10 Celestial Worlds & 100 Hand-Crafted Levels
- **10 Thematic Worlds:**
  1. *Solar Expanse* (Levels 1–10) — Terrestrial basics & initial celestial energy collection.
  2. *Asteroid Belt* (Levels 11–20) — Rocky obstacles & score velocity challenges.
  3. *Crimson Rings* (Levels 21–30) — Atmospheric puzzles around gas giants.
  4. *Cryo Nebula* (Levels 31–40) — Frost hazards & frozen crystal extraction.
  5. *Solar Flare Realm* (Levels 41–50) — Plasma firestorms & high-intensity move limits.
  6. *Void Singularity* (Levels 51–60) — Gravitational vortex mechanics.
  7. *Emerald Horizon* (Levels 61–70) — Bioluminescent alien energy grids.
  8. *Stellar Nursery* (Levels 71–80) — High-density star creation puzzles.
  9. *Pulsar Nexus* (Levels 81–90) — Rapid energy bursts & pulse rhythms.
  10. *Galactic Core* (Levels 91–100) — The ultimate cosmic challenge.

### 2. 🗺️ Interactive Constellation Galaxy Map
- Smooth bezier constellation path connecting all 100 levels.
- Star milestones (1, 2, and 3 stars) with persistent progression tracking.
- Pre-level **Mission Briefing Modal** displaying level targets, turn limits, and active booster loadouts.

### 3. 🎯 Mission Objective Pod & Liquid Plasma Star Meter
- **Mission Objective Pod:** Floating glassmorphic HUD showing miniature 3D SVG planet icons, live target counters, and animated gold checkmarks.
- **Liquid Plasma Star Meter:** Real-time flowing plasma bar with three physical 3D star milestone nodes that ignite with golden halos when achieved.

### 4. 🎵 Synthesizer Audio & Haptic Feedback
- **Web Audio API Synth:** Zero external MP3 downloads — dynamic procedural audio chords, match chimes, laser beams, and explosion rumbles generated in real time.
- **Haptic Vibration:** Tactile vibration pulses on matches, cascades, and massive screen-clearing combos.

---

## ⚡ Special Celestial Powers & Combos Matrix

### Individual Powers
| Match Pattern | Created Celestial Body | Visual Effect & Detonation |
| :--- | :--- | :--- |
| **4 in a row / column** | **Striped Beam Comet** | Emits a high-energy laser beam clearing an entire row or column. |
| **T-Shape or L-Shape (5 matched)** | **Cosmic Plasma Bomb** | Detonates in a $3 \times 3$ grid explosion vaporizing 9 surrounding tiles. |
| **5 in a straight line** | **Supernova Core** | Swapping with a normal planet vaporizes every tile of that color on the board. |

*Note: Swapping a single Striped Comet or Plasma Bomb with a normal planet requires a valid 3+ match of that planet's color. Non-matching swaps cleanly bounce back without penalty.*

### Power + Power Combos Matrix
When two special celestial bodies are swapped with each other, they unleash devastating combo attacks:
- **Striped + Striped:** Dual cross laser obliterating an entire row and column simultaneously.
- **Bomb + Bomb:** Giant Super-Blast detonating a massive $5 \times 5$ grid (25 tiles).
- **Bomb + Striped:** Triple cross beam clearing 3 full rows and 3 full columns simultaneously.
- **Supernova + Striped:** Transforms all planets of that color into Striped Comets and detonates them across the screen.
- **Supernova + Bomb:** Transforms all planets of that color into Plasma Bombs and detonates them simultaneously.
- **Supernova + Supernova:** Cataclysmic Universal Burst vaporizing every celestial body on the entire 8×8 board.

---

## 🚀 Tactical Booster Arsenal

Players can deploy in-game tactical boosters without consuming a standard turn:
- 🔨 **Cosmic Smasher (Hammer):** Vaporizes any targeted single planet or obstacle.
- 🛸 **UFO Orbital Shuffle:** Summons an alien scout craft to reshuffle and redistribute all planets on the board.
- ⚡ **Ion Ray Disruptor:** Emits a particle beam that sweeps an entire row or column.
- 🔄 **Free Quantum Swap:** Swaps two adjacent planets without consuming a move turn.

---

## 🛠️ Prerequisites Checklist

Ensure your development workstation has the following installed:

- **PHP:** 8.2 or 8.3 (with `pdo_mysql`, `mbstring`, `openssl`, `bcmath`, `curl`, `xml`, `fileinfo`)
- **Composer:** 2.x
- **Node.js:** 18.x or 20.x LTS & **npm**
- **MySQL / MariaDB:** 8.0+ (Included with [Laragon](https://laragon.org/) or [XAMPP](https://www.apachefriends.org/))
- **Git**
- *(For Android packaging)*:
  - **Android Studio** (Hedgehog, Iguana, Ladybug or later)
  - **Java Development Kit (JDK):** JDK 17 or JDK 21
  - **Android SDK:** API Level 34 or 35 + SDK Command-line Tools

---

## 💻 Step-by-Step Local Setup Guide

Follow these exact steps when cloning this repository to a new computer:

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/planet-burst.git
cd planet-burst
```

### Step 2: Install PHP & Node Dependencies
```bash
composer install
npm install
```

### Step 3: Configure Environment (`.env`)
Duplicate the example environment configuration:
```bash
cp .env.example .env
php artisan key:generate
```

Open `.env` and verify your local database settings:
```ini
APP_NAME="Planet Burst"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost/planet-burst/public

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=planet-burst
DB_USERNAME=root
DB_PASSWORD=root
```
*(If your MySQL root password is empty, set `DB_PASSWORD=`)*

### Step 4: Create Database & Seed 100 Levels
Make sure your MySQL service is running, then run:
```bash
php artisan migrate:fresh --seed
```
This migration and seeder automatically:
- Creates the `worlds`, `levels`, `user_level_progress`, and `planet_burst_scores` tables.
- Seeds all **10 Celestial Worlds** and **100 handcrafted Levels** with targeted move limits, required celestial goals, and score star thresholds.
- Initializes default player progress.

### Step 5: Build Assets & Run Development Server

#### Option A: Quick Dev Server
In two separate terminal tabs:
```bash
# Terminal 1: Watch Vite frontend assets
npm run dev

# Terminal 2: Laravel backend server
php artisan serve
```
Access the game at `http://127.0.0.1:8000`.

#### Option B: Laragon / Local Apache Web Server
If using Laragon or XAMPP:
```bash
npm run build
```
Visit `http://localhost/planet-burst/public` (or your virtual host, e.g. `http://planet-burst.test`).

---

## 📱 Complete Android Mobile App Guide (Capacitor)

Planet Burst comes with a pre-configured Android project powered by **Capacitor 8.5**. You can run the game on your physical Android phone or build a standalone release APK/AAB.

The Android native project is located in the [`android/`](file:///c:/laragon/www/planet-burst/android) folder.

---

### 1. Development Mode (Live Wi-Fi Hot Reload)
This mode connects your mobile app directly to your local computer server over your local Wi-Fi network, allowing instant live updates.

#### A. Find Your Computer's Local IP Address
On Windows PowerShell:
```powershell
ipconfig
```
Look for `IPv4 Address` under your active Wi-Fi adapter (e.g. `192.168.1.180`).

#### B. Update `capacitor.config.json`
Set `server.url` to your computer's local IP pointing to the Laravel app:
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
*(Make sure `"cleartext": true` is present to allow local HTTP connections on Android).*

#### C. Sync & Launch in Android Studio
```bash
npm run build
npx cap sync android
npx cap open android
```
1. Android Studio will open the `android/` directory.
2. Connect your Android device via USB with **Developer Options > USB Debugging** enabled (or start an Android Virtual Device emulator).
3. Ensure both your computer and phone are connected to the **same Wi-Fi network**.
4. Click the green **Run (Play)** button in Android Studio.
5. The game will launch natively on your phone!

---

### 2. Standalone Offline / Production APK Build
This mode bundles the web assets directly into the APK so the game runs **100% offline** without needing a local Wi-Fi server.

#### A. Adjust `capacitor.config.json`
Remove or comment out the `server` block:
```json
{
  "appId": "com.company.planet-burst",
  "appName": "Planet Burst",
  "webDir": "public/build",
  "android": {
    "allowMixedContent": true,
    "captureInput": true,
    "backgroundColor": "#030712"
  }
}
```

#### B. Build & Sync Web Assets
```bash
npm run build
npx cap sync android
```

#### C. Build Debug APK via Command Line
You can build the APK directly without opening Android Studio:
```bash
cd android
./gradlew assembleDebug
```
*(On Windows PowerShell, use `.\gradlew assembleDebug`)*

Once compilation finishes, your installable debug APK will be located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```
You can transfer this APK directly to any Android phone and install it.

---

### 3. Generating a Signed Release APK / Google Play AAB

To distribute the game publicly or publish on the Google Play Store:

#### Step 1: Generate a Release Keystore
If you don't already have a signing keystore, run:
```bash
keytool -genkey -v -keystore planet-burst-release.jks -alias planetburst-alias -keyalg RSA -keysize 2048 -validity 10000
```
Store `planet-burst-release.jks` in a secure location and remember your keystore password.

#### Step 2: Build Signed Bundle or APK in Android Studio
1. Open Android Studio: `npx cap open android`
2. In the top menu, go to **Build > Generate Signed Bundle / APK...**
3. Choose:
   - **Android App Bundle (.aab)** for Google Play Store upload.
   - **APK (.apk)** for direct sideloading and distribution.
4. Select your `planet-burst-release.jks` keystore file, enter the password and key alias.
5. Select the **release** build variant and click **Finish**.
6. Your production binary will be generated in:
   - APK: `android/app/release/app-release.apk`
   - AAB: `android/app/release/app-release.aab`

---

## ❓ Troubleshooting & FAQs

### 1. "Failed to connect to /192.168.1.xxx" on Android
- **Cause:** Your phone and computer are not on the same Wi-Fi network, or Windows Firewall is blocking incoming HTTP requests.
- **Solution:** 
  1. Verify both devices share the exact same Wi-Fi network.
  2. In Windows Defender Firewall, allow Apache HTTP Server or port 80/8000.
  3. Test opening `http://192.168.1.xxx/planet-burst/public` in Chrome on your phone's browser first.

### 2. "Cleartext HTTP traffic not permitted" on Android
- **Cause:** Android 9+ blocks insecure `http://` network traffic by default.
- **Solution:** Ensure `"cleartext": true` is present under `"server"` in `capacitor.config.json`, and run `npx cap sync android`.

### 3. Vite Build / Blank Screen Error
- **Cause:** Production assets were not built before running the app.
- **Solution:** Always run `npm run build` whenever code changes are made.

### 4. Database Seeding Errors
- **Cause:** Database `planet-burst` does not exist or credentials in `.env` are mismatched.
- **Solution:** Open Adminer or MySQL CLI, run `CREATE DATABASE \`planet-burst\`;`, then re-run `php artisan migrate:fresh --seed`.

---

## 🧪 Automated Testing

Planet Burst includes a comprehensive PHPUnit test suite covering API routes, level progression, anti-cheat validation, and score calculation:

```bash
php artisan test
```

To run only the Planet Burst feature tests:
```bash
php artisan test --filter PlanetBurstApiControllerTest
```

---

## 🛠️ Tech Stack & Architecture

- **Backend:** Laravel 12, PHP 8.3, Eloquent ORM, MySQL
- **Frontend:** Vue 3 (Composition API), Inertia.js, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Audio Engine:** Web Audio API synth oscillators (procedural frequencies, zero latency)
- **Haptic Engine:** Web Vibration API with Capacitor native fallback
- **Mobile Engine:** Capacitor 8.5 Native Android Bridge
- **Coding Standards:** PSR-12, SOLID Principles, Thin Controllers, Typed Service Layer
