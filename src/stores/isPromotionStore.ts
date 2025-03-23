import { create } from "zustand";

interface isPromotionStore{
  isPromotion: boolean;
  setIsPromotion: (isPromotion: boolean) => void;
  resetIsPromotion: () => void;  
}

export const useIsPromotionStore = create<isPromotionStore>((set) => ({
  isPromotion: false,
  setIsPromotion: (isPromotion) => set({ isPromotion }),
  resetIsPromotion: () => set({ isPromotion: false }),
  
}));


