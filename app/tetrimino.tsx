import { View, Button, StyleSheet } from "react-native";
import { useState } from "react";

import Board from "@/components/Board";
import { generateFilledBoard } from "@/game/generateFullBoard";

export default function TetriminoScreen() {
  const [state, setState] = useState(generateFilledBoard());

  return (
    <View style={styles.container}>
      <Board
        blob={state.blob}
        pieces={state.pieces}
        gridSize={state.gridSize}
      />
      <Button
        title="Generate New Board"
        onPress={() => setState(generateFilledBoard())}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 80,
  },
});
