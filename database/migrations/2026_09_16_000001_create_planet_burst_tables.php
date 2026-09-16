<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * // YB - 16-09-2026 Create Planet Burst cosmic match-3 game schema tables
     */
    public function up(): void
    {
        // 1. Worlds / Planetary Regions
        Schema::create('planet_burst_worlds', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('order')->default(1);
            $table->string('name', 100);
            $table->string('icon', 30)->default('🪐');
            $table->text('description')->nullable();
            $table->string('background_theme', 50)->default('default');
            $table->timestamps();
        });

        // 2. Levels / Missions
        Schema::create('planet_burst_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('world_id')->constrained('planet_burst_worlds')->cascadeOnDelete();
            $table->unsignedInteger('level_number')->index();
            $table->string('title', 120);
            $table->string('difficulty', 20)->default('medium');
            $table->unsignedSmallInteger('rows')->default(8);
            $table->unsignedSmallInteger('columns')->default(8);
            $table->unsignedSmallInteger('move_limit')->default(25);
            $table->unsignedInteger('target_score')->default(5000);
            $table->json('star_thresholds');
            $table->json('objectives');
            $table->json('available_tiles');
            $table->json('obstacles')->nullable();
            $table->json('special_powers')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 3. Player Level Progression
        Schema::create('planet_burst_level_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('level_id')->constrained('planet_burst_levels')->cascadeOnDelete();
            $table->unsignedTinyInteger('stars')->default(0);
            $table->unsignedInteger('highest_score')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'level_id']);
        });

        // 4. Game Sessions for Anti-Cheat & Verification
        Schema::create('planet_burst_game_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_token', 64)->unique()->index();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('level_id')->nullable()->constrained('planet_burst_levels')->nullOnDelete();
            $table->boolean('is_daily')->default(false);
            $table->string('status', 20)->default('active'); // active, completed, failed
            $table->unsignedBigInteger('seed')->nullable();
            $table->unsignedSmallInteger('moves_used')->default(0);
            $table->unsignedInteger('final_score')->default(0);
            $table->string('checksum', 128)->nullable();
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
        });

        // 5. High Scores Record
        Schema::create('planet_burst_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();
            $table->foreignId('level_id')->constrained('planet_burst_levels')->cascadeOnDelete();
            $table->foreignId('game_session_id')->nullable()->constrained('planet_burst_game_sessions')->nullOnDelete();
            $table->unsignedInteger('score')->index();
            $table->unsignedTinyInteger('stars')->default(1);
            $table->unsignedSmallInteger('moves_used')->default(0);
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();
        });

        // 6. Daily Cosmic Missions
        Schema::create('planet_burst_daily_missions', function (Blueprint $table) {
            $table->id();
            $table->date('mission_date')->unique()->index();
            $table->string('title', 120);
            $table->unsignedInteger('target_score')->default(10000);
            $table->unsignedSmallInteger('move_limit')->default(22);
            $table->json('objectives');
            $table->timestamps();
        });

        // 7. Daily Scores Leaderboard
        Schema::create('planet_burst_daily_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('daily_mission_id')->constrained('planet_burst_daily_missions')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedInteger('score')->index();
            $table->unsignedSmallInteger('moves_used')->default(0);
            $table->timestamp('submitted_at')->useCurrent();
            $table->timestamps();

            $table->unique(['daily_mission_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * // YB - 16-09-2026 Drop Planet Burst cosmic tables in reverse order
     */
    public function down(): void
    {
        Schema::dropIfExists('planet_burst_daily_scores');
        Schema::dropIfExists('planet_burst_daily_missions');
        Schema::dropIfExists('planet_burst_scores');
        Schema::dropIfExists('planet_burst_game_sessions');
        Schema::dropIfExists('planet_burst_level_progress');
        Schema::dropIfExists('planet_burst_levels');
        Schema::dropIfExists('planet_burst_worlds');
    }
};
