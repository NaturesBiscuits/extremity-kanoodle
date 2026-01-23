import { View, StyleSheet } from "react-native";
import { Cell } from "@/game/types";

type BoardProps = {
  blob: Cell[];
};

const GRID_SIZE = 9;
const CELL_SIZE = 32;

export default function Board({ blob }: BoardProps) {
  const blobSet = new Set(blob.map(c => `${c.row},${c.col}`));

  return (
    <View style={styles.board}>
      {Array.from({ length: GRID_SIZE }).map((_, row) => (
        <View key={row} style={styles.row}>
          {Array.from({ length: GRID_SIZE }).map((_, col) => {
            const isBlob = blobSet.has(`${row},${col}`);

            return (
              <View
                key={col}
                style={[
                  styles.cell,
                  isBlob && styles.blobCell,
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
    margin: 1,
  },
  blobCell: {
    backgroundColor: "#6c9cff",
  },
});
