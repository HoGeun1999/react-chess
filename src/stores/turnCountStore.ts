import { create } from "zustand";

interface TurnCountStore {
  turnCount: number;
  increaseTurnCount: () => void;
  decreaseTurnCount: () => void;
  resetTurnCount: () => void;
}

const initialTurnCountState = { turnCount: 0 };

export const useTurnCountStore = create<TurnCountStore>((set) => ({
  ...initialTurnCountState,
  increaseTurnCount: () => set((state) => ({ turnCount: state.turnCount + 1 })),
  decreaseTurnCount: () => set((state) => ({ turnCount: state.turnCount - 1 })),
  resetTurnCount: () => set(initialTurnCountState),
}));
