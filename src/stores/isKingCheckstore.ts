import { create } from 'zustand';

interface isKingCheckStore {
  isCheck: boolean;
  setIsCheck: (value: boolean) => void;
}

export const useIsKingCheckStore = create<isKingCheckStore>((set) => ({
  isCheck: false,
  setIsCheck: (value) => set({ isCheck: value }),
}));
