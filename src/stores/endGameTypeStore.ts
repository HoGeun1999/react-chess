import { create } from "zustand";

interface endGameTypeStore{
  isGameEnd: boolean;
  setIsGameEnd: (isGameEnd: boolean) => void;
  resetIsGameEnd: () => void;
  endGameType: string
  setEndGameType: (endGameType: string) => void
  resetEndGameType: () => void
}

export const useEndGameTypeStore = create<endGameTypeStore>((set) => ({
  isGameEnd: false,
  setIsGameEnd: (isGameEnd) => set({ isGameEnd }),
  resetIsGameEnd: () => set({ isGameEnd: false }),
  endGameType: "",
  setEndGameType: (endGameType) => set({ endGameType }),
  resetEndGameType: () => set({ endGameType: "" }),
}));