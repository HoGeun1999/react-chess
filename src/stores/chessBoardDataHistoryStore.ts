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
];

export const useChessBoardDataHistoryStore = create<chessBoardDataHistoryStore>((set) => ({
  boardDataHistory: startingBoardDataHistory,

  resetBoardDataHistory: () => set({ boardDataHistory: startingBoardDataHistory }),

  addBoardDataHistory: (turnCount: number, boardData: string[][]) =>
    set((state) => ({
      boardDataHistory: [
        ...state.boardDataHistory.slice(0, turnCount + 1),
        structuredClone(boardData),
      ],
    })),

  setBoardDataHistory: (row: number, col: number, piece: string) =>
    set((state) => {
      const lastBoard = state.boardDataHistory[state.boardDataHistory.length - 1];
      lastBoard[row][col] = piece; // 기존 배열을 직접 변경

      return { boardDataHistory: [...state.boardDataHistory] }; // 참조가 변경되지 않으면 Zustand가 감지 못하므로 새로운 배열로 반환
    }),
}));
