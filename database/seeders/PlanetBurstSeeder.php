<?php

namespace Database\Seeders;

use App\Models\PlanetBurstLevel;
use App\Models\PlanetBurstWorld;
use Illuminate\Database\Seeder;

class PlanetBurstSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * // YB - 16-09-2026 Seed 10 celestial worlds and 100 progressive missions for Planet Burst
     */
    public function run(): void
    {
        $worldConfigs = [
            [
                'order' => 1,
                'name' => 'Earth Orbit',
                'icon' => '🌍',
                'description' => 'Atmospheric boundary with calm cosmic rays. Perfect sector for flight training.',
                'background_theme' => 'earth',
            ],
            [
                'order' => 2,
                'name' => 'Lunar Base',
                'icon' => '🌙',
                'description' => 'Craters and shadowed valleys encased in persistent interstellar frost.',
                'background_theme' => 'moon',
            ],
            [
                'order' => 3,
                'name' => 'Mars Ridge',
                'icon' => '🔴',
                'description' => 'Red iron valleys with erratic gravitational locks and volcanic dust.',
                'background_theme' => 'mars',
            ],
            [
                'order' => 4,
                'name' => 'Jupiter Storm',
                'icon' => '🟠',
                'description' => 'Great atmospheric vortices and jagged stray meteoroid belts.',
                'background_theme' => 'jupiter',
            ],
            [
                'order' => 5,
                'name' => 'Saturn Rings',
                'icon' => '💍',
                'description' => 'Glistening crystalline rings composed of frozen celestial shards.',
                'background_theme' => 'saturn',
            ],
            [
                'order' => 6,
                'name' => 'Neptune Abyss',
                'icon' => '🔵',
                'description' => 'Supersonic planetary winds and deep azure methane oceans.',
                'background_theme' => 'neptune',
            ],
            [
                'order' => 7,
                'name' => 'Solar Core',
                'icon' => '☀️',
                'description' => 'High-energy coronal loops and intense magnetic flares.',
                'background_theme' => 'sun',
            ],
            [
                'order' => 8,
                'name' => 'Nebula Nexus',
                'icon' => '🟣',
                'description' => 'Prismatic stellar nursery where newborn cosmic powers form.',
                'background_theme' => 'nebula',
            ],
            [
                'order' => 9,
                'name' => 'Asteroid Belt',
                'icon' => '☄️',
                'description' => 'Treacherous orbital field of solid asteroids and energy barriers.',
                'background_theme' => 'asteroid',
            ],
            [
                'order' => 10,
                'name' => 'Event Horizon',
                'icon' => '🕳️',
                'description' => 'The ultimate sector at the brink of an ancient supermassive singularity.',
                'background_theme' => 'singularity',
            ],
        ];

        $tilePools = [
            ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ruby'],
            ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ruby', 'planet_ice'],
            ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ruby', 'planet_ice', 'planet_solar'],
        ];

        $levelCounter = 1;

        foreach ($worldConfigs as $wConfig) {
            $world = PlanetBurstWorld::updateOrCreate(
                ['order' => $wConfig['order']],
                [
                    'name' => $wConfig['name'],
                    'icon' => $wConfig['icon'],
                    'description' => $wConfig['description'],
                    'background_theme' => $wConfig['background_theme'],
                ]
            );

            // Seed 10 levels per world = 100 total levels
            for ($i = 1; $i <= 10; $i++) {
                $lvlNum = $levelCounter++;
                $difficulty = $this->determineDifficulty($lvlNum);
                $tiles = $lvlNum <= 10 ? $tilePools[0] : ($lvlNum <= 40 ? $tilePools[1] : $tilePools[2]);
                $moveLimit = max(15, 28 - (int) ($lvlNum / 10));
                $targetScore = 2500 + ($lvlNum * 350);

                $starThresholds = [
                    $targetScore,
                    (int) ($targetScore * 1.6),
                    (int) ($targetScore * 2.3),
                ];

                $objectives = $this->generateObjectives($lvlNum, $targetScore, $tiles);
                $obstacles = $this->generateObstacles($lvlNum);

                PlanetBurstLevel::updateOrCreate(
                    [
                        'world_id' => $world->id,
                        'level_number' => $lvlNum,
                    ],
                    [
                        'title' => "{$wConfig['name']} - Sector {$i}",
                        'difficulty' => $difficulty,
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => $moveLimit,
                        'target_score' => $targetScore,
                        'star_thresholds' => $starThresholds,
                        'objectives' => $objectives,
                        'available_tiles' => $tiles,
                        'obstacles' => $obstacles,
                        'is_active' => true,
                    ]
                );
            }
        }
    }

    /**
     * Determine difficulty based on level number progression.
     *
     * // YB - 16-09-2026 Map level progression number to difficulty label
     */
    protected function determineDifficulty(int $levelNumber): string
    {
        if ($levelNumber <= 15) return 'easy';
        if ($levelNumber <= 40) return 'medium';
        if ($levelNumber <= 70) return 'hard';
        if ($levelNumber <= 90) return 'expert';
        return 'master';
    }

    /**
     * Generate dynamic and varied objectives for a level.
     *
     * // YB - 16-09-2026 Procedurally create diverse mission objectives
     */
    protected function generateObjectives(int $levelNum, int $targetScore, array $tiles): array
    {
        $typeMod = $levelNum % 4;

        if ($typeMod === 1) {
            // Pure Score Objective
            return [
                ['type' => 'score', 'target' => $targetScore],
            ];
        }

        if ($typeMod === 2) {
            // Collect single color tile
            $chosenTile = $tiles[$levelNum % count($tiles)];
            $targetCount = 15 + (int) ($levelNum / 5);
            return [
                ['type' => 'collect_tile', 'target' => $targetCount, 'tileType' => $chosenTile],
            ];
        }

        if ($typeMod === 3) {
            // Ice clearing + score
            $iceTarget = min(18, 6 + (int) ($levelNum / 8));
            return [
                ['type' => 'clear_ice', 'target' => $iceTarget],
                ['type' => 'score', 'target' => (int) ($targetScore * 0.8)],
            ];
        }

        // Dual collection objective
        $tile1 = $tiles[0];
        $tile2 = $tiles[min(count($tiles) - 1, 2)];
        return [
            ['type' => 'collect_tile', 'target' => 14 + (int) ($levelNum / 10), 'tileType' => $tile1],
            ['type' => 'collect_tile', 'target' => 14 + (int) ($levelNum / 10), 'tileType' => $tile2],
        ];
    }

    /**
     * Generate obstacles tailored to level progression.
     *
     * // YB - 16-09-2026 Generate obstacles layout based on level number
     */
    protected function generateObstacles(int $levelNum): ?array
    {
        if ($levelNum <= 3) {
            return null; // Intro levels have no obstacles
        }

        $obstacles = [];

        // Levels with Cosmic Ice
        if ($levelNum % 3 === 0 || ($levelNum % 4 === 3)) {
            $iceCount = min(16, 6 + (int) ($levelNum / 8));
            $coords = [
                ['row' => 2, 'col' => 2], ['row' => 2, 'col' => 5],
                ['row' => 3, 'col' => 3], ['row' => 3, 'col' => 4],
                ['row' => 4, 'col' => 3], ['row' => 4, 'col' => 4],
                ['row' => 5, 'col' => 2], ['row' => 5, 'col' => 5],
                ['row' => 1, 'col' => 3], ['row' => 1, 'col' => 4],
                ['row' => 6, 'col' => 3], ['row' => 6, 'col' => 4],
                ['row' => 3, 'col' => 1], ['row' => 4, 'col' => 1],
                ['row' => 3, 'col' => 6], ['row' => 4, 'col' => 6],
            ];
            for ($k = 0; $k < min($iceCount, count($coords)); $k++) {
                $obstacles[] = ['row' => $coords[$k]['row'], 'col' => $coords[$k]['col'], 'type' => 'ice'];
            }
        }

        // Levels with Gravity Locks
        if ($levelNum > 20 && $levelNum % 5 === 0) {
            $obstacles[] = ['row' => 0, 'col' => 0, 'type' => 'lock'];
            $obstacles[] = ['row' => 0, 'col' => 7, 'type' => 'lock'];
            $obstacles[] = ['row' => 7, 'col' => 0, 'type' => 'lock'];
            $obstacles[] = ['row' => 7, 'col' => 7, 'type' => 'lock'];
        }

        // Levels with Asteroid Rocks
        if ($levelNum > 35 && $levelNum % 6 === 0) {
            $obstacles[] = ['row' => 2, 'col' => 3, 'type' => 'rock'];
            $obstacles[] = ['row' => 5, 'col' => 4, 'type' => 'rock'];
        }

        return count($obstacles) > 0 ? $obstacles : null;
    }
}
