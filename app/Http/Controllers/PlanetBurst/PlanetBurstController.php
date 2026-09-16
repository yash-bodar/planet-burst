<?php

namespace App\Http\Controllers\PlanetBurst;

use App\Http\Controllers\Controller;
use App\Services\PlanetBurst\DailyMissionService;
use App\Services\PlanetBurst\LeaderboardService;
use App\Services\PlanetBurst\MissionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PlanetBurstController extends Controller
{
    /**
     * PlanetBurstController constructor with service injection.
     *
     * // YB - 16-09-2026 Constructor dependency injection for Planet Burst services
     */
    public function __construct(
        protected MissionService $missionService,
        protected LeaderboardService $leaderboardService,
        protected DailyMissionService $dailyMissionService
    ) {}

    /**
     * Display the main Planet Burst cosmic game screen.
     *
     * // YB - 16-09-2026 Render main Planet Burst Inertia interface with initial payload
     */
    public function index(Request $request): Response
    {
        $userId = $request->user()?->id;

        return Inertia::render('PlanetBurst/Index', [
            'initialWorlds' => $this->missionService->getWorldsWithProgress($userId),
            'initialLeaderboard' => $this->leaderboardService->getGlobalLeaderboard(20),
            'initialDaily' => $this->dailyMissionService->getTodayMissionForUser($userId),
        ]);
    }
}
