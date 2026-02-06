import { View, StyleSheet } from "react-native";
import { Cell, PlacedPiece } from "@/game/types";

type BoardProps = {
  blob?: Cell[];
  pieces?: PlacedPiece[];
  gridSize?: number;
};

const GRID_SIZE = 9;
const CELL_SIZE = 32;

export default function Board({ blob, pieces, gridSize }: BoardProps) {
  const size = gridSize ?? GRID_SIZE;
  const blobSet = new Set((blob ?? []).map(c => key(c)));
  const pieceMap = new Map<string, string>();

  if (pieces) {
    for (const p of pieces) {
      for (const c of p.cells) {
        pieceMap.set(key(c), p.color);
      }
    }
  }

  return (
    <View style={styles.board}>
      {Array.from({ length: size }).map((_, row) => (
        <View key={row} style={styles.row}>
          {Array.from({ length: size }).map((_, col) => {
            const k = `${row},${col}`;
            const pieceColor = pieceMap.get(k);
            const isBlob = blobSet.has(k);

            return (
              <View
                key={col}
                style={[
                  styles.cell,
                  isBlob && styles.blobCell,
                  pieceColor && {
                    backgroundColor: pieceColor,
                    borderColor: pieceColor,
                  },
                ]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: "#111",
    padding: 4,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: "#f1f1f1",
    borderWidth: 1.5,
    borderColor: "#2a2a2a",
  },
  blobCell: {
    backgroundColor: "#6c9cff",
    borderColor: "#6c9cff",
  },
});

function key(c: Cell): string {
  return `${c.row},${c.col}`;
}
