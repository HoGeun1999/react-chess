import { create } from "zustand";

interface chessBoardDataHistoryStore {
  boardDataHistory: Record<number, string[][]>
  resetBoardDataHistory: () => void
  addBoardDataHistory: (turnCount:number, boardData:string[][]) => void
}

const startingBoardDataHistory = {
  0 : [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
  ]
}

export const useChessBoardDataHistoryStore = create<chessBoardDataHistoryStore>((set) => ({
  boardDataHistory: startingBoardDataHistory,
  resetBoardDataHistory: () => set({ boardDataHistory: startingBoardDataHistory }),

  addBoardDataHistory: (turnCount:number, boardData:string[][]) =>
    set((state) => ({
      boardDataHistory: {
        ...state.boardDataHistory,
        [turnCount]: structuredClone(boardData),
      },
    })),
}))