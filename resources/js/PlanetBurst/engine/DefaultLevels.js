// YB - 16-09-2026 100 levels across 10 worlds default configuration for Planet Burst

const WORLD_CONFIGS = [
    { id: 1, order: 1, name: 'Earth Orbit', icon: '🌍', description: 'Atmospheric boundary with calm cosmic rays. Flight training sector.' },
    { id: 2, order: 2, name: 'Lunar Base', icon: '🌙', description: 'Craters and shadowed valleys encased in persistent frost.' },
    { id: 3, order: 3, name: 'Mars Ridge', icon: '🔴', description: 'Red iron valleys with erratic gravitational flux locks.' },
    { id: 4, order: 4, name: 'Jupiter Storm', icon: '🟠', description: 'Great atmospheric vortices and jagged stray meteoroid belts.' },
    { id: 5, order: 5, name: 'Saturn Rings', icon: '💍', description: 'Glistening crystalline rings composed of frozen celestial shards.' },
    { id: 6, order: 6, name: 'Neptune Abyss', icon: '🔵', description: 'Supersonic planetary winds and deep azure methane oceans.' },
    { id: 7, order: 7, name: 'Solar Core', icon: '☀️', description: 'High-energy coronal loops and intense magnetic flares.' },
    { id: 8, order: 8, name: 'Nebula Nexus', icon: '🟣', description: 'Prismatic stellar nursery where newborn cosmic powers form.' },
    { id: 9, order: 9, name: 'Asteroid Belt', icon: '☄️', description: 'Treacherous orbital field of solid asteroids and energy barriers.' },
    { id: 10, order: 10, name: 'Event Horizon', icon: '🕳️', description: 'The ultimate sector at the brink of an ancient supermassive singularity.' },
];

const TILE_POOLS = [
    ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ruby'],
    ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ruby', 'planet_ice'],
    ['planet_amber', 'planet_cyan', 'planet_purple', 'planet_ruby', 'planet_ice', 'planet_solar'],
];

// YB - 16-09-2026 Generate 100 default level configurations
export const DEFAULT_WORLDS_DATA = WORLD_CONFIGS.map(w => {
    const levels = [];
    const baseNum = (w.order - 1) * 10;

    for (let i = 1; i <= 10; i++) {
        const lvlNum = baseNum + i;
        const difficulty = lvlNum <= 15 ? 'easy' : (lvlNum <= 40 ? 'medium' : (lvlNum <= 70 ? 'hard' : (lvlNum <= 90 ? 'expert' : 'master')));
        const tiles = lvlNum <= 10 ? TILE_POOLS[0] : (lvlNum <= 40 ? TILE_POOLS[1] : TILE_POOLS[2]);
        const moveLimit = Math.max(15, 28 - Math.floor(lvlNum / 10));
        const targetScore = 2500 + (lvlNum * 350);

        const starThresholds = [
            targetScore,
            Math.floor(targetScore * 1.6),
            Math.floor(targetScore * 2.3),
        ];

        let objectives = [];
        const typeMod = lvlNum % 4;

        if (typeMod === 1) {
            objectives = [{ type: 'score', target: targetScore }];
        } else if (typeMod === 2) {
            const chosen = tiles[lvlNum % tiles.length];
            objectives = [{ type: 'collect_tile', target: 15 + Math.floor(lvlNum / 5), tileType: chosen }];
        } else if (typeMod === 3) {
            objectives = [
                { type: 'clear_ice', target: Math.min(16, 6 + Math.floor(lvlNum / 8)) },
                { type: 'score', target: Math.floor(targetScore * 0.8) },
            ];
        } else {
            objectives = [
                { type: 'collect_tile', target: 14 + Math.floor(lvlNum / 10), tileType: tiles[0] },
                { type: 'collect_tile', target: 14 + Math.floor(lvlNum / 10), tileType: tiles[Math.min(tiles.length - 1, 2)] },
            ];
        }

        const obstacles = [];
        if (lvlNum > 3 && (lvlNum % 3 === 0 || lvlNum % 4 === 3)) {
            const coords = [
                { row: 2, col: 2 }, { row: 2, col: 5 },
                { row: 3, col: 3 }, { row: 3, col: 4 },
                { row: 4, col: 3 }, { row: 4, col: 4 },
                { row: 5, col: 2 }, { row: 5, col: 5 },
            ];
            for (const c of coords) {
                obstacles.push({ row: c.row, col: c.col, type: 'ice' });
            }
        }
        if (lvlNum > 20 && lvlNum % 5 === 0) {
            obstacles.push({ row: 0, col: 0, type: 'lock' }, { row: 0, col: 7, type: 'lock' }, { row: 7, col: 0, type: 'lock' }, { row: 7, col: 7, type: 'lock' });
        }
        if (lvlNum > 35 && lvlNum % 6 === 0) {
            obstacles.push({ row: 2, col: 3, type: 'rock' }, { row: 5, col: 4, type: 'rock' });
        }

        levels.push({
            id: lvlNum,
            world_id: w.id,
            level_number: lvlNum,
            title: `${w.name} - Sector ${i}`,
            difficulty,
            rows: 8,
            columns: 8,
            move_limit: moveLimit,
            target_score: targetScore,
            star_thresholds: starThresholds,
            objectives,
            available_tiles: tiles,
            obstacles,
            is_unlocked: lvlNum === 1,
            stars: 0,
        });
    }

    return {
        id: w.id,
        order: w.order,
        name: w.name,
        icon: w.icon,
        description: w.description,
        is_unlocked: w.order === 1,
        levels,
    };
});
