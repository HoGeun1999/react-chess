import { create } from "zustand";

interface chessBoardDataHistoryStore {
  boardDataHistory: string[][][];
  resetBoardDataHistory: () => void;
  addBoardDataHistory: (turnCount: number, boardData: string[][]) => void;
  setBoardDataHistory: (row: number, col: number, piece: string) => void;
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
  ],
  // stalemate test board
  // [
  //   ['', '', '', '', 'bk', '', '', ''],
  //   ['', '', '', '', '', '', '', ''],
  //   ['', 'wq', '', '', '', '', 'bp', ''],
  //   ['', '', '', 'wr', '', 'wr', '', ''],
  //   ['', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', 'wp', ''],
  //   ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', '', 'wp'],
  //   ['', 'wn', 'wb', '', 'wk', 'wb', 'wn', ''],
  // ],
  // rowPieceDraw
  // [
  //   ['', '', '', 'br', 'bk', '', '', ''],
  //   ['', '', '', '', '', '', '', ''],
  //   ['', '', 'wn', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', ''],
  //   ['', '', '', '', 'wk', '', '', '']
  // ]
  // promotion test
  // [
  //   ['', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
  //   ['wp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
  //   ['', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', ''],
  //   ['', '', '', '', '', '', '', ''],
  //   ['', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
  //   ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
  // ],
];

export const useChessBoardDataHistoryStore = create<chessBoardDataHistoryStore>((set) => ({
  boardDataHistory: startingBoardDataHistory,

  resetBoardDataHistory: () => set({ boardDataHistory: startingBoardDataHistory }),

  addBoardDataHistory: (turnCount: number, boardData: string[][]) =>
    set((state) => {
      const newHistory = state.boardDataHistory.slice(0, turnCount + 1);
      newHistory.push(structuredClone(boardData));
      return { boardDataHistory: newHistory };
    }),
  

  setBoardDataHistory: (row: number, col: number, piece: string) =>
    set((state) => {
      const lastBoard = state.boardDataHistory[state.boardDataHistory.length - 1];
      lastBoard[row][col] = piece;

      return { boardDataHistory: [...state.boardDataHistory] };
    }),
}));
