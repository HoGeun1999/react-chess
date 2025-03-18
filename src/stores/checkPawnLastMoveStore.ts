import { create } from "zustand";

interface CheckPawnLastMove {
  row: number;
  col: number;
}

interface checkPawnLastMoveStore {
  prevTurnDoubleForwardMovePawnLocation: CheckPawnLastMove | null;
  setprevTurnDoubleForwardMovePawnLocation: (value: CheckPawnLastMove | null) => void;
}

export const useCheckPawnLastMoveStore = create<checkPawnLastMoveStore>((set) => ({
  prevTurnDoubleForwardMovePawnLocation: null,
  setprevTurnDoubleForwardMovePawnLocation: (value: CheckPawnLastMove | null) => set(() => ({ prevTurnDoubleForwardMovePawnLocation: value })),
}));
