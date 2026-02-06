import { Cell, PlacedPiece } from "./types";
import { fillBlobWithTetriminos } from "./fillBlobWithTetriminos";

const GRID_SIZE = 9;

export type FilledBoardResult = {
  gridSize: number;
  blob: Cell[];
  pieces: PlacedPiece[];
};

export function generateFilledBoard(): FilledBoardResult {
  const blob = fullGrid(GRID_SIZE);

  // Keep retrying until we get a perfect fill.
  // This can take time for some random runs.
  // If it becomes too slow, we can add a time budget and retry on demand.
  while (true) {
    const pieces = fillBlobWithTetriminos(blob, {
      maxRestarts: 500,
      maxTriesPerStep: 60,
    });
    if (pieces) {
      return { gridSize: GRID_SIZE, blob, pieces };
    }
  }
}

function fullGrid(size: number): Cell[] {
  const cells: Cell[] = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      cells.push({ row, col });
    }
  }
  return cells;
}
