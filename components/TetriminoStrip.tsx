import { View, StyleSheet, ScrollView } from "react-native";
import { PlacedPiece } from "@/game/types";

type TetriminoStripProps = {
  pieces?: PlacedPiece[];
  cellSize?: number;
};

const CELL_SIZE = 32;

export default function TetriminoStrip({
  pieces,
  cellSize,
}: TetriminoStripProps) {
  const size = cellSize ?? CELL_SIZE;
  const list = pieces ?? [];

  return (
    <View style={styles.bar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {list.map(piece => {
          const rows = piece.cells.map(c => c.row);
          const cols = piece.cells.map(c => c.col);
          const minRow = Math.min(...rows);
          const maxRow = Math.max(...rows);
          const minCol = Math.min(...cols);
          const maxCol = Math.max(...cols);
          const width = (maxCol - minCol + 1) * size;
          const height = (maxRow - minRow + 1) * size;

          return (
            <View
              key={piece.id}
              style={[styles.pieceBox, { width, height, marginRight: size }]}
            >
              {piece.cells.map((cell, index) => (
                <View
                  key={`${piece.id}-${index}`}
                  style={[
                    styles.pieceCell,
                    {
                      width: size,
                      height: size,
                      left: (cell.col - minCol) * size,
                      top: (cell.row - minRow) * size,
                      backgroundColor: piece.color,
                      borderColor: piece.color,
                    },
                  ]}
                />
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#111",
    marginBottom: 478,
  },
  content: {
    alignItems: "center",
  },
  pieceBox: {
    position: "relative",
  },
  pieceCell: {
    position: "absolute",
    borderWidth: 1.5,
  },
});
