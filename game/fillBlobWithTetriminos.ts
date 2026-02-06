import { Cell, PlacedPiece } from "./types";
import { generateTetrimino } from "./generateTetrimino";

type FillOptions = {
  maxTriesPerStep?: number;
  maxRestarts?: number;
};

const MIN_SIZE = 4;
const MAX_SIZE = 6;

export function fillBlobWithTetriminos(
  blob: Cell[],
  options: FillOptions = {}
): PlacedPiece[] | null {
  const maxTriesPerStep = options.maxTriesPerStep ?? 40;
  const maxRestarts = options.maxRestarts ?? 150;

  const blobSet = new Set(blob.map(key));
  const canFill = buildCanFill(blob.length);

  for (let attempt = 0; attempt < maxRestarts; attempt++) {
    const empty = new Set(blobSet);
    const pieces: PlacedPiece[] = [];

    if (backtrack(empty, pieces, blobSet, canFill, maxTriesPerStep)) {
      return pieces;
    }
  }

  return null;
}

function backtrack(
  empty: Set<string>,
  pieces: PlacedPiece[],
  blobSet: Set<string>,
  canFill: boolean[],
  maxTriesPerStep: number
): boolean {
  if (empty.size === 0) return true;

  const anchorKey = pickAnchor(empty);
  const anchor = parseKey(anchorKey);

  for (let i = 0; i < maxTriesPerStep; i++) {
    const shape = generateTetrimino();
    const orientations = getOrientations(shape);
    shuffleInPlace(orientations);

    for (const orientation of orientations) {
      const placements = placementsForAnchor(anchor, orientation);
      shuffleInPlace(placements);

      for (const placed of placements) {
        if (!fits(placed, blobSet, empty)) continue;

        for (const c of placed) empty.delete(key(c));
        pieces.push({
          id: pieces.length,
          cells: placed,
          color: colorForIndex(pieces.length),
        });

        if (regionsOk(empty, canFill) &&
            backtrack(empty, pieces, blobSet, canFill, maxTriesPerStep)) {
          return true;
        }

        pieces.pop();
        for (const c of placed) empty.add(key(c));
      }
    }
  }

  return false;
}

function pickAnchor(empty: Set<string>): string {
  let bestKey = "";
  let bestScore = Infinity;

  for (const k of empty) {
    const c = parseKey(k);
    const degree = neighbors(c).filter(n => empty.has(key(n))).length;
    if (degree < bestScore) {
      bestScore = degree;
      bestKey = k;
      if (bestScore === 0) break;
    }
  }

  return bestKey;
}

function placementsForAnchor(anchor: Cell, shape: Cell[]): Cell[][] {
  const placements: Cell[][] = [];
  for (const cell of shape) {
    const dr = anchor.row - cell.row;
    const dc = anchor.col - cell.col;
    placements.push(
      shape.map(c => ({ row: c.row + dr, col: c.col + dc }))
    );
  }
  return placements;
}

function fits(
  cells: Cell[],
  blobSet: Set<string>,
  empty: Set<string>
): boolean {
  for (const c of cells) {
    const k = key(c);
    if (!blobSet.has(k)) return false;
    if (!empty.has(k)) return false;
  }
  return true;
}

function regionsOk(empty: Set<string>, canFill: boolean[]): boolean {
  if (empty.size === 0) return true;

  const unseen = new Set(empty);
  const queue: Cell[] = [];

  while (unseen.size > 0) {
    const startKey = unseen.values().next().value as string;
    unseen.delete(startKey);
    queue.length = 0;
    queue.push(parseKey(startKey));

    let size = 0;
    while (queue.length > 0) {
      const current = queue.pop() as Cell;
      size++;
      for (const n of neighbors(current)) {
        const nk = key(n);
        if (!unseen.has(nk)) continue;
        unseen.delete(nk);
        queue.push(n);
      }
    }

    if (size < MIN_SIZE) return false;
    if (!canFill[size]) return false;
  }

  return true;
}

function buildCanFill(max: number): boolean[] {
  const can = new Array(max + 1).fill(false);
  can[0] = true;
  for (let i = 1; i <= max; i++) {
    if (i - 4 >= 0 && can[i - 4]) can[i] = true;
    if (i - 5 >= 0 && can[i - 5]) can[i] = true;
    if (i - 6 >= 0 && can[i - 6]) can[i] = true;
  }
  return can;
}

function getOrientations(cells: Cell[]): Cell[][] {
  const orientations: Cell[][] = [];
  let current = cells.slice();

  for (let i = 0; i < 4; i++) {
    const normalized = normalize(current);
    const k = cellsKey(normalized);
    if (!orientations.some(o => cellsKey(o) === k)) {
      orientations.push(normalized);
    }
    current = rotate90(current);
  }

  return orientations;
}

function rotate90(cells: Cell[]): Cell[] {
  return cells.map(c => ({ row: c.col, col: -c.row }));
}

function normalize(cells: Cell[]): Cell[] {
  const minRow = Math.min(...cells.map(c => c.row));
  const minCol = Math.min(...cells.map(c => c.col));
  return cells.map(c => ({ row: c.row - minRow, col: c.col - minCol }));
}

function cellsKey(cells: Cell[]): string {
  return cells
    .map(c => `${c.row},${c.col}`)
    .sort()
    .join("|");
}

function neighbors(c: Cell): Cell[] {
  return [
    { row: c.row - 1, col: c.col },
    { row: c.row + 1, col: c.col },
    { row: c.row, col: c.col - 1 },
    { row: c.row, col: c.col + 1 },
  ];
}

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function colorForIndex(i: number): string {
  const hue = (i * 137.5) % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

function key(c: Cell): string {
  return `${c.row},${c.col}`;
}

function parseKey(k: string): Cell {
  const [row, col] = k.split(",").map(Number);
  return { row, col };
}
