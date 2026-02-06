export type Cell = {
  row: number;
  col: number;
};

export type PlacedPiece = {
  id: number;
  cells: Cell[];
  color: string;
};
