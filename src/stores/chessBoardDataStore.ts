import { create } from "zustand";

interface chessBoardDataStore {
  boardData: string[][];
  resetBoardData: () => void;
  setBoardData: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void; // 수정
}

const startingBoardData = [
  ['br', 'bn', 'bb', 'bq', 'bk', 'bb', 'bn', 'br'],
  ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'],
  ['wr', 'wn', 'wb', 'wq', 'wk', 'wb', 'wn', 'wr'],
];

export const useChessBoardDataStore = create<chessBoardDataStore>((set) => ({
  boardData: startingBoardData,
  resetBoardData: () => set({ boardData: startingBoardData }),
  setBoardData: (fromRow, fromCol, toRow, toCol) =>
    set((state) => {
      const newBoardData = [...state.boardData]; 
      newBoardData[toRow][toCol] = newBoardData[fromRow][fromCol];
      newBoardData[fromRow][fromCol] = '';

      return {
        boardData: newBoardData, 
      };
    })
}));
