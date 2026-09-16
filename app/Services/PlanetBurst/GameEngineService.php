<?php

namespace App\Services\PlanetBurst;

use App\Models\PlanetBurstGameSession;
use App\Models\PlanetBurstLevel;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use InvalidArgumentException;

class GameEngineService
{
    /**
     * Create a new validated game session.
     *
     * // YB - 16-09-2026 Generate new mission game session with unique token
     */
    public function createSession(?int $userId, ?int $levelId, bool $isDaily = false): PlanetBurstGameSession
    {
        $session = PlanetBurstGameSession::create([
            'session_token' => Str::random(40) . '_' . bin2hex(random_bytes(8)),
            'user_id' => $userId,
            'level_id' => $levelId,
            'is_daily' => $isDaily,
            'status' => 'active',
            'seed' => mt_rand(100000, 99999999),
            'started_at' => Carbon::now(),
        ]);

        Log::info("PlanetBurst session initiated [Token: {$session->session_token}, User: {$userId}, Level: {$levelId}]");

        return $session;
    }

    /**
     * Validate score submission against session rules and anti-cheat boundaries.
     *
     * // YB - 16-09-2026 Anti-cheat validation of submitted score, moves, and session status
     */
    public function validateAndCompleteSession(
        PlanetBurstGameSession $session,
        int $score,
        int $stars,
        int $movesUsed,
        bool $completed
    ): bool {
        if ($session->status !== 'active') {
            Log::warning("PlanetBurst suspicious score submission: Session already {$session->status} [Token: {$session->session_token}]");
            throw new InvalidArgumentException('This game session has already been finalized.');
        }

        $level = $session->level;
        if ($level) {
            $maxAllowedMoves = $level->move_limit + 5; // Allow minor buffer for cascades/re-sync
            if ($movesUsed > $maxAllowedMoves) {
                Log::warning("PlanetBurst anti-cheat: Moves used ({$movesUsed}) exceeds limit ({$maxAllowedMoves}) [Token: {$session->session_token}]");
                throw new InvalidArgumentException('Moves used exceeds permissible boundary.');
            }

            // Sanity check: Maximum theoretically achievable score per move
            $maxScorePerMove = 50000;
            $absoluteMaxScore = max(50000, ($movesUsed + 1) * $maxScorePerMove);
            if ($score < 0 || $score > $absoluteMaxScore) {
                Log::warning("PlanetBurst anti-cheat: Score ({$score}) outside valid range [Token: {$session->session_token}]");
                throw new InvalidArgumentException('Submitted score failed physical sanity validation.');
            }

            if ($stars < 0 || $stars > 3) {
                throw new InvalidArgumentException('Star rating must be between 0 and 3.');
            }
        }

        $session->status = $completed ? 'completed' : 'failed';
        $session->final_score = $score;
        $session->moves_used = $movesUsed;
        $session->completed_at = Carbon::now();
        $session->save();

        Log::info("PlanetBurst session finalized [Token: {$session->session_token}, Status: {$session->status}, Score: {$score}]");

        return true;
    }
}
