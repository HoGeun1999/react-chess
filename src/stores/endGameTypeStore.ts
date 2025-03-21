import { create } from "zustand";

interface endGameTypeStore{
  endGameType: string
  setEndGameType: (endGameType: string) => void
  resetEndGameType: () => void
}

export const useEndGameTypeStore = create<endGameTypeStore>((set) => ({
  endGameType: "",
  setEndGameType: (endGameType) => set({ endGameType }),
  resetEndGameType: () => set({ endGameType: "" }),
}));