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
     * // YB - 16-09-2026 Seed initial celestial worlds and 18 missions for Planet Burst
     */
    public function run(): void
    {
        $worldsData = [
            [
                'order' => 1,
                'name' => 'Earth Orbit',
                'icon' => '🌍',
                'description' => 'Atmospheric boundary with tranquil cosmic radiation.',
                'background_theme' => 'earth',
                'levels' => [
                    [
                        'level_number' => 1,
                        'title' => 'Sector Alpha',
                        'difficulty' => 'easy',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 25,
                        'target_score' => 3000,
                        'star_thresholds' => [3000, 6000, 9000],
                        'objectives' => [['type' => 'score', 'target' => 3000]],
                        'available_tiles' => ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ruby'],
                        'obstacles' => null,
                    ],
                    [
                        'level_number' => 2,
                        'title' => 'Terra Horizon',
                        'difficulty' => 'easy',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 22,
                        'target_score' => 4000,
                        'star_thresholds' => [4000, 7500, 11000],
                        'objectives' => [['type' => 'collect_tile', 'target' => 18, 'tileType' => 'planet_cyan']],
                        'available_tiles' => ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ruby'],
                        'obstacles' => null,
                    ],
                    [
                        'level_number' => 3,
                        'title' => 'Satellite Highway',
                        'difficulty' => 'medium',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 20,
                        'target_score' => 5000,
                        'star_thresholds' => [5000, 9000, 13000],
                        'objectives' => [
                            ['type' => 'score', 'target' => 5000],
                            ['type' => 'collect_tile', 'target' => 15, 'tileType' => 'planet_amber'],
                        ],
                        'available_tiles' => ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ruby', 'planet_ice'],
                        'obstacles' => null,
                    ],
                ],
            ],
            [
                'order' => 2,
                'name' => 'Lunar Base',
                'icon' => '🌙',
                'description' => 'Craters veiled in frozen interstellar frost.',
                'background_theme' => 'moon',
                'levels' => [
                    [
                        'level_number' => 4,
                        'title' => 'Tranquility Frost',
                        'difficulty' => 'medium',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 24,
                        'target_score' => 4500,
                        'star_thresholds' => [4500, 8000, 12000],
                        'objectives' => [['type' => 'clear_ice', 'target' => 8]],
                        'available_tiles' => ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ruby', 'planet_ice'],
                        'obstacles' => [
                            ['row' => 3, 'col' => 3, 'type' => 'ice'],
                            ['row' => 3, 'col' => 4, 'type' => 'ice'],
                            ['row' => 4, 'col' => 3, 'type' => 'ice'],
                            ['row' => 4, 'col' => 4, 'type' => 'ice'],
                            ['row' => 2, 'col' => 2, 'type' => 'ice'],
                            ['row' => 2, 'col' => 5, 'type' => 'ice'],
                            ['row' => 5, 'col' => 2, 'type' => 'ice'],
                            ['row' => 5, 'col' => 5, 'type' => 'ice'],
                        ],
                    ],
                    [
                        'level_number' => 5,
                        'title' => 'Crater Basin',
                        'difficulty' => 'medium',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 22,
                        'target_score' => 5500,
                        'star_thresholds' => [5500, 9500, 14000],
                        'objectives' => [
                            ['type' => 'collect_tile', 'target' => 20, 'tileType' => 'planet_ice'],
                            ['type' => 'clear_ice', 'target' => 6],
                        ],
                        'available_tiles' => ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ice', 'planet_solar'],
                        'obstacles' => [
                            ['row' => 3, 'col' => 2, 'type' => 'ice'],
                            ['row' => 3, 'col' => 5, 'type' => 'ice'],
                            ['row' => 4, 'col' => 2, 'type' => 'ice'],
                            ['row' => 4, 'col' => 5, 'type' => 'ice'],
                            ['row' => 1, 'col' => 3, 'type' => 'ice'],
                            ['row' => 6, 'col' => 4, 'type' => 'ice'],
                        ],
                    ],
                    [
                        'level_number' => 6,
                        'title' => 'Eclipse Terminal',
                        'difficulty' => 'hard',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 20,
                        'target_score' => 7000,
                        'star_thresholds' => [7000, 12000, 17000],
                        'objectives' => [
                            ['type' => 'score', 'target' => 7000],
                            ['type' => 'collect_tile', 'target' => 22, 'tileType' => 'planet_purple'],
                        ],
                        'available_tiles' => ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ruby', 'planet_ice', 'planet_solar'],
                        'obstacles' => null,
                    ],
                ],
            ],
            [
                'order' => 3,
                'name' => 'Mars Ridge',
                'icon' => '🔴',
                'description' => 'Red basalt cliffs with magnetic flux locks.',
                'background_theme' => 'mars',
                'levels' => [
                    [
                        'level_number' => 7,
                        'title' => 'Olympus Ascent',
                        'difficulty' => 'medium',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 23,
                        'target_score' => 6000,
                        'star_thresholds' => [6000, 10000, 15000],
                        'objectives' => [['type' => 'collect_tile', 'target' => 24, 'tileType' => 'planet_ruby']],
                        'available_tiles' => ['planet_amber', 'planet_cyan', 'planet_ruby', 'planet_solar'],
                        'obstacles' => [
                            ['row' => 0, 'col' => 0, 'type' => 'lock'],
                            ['row' => 0, 'col' => 7, 'type' => 'lock'],
                            ['row' => 7, 'col' => 0, 'type' => 'lock'],
                            ['row' => 7, 'col' => 7, 'type' => 'lock'],
                        ],
                    ],
                    [
                        'level_number' => 8,
                        'title' => 'Dust Valley',
                        'difficulty' => 'hard',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 20,
                        'target_score' => 7500,
                        'star_thresholds' => [7500, 13000, 18000],
                        'objectives' => [
                            ['type' => 'score', 'target' => 7500],
                            ['type' => 'collect_tile', 'target' => 16, 'tileType' => 'planet_solar'],
                        ],
                        'available_tiles' => ['planet_amber', 'planet_purple', 'planet_ruby', 'planet_solar', 'planet_ice'],
                        'obstacles' => null,
                    ],
                    [
                        'level_number' => 9,
                        'title' => 'Valles Marineris',
                        'difficulty' => 'hard',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 22,
                        'target_score' => 8000,
                        'star_thresholds' => [8000, 14000, 20000],
                        'objectives' => [
                            ['type' => 'clear_ice', 'target' => 10],
                            ['type' => 'collect_tile', 'target' => 20, 'tileType' => 'planet_ruby'],
                        ],
                        'available_tiles' => ['planet_amber', 'planet_cyan', 'planet_ruby', 'planet_ice', 'planet_solar'],
                        'obstacles' => [
                            ['row' => 2, 'col' => 2, 'type' => 'ice'],
                            ['row' => 2, 'col' => 3, 'type' => 'ice'],
                            ['row' => 2, 'col' => 4, 'type' => 'ice'],
                            ['row' => 2, 'col' => 5, 'type' => 'ice'],
                            ['row' => 5, 'col' => 2, 'type' => 'ice'],
                            ['row' => 5, 'col' => 3, 'type' => 'ice'],
                            ['row' => 5, 'col' => 4, 'type' => 'ice'],
                            ['row' => 5, 'col' => 5, 'type' => 'ice'],
                            ['row' => 3, 'col' => 3, 'type' => 'ice'],
                            ['row' => 4, 'col' => 4, 'type' => 'ice'],
                        ],
                    ],
                ],
            ],
            [
                'order' => 4,
                'name' => 'Jupiter Storm',
                'icon' => '🟠',
                'description' => 'Vast swirling storms and dense asteroid belts.',
                'background_theme' => 'jupiter',
                'levels' => [
                    [
                        'level_number' => 10,
                        'title' => 'Great Red Eye',
                        'difficulty' => 'hard',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 22,
                        'target_score' => 9000,
                        'star_thresholds' => [9000, 15000, 22000],
                        'objectives' => [['type' => 'score', 'target' => 9000]],
                        'available_tiles' => ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ruby', 'planet_solar'],
                        'obstacles' => [
                            ['row' => 3, 'col' => 3, 'type' => 'rock'],
                            ['row' => 4, 'col' => 4, 'type' => 'rock'],
                        ],
                    ],
                    [
                        'level_number' => 11,
                        'title' => 'Atmospheric Vortex',
                        'difficulty' => 'hard',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 20,
                        'target_score' => 9500,
                        'star_thresholds' => [9500, 16000, 24000],
                        'objectives' => [
                            ['type' => 'collect_tile', 'target' => 25, 'tileType' => 'planet_amber'],
                            ['type' => 'collect_tile', 'target' => 25, 'tileType' => 'planet_solar'],
                        ],
                        'available_tiles' => ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ruby', 'planet_solar'],
                        'obstacles' => null,
                    ],
                    [
                        'level_number' => 12,
                        'title' => 'Europa Crossing',
                        'difficulty' => 'expert',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 18,
                        'target_score' => 10000,
                        'star_thresholds' => [10000, 18000, 26000],
                        'objectives' => [['type' => 'clear_ice', 'target' => 12]],
                        'available_tiles' => ['planet_amber', 'planet_cyan', 'planet_ice', 'planet_solar'],
                        'obstacles' => [
                            ['row' => 1, 'col' => 1, 'type' => 'ice'], ['row' => 1, 'col' => 6, 'type' => 'ice'],
                            ['row' => 2, 'col' => 2, 'type' => 'ice'], ['row' => 2, 'col' => 5, 'type' => 'ice'],
                            ['row' => 3, 'col' => 3, 'type' => 'ice'], ['row' => 3, 'col' => 4, 'type' => 'ice'],
                            ['row' => 4, 'col' => 3, 'type' => 'ice'], ['row' => 4, 'col' => 4, 'type' => 'ice'],
                            ['row' => 5, 'col' => 2, 'type' => 'ice'], ['row' => 5, 'col' => 5, 'type' => 'ice'],
                            ['row' => 6, 'col' => 1, 'type' => 'ice'], ['row' => 6, 'col' => 6, 'type' => 'ice'],
                        ],
                    ],
                ],
            ],
            [
                'order' => 5,
                'name' => 'Saturn Rings',
                'icon' => '💍',
                'description' => 'Glistening ring arcs composed of celestial crystals.',
                'background_theme' => 'saturn',
                'levels' => [
                    [
                        'level_number' => 13,
                        'title' => 'Cassini Division',
                        'difficulty' => 'hard',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 22,
                        'target_score' => 10000,
                        'star_thresholds' => [10000, 17000, 25000],
                        'objectives' => [['type' => 'collect_tile', 'target' => 30, 'tileType' => 'planet_purple']],
                        'available_tiles' => ['planet_amber', 'planet_purple', 'planet_ice', 'planet_solar'],
                        'obstacles' => null,
                    ],
                    [
                        'level_number' => 14,
                        'title' => 'Titan Outpost',
                        'difficulty' => 'expert',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 20,
                        'target_score' => 11000,
                        'star_thresholds' => [11000, 19000, 28000],
                        'objectives' => [
                            ['type' => 'score', 'target' => 11000],
                            ['type' => 'clear_ice', 'target' => 8],
                        ],
                        'available_tiles' => ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ice', 'planet_solar'],
                        'obstacles' => [
                            ['row' => 2, 'col' => 3, 'type' => 'ice'], ['row' => 2, 'col' => 4, 'type' => 'ice'],
                            ['row' => 3, 'col' => 2, 'type' => 'ice'], ['row' => 3, 'col' => 5, 'type' => 'ice'],
                            ['row' => 4, 'col' => 2, 'type' => 'ice'], ['row' => 4, 'col' => 5, 'type' => 'ice'],
                            ['row' => 5, 'col' => 3, 'type' => 'ice'], ['row' => 5, 'col' => 4, 'type' => 'ice'],
                        ],
                    ],
                    [
                        'level_number' => 15,
                        'title' => 'Enceladus Cryo-Geyser',
                        'difficulty' => 'expert',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 18,
                        'target_score' => 12000,
                        'star_thresholds' => [12000, 20000, 30000],
                        'objectives' => [
                            ['type' => 'collect_tile', 'target' => 25, 'tileType' => 'planet_ice'],
                            ['type' => 'collect_tile', 'target' => 25, 'tileType' => 'planet_cyan'],
                        ],
                        'available_tiles' => ['planet_cyan', 'planet_purple', 'planet_ruby', 'planet_ice', 'planet_solar'],
                        'obstacles' => null,
                    ],
                ],
            ],
            [
                'order' => 6,
                'name' => 'Deep Cosmos',
                'icon' => '🌌',
                'description' => 'The edge of chartered space approaching a supermassive anomaly.',
                'background_theme' => 'cosmos',
                'levels' => [
                    [
                        'level_number' => 16,
                        'title' => 'Nebula Nexus',
                        'difficulty' => 'expert',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 22,
                        'target_score' => 13000,
                        'star_thresholds' => [13000, 22000, 32000],
                        'objectives' => [['type' => 'score', 'target' => 13000]],
                        'available_tiles' => ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ruby', 'planet_ice', 'planet_solar'],
                        'obstacles' => null,
                    ],
                    [
                        'level_number' => 17,
                        'title' => 'Event Horizon',
                        'difficulty' => 'expert',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 20,
                        'target_score' => 14000,
                        'star_thresholds' => [14000, 24000, 35000],
                        'objectives' => [
                            ['type' => 'clear_ice', 'target' => 12],
                            ['type' => 'collect_tile', 'target' => 20, 'tileType' => 'planet_ruby'],
                        ],
                        'available_tiles' => ['planet_cyan', 'planet_purple', 'planet_ruby', 'planet_ice', 'planet_solar'],
                        'obstacles' => [
                            ['row' => 0, 'col' => 0, 'type' => 'ice'], ['row' => 0, 'col' => 7, 'type' => 'ice'],
                            ['row' => 7, 'col' => 0, 'type' => 'ice'], ['row' => 7, 'col' => 7, 'type' => 'ice'],
                            ['row' => 3, 'col' => 3, 'type' => 'ice'], ['row' => 3, 'col' => 4, 'type' => 'ice'],
                            ['row' => 4, 'col' => 3, 'type' => 'ice'], ['row' => 4, 'col' => 4, 'type' => 'ice'],
                            ['row' => 2, 'col' => 3, 'type' => 'ice'], ['row' => 2, 'col' => 4, 'type' => 'ice'],
                            ['row' => 5, 'col' => 3, 'type' => 'ice'], ['row' => 5, 'col' => 4, 'type' => 'ice'],
                        ],
                    ],
                    [
                        'level_number' => 18,
                        'title' => 'Singularity Burst',
                        'difficulty' => 'master',
                        'rows' => 8,
                        'columns' => 8,
                        'move_limit' => 18,
                        'target_score' => 16000,
                        'star_thresholds' => [16000, 28000, 40000],
                        'objectives' => [
                            ['type' => 'score', 'target' => 16000],
                            ['type' => 'collect_tile', 'target' => 30, 'tileType' => 'planet_solar'],
                        ],
                        'available_tiles' => ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ruby', 'planet_ice', 'planet_solar'],
                        'obstacles' => [
                            ['row' => 2, 'col' => 2, 'type' => 'rock'],
                            ['row' => 2, 'col' => 5, 'type' => 'rock'],
                            ['row' => 5, 'col' => 2, 'type' => 'rock'],
                            ['row' => 5, 'col' => 5, 'type' => 'rock'],
                        ],
                    ],
                ],
            ],
        ];

        foreach ($worldsData as $wData) {
            $levels = $wData['levels'];
            unset($wData['levels']);

            $world = PlanetBurstWorld::updateOrCreate(
                ['order' => $wData['order']],
                $wData
            );

            foreach ($levels as $lData) {
                $lData['world_id'] = $world->id;
                PlanetBurstLevel::updateOrCreate(
                    [
                        'world_id' => $world->id,
                        'level_number' => $lData['level_number'],
                    ],
                    $lData
                );
            }
        }
    }
}
