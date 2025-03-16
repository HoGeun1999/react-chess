import { create } from "zustand";

interface chessBoardDataHistoryStore {
  boardDataHistory: string[][][]
  resetBoardDataHistory: () => void
  addBoardDataHistory: (turnCount:number, boardData:string[][]) => void
}

const startingBoardDataHistory = [
  [
    ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
    ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
    ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
  ]
]

export const useChessBoardDataHistoryStore = create<chessBoardDataHistoryStore>((set) => ({
  boardDataHistory: startingBoardDataHistory,
  resetBoardDataHistory: () => set({ boardDataHistory: startingBoardDataHistory }),

  addBoardDataHistory: (turnCount:number, boardData:string[][]) =>
    set((state) => {
      return {
          boardDataHistory: [
            ...state.boardDataHistory.slice(0, turnCount + 1),
            structuredClone(boardData),
          ],
        };
    }),
}))