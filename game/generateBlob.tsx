import { Cell, PlacedPiece } from "./types";
import { generateTetrimino } from "./generateTetrimino";
import { fillBlobWithTetriminos } from "./fillBlobWithTetriminos";

const GRID_SIZE = 9;
const MIN_BLOB = 43;
const MAX_BLOB = 51;
const PIECE_COUNT = 10; // tweak later

export type BlobResult = {
  blob: Cell[];
  pieces: Cell[][];
};

export type FilledBlobResult = {
  blob: Cell[];
  pieces: PlacedPiece[];
};

/**
 * Generates a blob mask and a set of random polyomino pieces.
 */
export function generateBlob(): BlobResult {
  const targetSize = randInt(MIN_BLOB, MAX_BLOB);

  const blob = new Set<string>();
  const frontier: Cell[] = [];

  const center = Math.floor(GRID_SIZE / 2);
  const start: Cell = {
    row: center + randInt(-1, 1),
    col: center + randInt(-1, 1),
  };

  blob.add(key(start));
  frontier.push(start);

  while (blob.size < targetSize && frontier.length > 0) {
    const current =
      frontier[Math.floor(Math.random() * frontier.length)];

    for (const n of neighbors(current)) {
      if (!inBounds(n)) continue;
      if (blob.has(key(n))) continue;

      if (Math.random() < 0.45) {
        blob.add(key(n));
        frontier.push(n);
      }
    }

    if (Math.random() < 0.3) {
      frontier.splice(frontier.indexOf(current), 1);
    }
  }

  // Generate random pieces
  const pieces: Cell[][] = [];
  for (let i = 0; i < PIECE_COUNT; i++) {
    pieces.push(generateTetrimino());
  }

  return {
    blob: Array.from(blob).map(parseKey),
    pieces,
  };
}

/**
 * Generates a blob mask and fills it with randomly generated pieces.
 */
export function generateFilledBlob(
  maxAttempts: number = 60
): FilledBlobResult {
  for (let i = 0; i < maxAttempts; i++) {
    const { blob } = generateBlob();
    const pieces =
      fillBlobWithTetriminos(blob, { maxRestarts: 120 });
    if (pieces) {
      return { blob, pieces };
    }
  }

  return { blob: [], pieces: [] };
}

/* ---------- helpers ---------- */

function neighbors(c: Cell): Cell[] {
  return [
    { row: c.row - 1, col: c.col },
    { row: c.row + 1, col: c.col },
    { row: c.row, col: c.col - 1 },
    { row: c.row, col: c.col + 1 },
  ];
}

function inBounds(c: Cell): boolean {
  return c.row >= 0 && c.row < GRID_SIZE &&
         c.col >= 0 && c.col < GRID_SIZE;
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
