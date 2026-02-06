import { View, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button
        title="Play Infinite"
        onPress={() => router.push("/tetrimino")}
      />
      <View style={styles.buttonSpacer} />
      <Button title="Settings" onPress={() => router.push("/settings")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSpacer: {
    height: 12,
  },
});
