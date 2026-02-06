import { View, Text, StyleSheet, Switch } from "react-native";
import { usePolyominoDisplay } from "@/context/polyomino-display";

export default function SettingsScreen() {
  const { mode, setMode } = usePolyominoDisplay();
  const isTray = mode === "tray";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.row}>
        <View style={styles.labelBlock}>
          <Text style={styles.label}>Polyominoes display</Text>
          <Text style={styles.value}>
            {isTray ? "Piece Tray" : "Piece Roller"}
          </Text>
        </View>
        <Switch
          value={isTray}
          onValueChange={value => setMode(value ? "tray" : "roller")}
          trackColor={{ false: "#2a2a2a", true: "#6c9cff" }}
          thumbColor={isTray ? "#e6efff" : "#f1f1f1"}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#0f0f0f",
  },
  title: {
    fontSize: 22,
    color: "#f1f1f1",
    fontWeight: "600",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  labelBlock: {
    flex: 1,
    paddingRight: 12,
  },
  label: {
    fontSize: 16,
    color: "#f1f1f1",
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    color: "#9aa0a6",
  },
});
