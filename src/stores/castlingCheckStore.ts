import { create } from "zustand";

interface CastlingCheckStore {
  leftWhiteRook: number | null;
  rightWhiteRook: number | null;
  leftBlackRook: number | null;
  rightBlackRook: number | null;
  whiteKing: number | null;
  blackKing: number | null;

  setLeftWhiteRook: (turnCount: number) => void;
  setRightWhiteRook: (turnCount: number) => void;
  setLeftBlackRook: (turnCount: number) => void;
  setRightBlackRook: (turnCount: number) => void;
  setWhiteKing: (turnCount: number) => void;
  setBlackKing: (turnCount: number) => void;

  resetCastlingCheck: () => void;
}

export const useCastlingCheckStore = create<CastlingCheckStore>((set) => ({
  leftWhiteRook: null,
  rightWhiteRook: null,
  leftBlackRook: null,
  rightBlackRook: null,
  whiteKing: null,
  blackKing: null,

  setLeftWhiteRook: (turnCount) =>
    set((state) => ({
      leftWhiteRook: updatePieceMove(state.leftWhiteRook, turnCount),
    })),

  setRightWhiteRook: (turnCount) =>
    set((state) => ({
      rightWhiteRook: updatePieceMove(state.rightWhiteRook, turnCount),
    })),

  setLeftBlackRook: (turnCount) =>
    set((state) => ({
      leftBlackRook: updatePieceMove(state.leftBlackRook, turnCount),
    })),

  setRightBlackRook: (turnCount) =>
    set((state) => ({
      rightBlackRook: updatePieceMove(state.rightBlackRook, turnCount),
    })),

  setWhiteKing: (turnCount) =>
    set((state) => ({
      whiteKing: updatePieceMove(state.whiteKing, turnCount),
    })),

  setBlackKing: (turnCount) =>
    set((state) => ({
      blackKing: updatePieceMove(state.blackKing, turnCount),
    })),

  resetCastlingCheck: () =>
    set(() => ({
      leftWhiteRook: null,
      rightWhiteRook: null,
      leftBlackRook: null,
      rightBlackRook: null,
      whiteKing: null,
      blackKing: null,
    }))
  
  }));


// 상태 업데이트 로직
const updatePieceMove = (currentTurn: number | null, newTurn: number): number | null => {
  if (currentTurn === null) {
    // 처음 이동한 경우
    return newTurn;
  } else if (currentTurn > newTurn) {
    // 새로운 턴이 더 과거라면 롤백
    return null;
  }

  // 기존 턴이 더 작거나 같으면 변경하지 않음
  return currentTurn;
};
