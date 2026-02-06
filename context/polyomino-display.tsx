import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type PolyominoDisplayMode = "tray" | "roller";

type PolyominoDisplayContextValue = {
  mode: PolyominoDisplayMode;
  setMode: (mode: PolyominoDisplayMode) => void;
};

const PolyominoDisplayContext = createContext<PolyominoDisplayContextValue>({
  mode: "tray",
  setMode: () => {},
});

export function PolyominoDisplayProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mode, setMode] = useState<PolyominoDisplayMode>("tray");
  const value = useMemo(() => ({ mode, setMode }), [mode]);

  return (
    <PolyominoDisplayContext.Provider value={value}>
      {children}
    </PolyominoDisplayContext.Provider>
  );
}

export function usePolyominoDisplay() {
  return useContext(PolyominoDisplayContext);
}
