// YB - 16-09-2026 Pure BoardEngine implementation for Planet Burst cosmic match-3 mechanics

export const COSMIC_TILE_TYPES = [
    'planet_amber',  // 🪐 Ringed Amber Planet
    'planet_cyan',   // 🌍 Terra Cyan Planet
    'planet_purple', // 🟣 Nebula Purple Orb
    'planet_ruby',   // 🔴 Crimson Star
    'planet_ice',    // ❄️ Frost Comet
    'planet_solar',  // ☀️ Solar Core
];

export const POWER_TYPES = {
    COMET_H: 'comet_h',       // 4 horizontal: clears row
    COMET_V: 'comet_v',       // 4 vertical: clears column
    BLACK_HOLE: 'black_hole', // L/T shape: explodes 3x3
    SUPERNOVA: 'supernova',   // 5 match: clears chosen color
};

export class BoardEngine {
    // YB - 16-09-2026 Initialize board engine with grid dimensions and tile pool
    constructor(rows = 8, cols = 8, tileTypes = COSMIC_TILE_TYPES) {
        this.rows = rows;
        this.cols = cols;
        this.tileTypes = tileTypes.length > 0 ? tileTypes : COSMIC_TILE_TYPES;
        this.grid = [];
        this.nextTileId = 1;
    }

    // YB - 16-09-2026 Generate unique tile ID
    generateId() {
        return `tile_${this.nextTileId++}_${Date.now().toString(36)}`;
    }

    // YB - 16-09-2026 Pick a random tile type from the active pool
    getRandomTileType(excludedTypes = []) {
        const pool = this.tileTypes.filter(t => !excludedTypes.includes(t));
        const list = pool.length > 0 ? pool : this.tileTypes;
        return list[Math.floor(Math.random() * list.length)];
    }

    // YB - 16-09-2026 Create a single tile object
    createTile(row, col, type = null, power = null, obstacle = null) {
        return {
            id: this.generateId(),
            type: type || this.getRandomTileType(),
            row,
            col,
            power,
            obstacle,
            isMatched: false,
            isNew: false,
        };
    }

    // YB - 16-09-2026 Initialize board without immediate matches and ensure at least one valid move
    initBoard(customGrid = null) {
        if (customGrid && Array.isArray(customGrid)) {
            this.grid = customGrid.map((row, r) =>
                row.map((cell, c) => ({
                    ...cell,
                    row: r,
                    col: c,
                    id: cell.id || this.generateId(),
                }))
            );
            return this.grid;
        }

        let attempts = 0;
        let valid = false;

        while (!valid && attempts < 100) {
            attempts++;
            this.grid = [];

            for (let r = 0; r < this.rows; r++) {
                const row = [];
                for (let c = 0; c < this.cols; c++) {
                    const excluded = [];
                    // Avoid immediate horizontal match
                    if (c >= 2 && row[c - 1]?.type && row[c - 1].type === row[c - 2]?.type) {
                        excluded.push(row[c - 1].type);
                    }
                    // Avoid immediate vertical match
                    if (r >= 2 && this.grid[r - 1]?.[c]?.type && this.grid[r - 1][c].type === this.grid[r - 2]?.[c]?.type) {
                        excluded.push(this.grid[r - 1][c].type);
                    }

                    const tileType = this.getRandomTileType(excluded);
                    row.push(this.createTile(r, c, tileType));
                }
                this.grid.push(row);
            }

            // Ensure board has at least one valid move
            if (this.hasPossibleMoves()) {
                valid = true;
            }
        }

        if (!valid) {
            this.ensureValidMove();
        }

        return this.grid;
    }

    // YB - 16-09-2026 Get tile at row and column safely
    getTile(r, c) {
        if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return null;
        return this.grid[r]?.[c] || null;
    }

    // YB - 16-09-2026 Set tile at row and column
    setTile(r, c, tile) {
        if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
            if (tile) {
                tile.row = r;
                tile.col = c;
            }
            this.grid[r][c] = tile;
        }
    }

    // YB - 16-09-2026 Check if two board positions are adjacent
    isAdjacent(r1, c1, r2, c2) {
        const dr = Math.abs(r1 - r2);
        const dc = Math.abs(c1 - c2);
        return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
    }

    // YB - 16-09-2026 Execute swap between two cells
    swap(r1, c1, r2, c2) {
        if (!this.isAdjacent(r1, c1, r2, c2)) return false;

        const tileA = this.getTile(r1, c1);
        const tileB = this.getTile(r2, c2);

        if (!tileA || !tileB) return false;
        // Gravity locks or solid obstacles prevent swaps
        if (tileA.obstacle === 'lock' || tileB.obstacle === 'lock') return false;
        if (tileA.obstacle === 'rock' || tileB.obstacle === 'rock') return false;

        tileA.row = r2;
        tileA.col = c2;
        tileB.row = r1;
        tileB.col = c1;

        this.grid[r1][c1] = tileB;
        this.grid[r2][c2] = tileA;

        return true;
    }

    // YB - 16-09-2026 Find all matches on the current board state
    findMatches() {
        const matches = [];
        const matchedCells = new Set();
        const key = (r, c) => `${r},${c}`;

        // 1. Horizontal matches
        for (let r = 0; r < this.rows; r++) {
            let matchLen = 1;
            for (let c = 0; c < this.cols; c++) {
                const curr = this.getTile(r, c);
                const next = this.getTile(r, c + 1);

                const canMatch = curr && next &&
                    curr.type && curr.type === next.type &&
                    curr.obstacle !== 'rock' && next.obstacle !== 'rock';

                if (canMatch) {
                    matchLen++;
                } else {
                    if (matchLen >= 3) {
                        const cells = [];
                        for (let k = 0; k < matchLen; k++) {
                            const colIdx = c - matchLen + 1 + k;
                            cells.push({ row: r, col: colIdx });
                            matchedCells.add(key(r, colIdx));
                        }
                        matches.push({
                            direction: 'horizontal',
                            type: this.getTile(r, c - matchLen + 1).type,
                            cells,
                            length: matchLen,
                        });
                    }
                    matchLen = 1;
                }
            }
        }

        // 2. Vertical matches
        for (let c = 0; c < this.cols; c++) {
            let matchLen = 1;
            for (let r = 0; r < this.rows; r++) {
                const curr = this.getTile(r, c);
                const next = this.getTile(r + 1, c);

                const canMatch = curr && next &&
                    curr.type && curr.type === next.type &&
                    curr.obstacle !== 'rock' && next.obstacle !== 'rock';

                if (canMatch) {
                    matchLen++;
                } else {
                    if (matchLen >= 3) {
                        const cells = [];
                        for (let k = 0; k < matchLen; k++) {
                            const rowIdx = r - matchLen + 1 + k;
                            cells.push({ row: rowIdx, col: c });
                            matchedCells.add(key(rowIdx, c));
                        }
                        matches.push({
                            direction: 'vertical',
                            type: this.getTile(r - matchLen + 1, c).type,
                            cells,
                            length: matchLen,
                        });
                    }
                    matchLen = 1;
                }
            }
        }

        return {
            hasMatches: matches.length > 0,
            matches,
            uniqueMatchedCells: Array.from(matchedCells).map(coord => {
                const [r, c] = coord.split(',').map(Number);
                return { row: r, col: c, tile: this.getTile(r, c) };
            }),
        };
    }

    // YB - 16-09-2026 Process matches and return powers to spawn and tiles to clear
    resolveMatches(matches, swapFocus = null) {
        const clearedPositions = new Set();
        const powersToSpawn = [];
        const key = (r, c) => `${r},${c}`;

        // Detect L or T shapes: intersection of horizontal & vertical matches of the same type
        const hMatches = matches.filter(m => m.direction === 'horizontal');
        const vMatches = matches.filter(m => m.direction === 'vertical');
        const usedInShape = new Set();

        for (const hm of hMatches) {
            for (const vm of vMatches) {
                if (hm.type === vm.type) {
                    // Find intersection cell
                    const intersection = hm.cells.find(hCell =>
                        vm.cells.some(vCell => vCell.row === hCell.row && vCell.col === hCell.col)
                    );

                    if (intersection) {
                        usedInShape.add(hm);
                        usedInShape.add(vm);

                        powersToSpawn.push({
                            row: intersection.row,
                            col: intersection.col,
                            type: hm.type,
                            power: POWER_TYPES.BLACK_HOLE,
                        });
                    }
                }
            }
        }

        // Process linear matches (5 for supernova, 4 for comet)
        for (const m of matches) {
            if (usedInShape.has(m)) continue;

            if (m.length >= 5) {
                let focus = m.cells[Math.floor(m.cells.length / 2)];
                if (swapFocus && m.cells.some(c => c.row === swapFocus.row && c.col === swapFocus.col)) {
                    focus = swapFocus;
                }
                powersToSpawn.push({
                    row: focus.row,
                    col: focus.col,
                    type: m.type,
                    power: POWER_TYPES.SUPERNOVA,
                });
            } else if (m.length === 4) {
                let focus = m.cells[Math.floor(m.cells.length / 2)];
                if (swapFocus && m.cells.some(c => c.row === swapFocus.row && c.col === swapFocus.col)) {
                    focus = swapFocus;
                }
                powersToSpawn.push({
                    row: focus.row,
                    col: focus.col,
                    type: m.type,
                    power: m.direction === 'horizontal' ? POWER_TYPES.COMET_H : POWER_TYPES.COMET_V,
                });
            }
        }

        // Add all matched cells to clearedPositions
        for (const m of matches) {
            for (const c of m.cells) {
                clearedPositions.add(key(c.row, c.col));
            }
        }

        // YB - 16-09-2026 Trigger secondary blasts if any matched tile was already a power tile
        let addedMore = true;
        const triggeredPowers = new Set();

        while (addedMore) {
            addedMore = false;
            for (const k of Array.from(clearedPositions)) {
                if (triggeredPowers.has(k)) continue;
                const [r, c] = k.split(',').map(Number);
                const tile = this.getTile(r, c);

                if (tile?.power) {
                    triggeredPowers.add(k);

                    if (tile.power === POWER_TYPES.COMET_H) {
                        for (let colIdx = 0; colIdx < this.cols; colIdx++) {
                            const ck = `${r},${colIdx}`;
                            if (!clearedPositions.has(ck)) {
                                clearedPositions.add(ck);
                                addedMore = true;
                            }
                        }
                    } else if (tile.power === POWER_TYPES.COMET_V) {
                        for (let rowIdx = 0; rowIdx < this.rows; rowIdx++) {
                            const ck = `${rowIdx},${c}`;
                            if (!clearedPositions.has(ck)) {
                                clearedPositions.add(ck);
                                addedMore = true;
                            }
                        }
                    } else if (tile.power === POWER_TYPES.BLACK_HOLE) {
                        for (let dr = -1; dr <= 1; dr++) {
                            for (let dc = -1; dc <= 1; dc++) {
                                const nr = r + dr;
                                const nc = c + dc;
                                if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
                                    const ck = `${nr},${nc}`;
                                    if (!clearedPositions.has(ck)) {
                                        clearedPositions.add(ck);
                                        addedMore = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return {
            clearedCoords: Array.from(clearedPositions).map(k => {
                const [r, c] = k.split(',').map(Number);
                return { row: r, col: c, tile: this.getTile(r, c) };
            }),
            powersToSpawn,
        };
    }

    // YB - 16-09-2026 Clear matched tiles from grid and insert newly formed powers
    clearTiles(clearedCoords, powersToSpawn = []) {
        // Clear cells
        for (const coord of clearedCoords) {
            this.grid[coord.row][coord.col] = null;
        }

        // Spawn created power tiles
        for (const p of powersToSpawn) {
            this.grid[p.row][p.col] = this.createTile(p.row, p.col, p.type, p.power);
        }
    }

    // YB - 16-09-2026 Apply gravity drop down each column and refill empty spaces at top
    applyGravityAndRefill() {
        const drops = []; // { fromRow, toRow, col, tileId }
        const spawns = []; // { row, col, tile }

        for (let c = 0; c < this.cols; c++) {
            let writeRow = this.rows - 1;

            // 1. Move non-empty tiles downwards
            for (let r = this.rows - 1; r >= 0; r--) {
                const tile = this.grid[r][c];

                if (tile !== null) {
                    if (tile.obstacle === 'rock') {
                        writeRow = r - 1;
                        continue;
                    }

                    if (writeRow !== r) {
                        this.grid[writeRow][c] = tile;
                        this.grid[r][c] = null;
                        drops.push({
                            fromRow: r,
                            toRow: writeRow,
                            col: c,
                            tileId: tile.id,
                        });
                        tile.row = writeRow;
                    }
                    writeRow--;
                }
            }

            // 2. Refill remaining empty spots at top
            while (writeRow >= 0) {
                if (this.grid[writeRow][c]?.obstacle === 'rock') {
                    writeRow--;
                    continue;
                }

                const newTile = this.createTile(writeRow, c);
                newTile.isNew = true;
                this.grid[writeRow][c] = newTile;
                spawns.push({
                    row: writeRow,
                    col: c,
                    tile: newTile,
                });
                writeRow--;
            }
        }

        return { drops, spawns };
    }

    // YB - 16-09-2026 Check if any legal moves exist on the board
    hasPossibleMoves() {
        // Check horizontal swaps
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols - 1; c++) {
                if (this.swapWouldMatch(r, c, r, c + 1)) return true;
            }
        }

        // Check vertical swaps
        for (let r = 0; r < this.rows - 1; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.swapWouldMatch(r, c, r + 1, c)) return true;
            }
        }

        return false;
    }

    // YB - 16-09-2026 Check if swapping two cells creates a valid match
    swapWouldMatch(r1, c1, r2, c2) {
        const t1 = this.getTile(r1, c1);
        const t2 = this.getTile(r2, c2);

        if (!t1 || !t2) return false;
        if (t1.obstacle === 'rock' || t2.obstacle === 'rock') return false;
        if (t1.obstacle === 'lock' || t2.obstacle === 'lock') return false;
        if (t1.type === t2.type && !t1.power && !t2.power) return false;

        // If either is Supernova or both are powers
        if (t1.power === POWER_TYPES.SUPERNOVA || t2.power === POWER_TYPES.SUPERNOVA) return true;
        if (t1.power && t2.power) return true;

        // Temporarily swap
        this.grid[r1][c1] = t2;
        this.grid[r2][c2] = t1;

        const { hasMatches } = this.findMatches();

        // Swap back
        this.grid[r1][c1] = t1;
        this.grid[r2][c2] = t2;

        return hasMatches;
    }

    // YB - 16-09-2026 Ensure at least one valid move exists on the board
    ensureValidMove() {
        if (this.hasPossibleMoves()) return;

        if (this.cols >= 4 && this.rows >= 2) {
            const targetType = this.tileTypes[0];
            const otherType = this.tileTypes[1];

            this.grid[0][0] = this.createTile(0, 0, targetType);
            this.grid[0][1] = this.createTile(0, 1, targetType);
            this.grid[0][2] = this.createTile(0, 2, otherType);
            this.grid[1][2] = this.createTile(1, 2, targetType);
        }
    }

    // YB - 16-09-2026 Reshuffle tiles on deadlock while preserving power tiles and avoiding instant matches
    reshuffle() {
        let attempts = 0;
        const moveableTiles = [];

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const tile = this.grid[r][c];
                if (tile && tile.obstacle !== 'rock') {
                    moveableTiles.push(tile);
                }
            }
        }

        while (attempts < 50) {
            attempts++;

            for (let i = moveableTiles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const tempType = moveableTiles[i].type;
                const tempPower = moveableTiles[i].power;

                moveableTiles[i].type = moveableTiles[j].type;
                moveableTiles[i].power = moveableTiles[j].power;

                moveableTiles[j].type = tempType;
                moveableTiles[j].power = tempPower;
            }

            const { hasMatches } = this.findMatches();
            if (!hasMatches && this.hasPossibleMoves()) {
                return true;
            }
        }

        this.ensureValidMove();
        return true;
    }

    // YB - 16-09-2026 Serialize board state for session persistence
    serialize() {
        return {
            rows: this.rows,
            cols: this.cols,
            grid: this.grid.map(row =>
                row.map(cell => cell ? {
                    id: cell.id,
                    type: cell.type,
                    power: cell.power,
                    obstacle: cell.obstacle,
                } : null)
            ),
        };
    }
}
