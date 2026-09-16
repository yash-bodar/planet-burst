<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use Illuminate\Support\Facades\Route;

// YB - 15-09-2026 Authentication API routes with session support
Route::prefix('auth')->middleware(['web'])->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->name('api.auth.login');
    Route::post('/register', [AuthController::class, 'register'])->name('api.auth.register');
    Route::post('/logout', [AuthController::class, 'logout'])->name('api.auth.logout');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('api.auth.forgot-password');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('api.auth.reset-password');
    Route::post('/change-password', [AuthController::class, 'changePassword'])->name('api.auth.change-password');
    Route::get('/user', [AuthController::class, 'user'])->name('api.auth.user');
});

// YB - 15-09-2026 Game API routes with rate limiting protection (60 requests per minute)
Route::prefix('game')->middleware('throttle:60,1')->group(function () {
    Route::post('/start', [GameController::class, 'start'])->name('api.game.start');
    Route::post('/{game}/guess', [GameController::class, 'guess'])->name('api.game.guess');
    Route::get('/{game}', [GameController::class, 'show'])->name('api.game.show');
});

// YB - 16-09-2026 Planet Burst Cosmic Game API routes with rate limiting
Route::prefix('planet-burst')->middleware(['web', 'throttle:100,1'])->group(function () {
    Route::get('/worlds', [\App\Http\Controllers\PlanetBurst\PlanetBurstApiController::class, 'worlds'])->name('api.planet-burst.worlds');
    Route::get('/worlds/{world}', [\App\Http\Controllers\PlanetBurst\PlanetBurstApiController::class, 'showWorld'])->name('api.planet-burst.worlds.show');
    Route::get('/levels', [\App\Http\Controllers\PlanetBurst\PlanetBurstApiController::class, 'levels'])->name('api.planet-burst.levels');
    Route::get('/levels/{level}', [\App\Http\Controllers\PlanetBurst\PlanetBurstApiController::class, 'showLevel'])->name('api.planet-burst.levels.show');

    Route::post('/game-session', [\App\Http\Controllers\PlanetBurst\PlanetBurstApiController::class, 'startSession'])->name('api.planet-burst.game-session');
    Route::post('/levels/{level}/complete', [\App\Http\Controllers\PlanetBurst\PlanetBurstApiController::class, 'completeLevel'])->name('api.planet-burst.levels.complete');

    Route::get('/leaderboard', [\App\Http\Controllers\PlanetBurst\PlanetBurstApiController::class, 'leaderboard'])->name('api.planet-burst.leaderboard');
    Route::get('/daily-mission', [\App\Http\Controllers\PlanetBurst\PlanetBurstApiController::class, 'dailyMission'])->name('api.planet-burst.daily-mission');
    Route::post('/daily-mission/score', [\App\Http\Controllers\PlanetBurst\PlanetBurstApiController::class, 'submitDailyScore'])->name('api.planet-burst.daily-mission.score');
});
