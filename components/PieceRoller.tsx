import { View, StyleSheet, PanResponder } from "react-native";
import { useMemo, useRef, useState } from "react";
import { PlacedPiece } from "@/game/types";

type PieceRollerProps = {
  pieces?: PlacedPiece[];
  cellSize?: number;
};

const CELL_SIZE = 32;
const DIAMETER = 720;
const RADIUS = DIAMETER / 2;
const VIEW_SIZE = 440;
const ROTATE_SENSITIVITY = 140;

export default function PieceRoller({ pieces, cellSize }: PieceRollerProps) {
  const size = cellSize ?? CELL_SIZE;
  const list = pieces ?? [];
  const [angle, setAngle] = useState(0);
  const angleRef = useRef(0);
  const startRef = useRef(0);

  angleRef.current = angle;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          startRef.current = angleRef.current;
        },
        onPanResponderMove: (_, gesture) => {
          const next = startRef.current + gesture.dx / ROTATE_SENSITIVITY;
          setAngle(next);
        },
      }),
    []
  );

  const center = RADIUS;
  const originX = VIEW_SIZE - RADIUS;
  const originY = VIEW_SIZE - RADIUS;
  const baseSpacing = (Math.PI * 2) / Math.max(1, list.length);

  return (
    <View style={styles.viewport} {...panResponder.panHandlers}>
      <View style={styles.roller}>
        {list.map((piece, index) => {
          const rows = piece.cells.map(c => c.row);
          const cols = piece.cells.map(c => c.col);
          const minRow = Math.min(...rows);
          const maxRow = Math.max(...rows);
          const minCol = Math.min(...cols);
          const maxCol = Math.max(...cols);
          const width = (maxCol - minCol + 1) * size;
          const height = (maxRow - minRow + 1) * size;
          const pieceRadius =
            RADIUS - Math.max(width, height) / 2 - size * 0.3;
          const theta = angle + index * baseSpacing;
          const left = center + Math.cos(theta) * pieceRadius - width / 2;
          const top = center + Math.sin(theta) * pieceRadius - height / 2;
          const viewLeft = left + originX;
          const viewTop = top + originY;
          const viewRight = viewLeft + width;
          const viewBottom = viewTop + height;

          if (
            viewRight < 0 ||
            viewLeft > VIEW_SIZE ||
            viewBottom < 0 ||
            viewTop > VIEW_SIZE
          ) {
            return null;
          }

          return (
            <View
              key={piece.id}
              style={[styles.pieceBox, { width, height, left, top }]}
            >
              {piece.cells.map((cell, cellIndex) => (
                <View
                  key={`${piece.id}-${cellIndex}`}
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
        <View style={styles.circle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: VIEW_SIZE,
    height: VIEW_SIZE,
    overflow: "hidden",
  },
  roller: {
    width: DIAMETER,
    height: DIAMETER,
    position: "absolute",
    right: -RADIUS,
    bottom: -RADIUS,
  },
  circle: {
    position: "absolute",
    width: DIAMETER,
    height: DIAMETER,
    borderRadius: RADIUS,
    borderWidth: 2,
    borderColor: "#2a2a2a",
  },
  pieceBox: {
    position: "absolute",
  },
  pieceCell: {
    position: "absolute",
    borderWidth: 1.5,
  },
});
