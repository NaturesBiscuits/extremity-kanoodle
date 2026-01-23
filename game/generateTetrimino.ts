import { Cell } from "./types";

const MIN_SIZE = 4;
const MAX_SIZE = 6;

/**
 * Generates a random contiguous polyomino
 * with 4–6 blocks (not limited to Tetris shapes).
 */
export function generateTetrimino(): Cell[] {
  const targetSize = randInt(MIN_SIZE, MAX_SIZE);

  const blocks = new Set<string>();
  const frontier: Cell[] = [];

  const start: Cell = { row: 0, col: 0 };
  blocks.add(key(start));
  frontier.push(start);

  while (blocks.size < targetSize && frontier.length > 0) {
    const base =
      frontier[Math.floor(Math.random() * frontier.length)];

    const neighbors = getNeighbors(base).filter(
      c => !blocks.has(key(c))
    );

    if (neighbors.length === 0) {
      // This growth point is exhausted
      frontier.splice(frontier.indexOf(base), 1);
      continue;
    }

    const next =
      neighbors[Math.floor(Math.random() * neighbors.length)];

    blocks.add(key(next));
    frontier.push(next);
  }

  return normalize(Array.from(blocks).map(parseKey));
}

/* ---------- helpers ---------- */

function getNeighbors(c: Cell): Cell[] {
  return [
    { row: c.row - 1, col: c.col },
    { row: c.row + 1, col: c.col },
    { row: c.row, col: c.col - 1 },
    { row: c.row, col: c.col + 1 },
  ];
}

function normalize(cells: Cell[]): Cell[] {
  const minRow = Math.min(...cells.map(c => c.row));
  const minCol = Math.min(...cells.map(c => c.col));

  return cells.map(c => ({
    row: c.row - minRow,
    col: c.col - minCol,
  }));
}

function key(c: Cell): string {
  return `${c.row},${c.col}`;
}

function parseKey(k: string): Cell {
  const [row, col] = k.split(",").map(Number);
  return { row, col };
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
