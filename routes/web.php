<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\PlanetBurst\PlanetBurstController;
use Illuminate\Support\Facades\Route;

// YB - 16-09-2026 Planet Burst cosmic match-3 game routes
Route::get('/', [PlanetBurstController::class, 'index'])->name('planet-burst.home');
Route::get('/planet-burst', [PlanetBurstController::class, 'index'])->name('planet-burst.index');

// YB - 17-09-2026 Legacy redirect to Planet Burst home
Route::redirect('/guess-x', '/')->name('game.index');

// YB - 15-09-2026 Google OAuth Authentication routes
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback'])->name('auth.google.callback');
