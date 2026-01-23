import { View, Button, StyleSheet } from "react-native";
import { useState } from "react";

import Board from "@/components/Board";
import { generateTetrimino } from "@/game/generateTetrimino";

export default function TetriminoScreen() {
  const [shape, setShape] = useState(generateTetrimino());

  return (
    <View style={styles.container}>
      <Board blob={shape} />
      <Button
        title="Generate New Tetrimino"
        onPress={() => setShape(generateTetrimino())}
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
