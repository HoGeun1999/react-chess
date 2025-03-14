import { create } from "zustand";

interface SelectedBoardBlock {
  row: number;
  col: number;
  piece: string;
}

interface SelectedBoardBlockStore {
  selectedBoardBlock: SelectedBoardBlock | null;
  setSelectedBoardBlock: (block: SelectedBoardBlock) => void;
  resetSelectedBoardBlock: () => void;
}

const initialSelectedBoardBlockState = {
  selectedBoardBlock: null,
};

export const useSelectedBoardBlockStore = create<SelectedBoardBlockStore>((set) => ({
  ...initialSelectedBoardBlockState,
  setSelectedBoardBlock: (block) => set({ selectedBoardBlock: block }),
  resetSelectedBoardBlock: () => set(initialSelectedBoardBlockState),
}));
