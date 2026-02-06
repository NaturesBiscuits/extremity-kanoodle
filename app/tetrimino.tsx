import { View, Button, StyleSheet } from "react-native";
import { useState } from "react";

import Board from "@/components/Board";
import TetriminoStrip from "@/components/TetriminoStrip";
import PieceRoller from "@/components/PieceRoller";
import { generateFilledBoard } from "@/game/generateFullBoard";
import { usePolyominoDisplay } from "@/context/polyomino-display";

export default function TetriminoScreen() {
  const [state, setState] = useState(generateFilledBoard());
  const { mode } = usePolyominoDisplay();

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.boardWrap}>
          <Board
            blob={state.blob}
            pieces={state.pieces}
            gridSize={state.gridSize}
          />
        </View>
        <Button
          title="Generate New Board"
          onPress={() => setState(generateFilledBoard())}
        />
      </View>
      {mode === "tray" ? (
        <TetriminoStrip pieces={state.pieces} />
      ) : (
        <PieceRoller pieces={state.pieces} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    position: "relative",
  },
  main: {
    alignItems: "center",
  },
  boardWrap: {
    marginTop: 64,
  },
});
