// 새로운 store 생성: stores/historyStore.ts
import { create } from 'zustand'

interface gameHistoryStore {
  gameHistoryLog: { piece: string; move: string }[]
  setGameHistoryLog: (log: { piece: string; move: string }[]) => void
  resetGameHistoryLog: () => void
}

export const useGameHistoryStore = create<gameHistoryStore>((set) => ({
  gameHistoryLog: [],
  setGameHistoryLog: (log) => set({ gameHistoryLog: log }),
  resetGameHistoryLog: () => set({ gameHistoryLog: [] }),
}))
