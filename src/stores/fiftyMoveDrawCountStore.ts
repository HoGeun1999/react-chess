import { create } from "zustand";

interface fiftyMoveDrawCountStore{
  fiftyMoveDrawCount: number;
  setFiftyMoveDrawCount: (count: number) => void;
  increaseFiftyMoveDrawCount: () => void;
  resetFiftyMoveDrawCount: () => void;
}

export const useFiftyMoveDrawCountStore = create<fiftyMoveDrawCountStore>((set) => ({
  fiftyMoveDrawCount: 0,
  setFiftyMoveDrawCount: (count) => set({fiftyMoveDrawCount: count}),
  increaseFiftyMoveDrawCount: () => set((state) => ({fiftyMoveDrawCount: state.fiftyMoveDrawCount + 1})),
  resetFiftyMoveDrawCount: () => set({fiftyMoveDrawCount: 0}),
}));