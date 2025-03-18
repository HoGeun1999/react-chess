import { useTurnCountStore } from "../stores/turnCountStore";

export const canPieceAttack = (
  pieceType: string,
  from: { row: number; col: number },
  to: { row: number; col: number },
  board: string[][]
): boolean => {
  const dx = to.col - from.col;
  const dy = to.row - from.row;

  switch (pieceType) {
    case 'p': {
      const direction = board[from.row][from.col][0] === 'w' ? -1 : 1;
      return dy === direction && Math.abs(dx) === 1;
    }
    case 'n': {
      return (Math.abs(dx) === 2 && Math.abs(dy) === 1) || (Math.abs(dx) === 1 && Math.abs(dy) === 2);
    }
    case 'b': {
      return isClearPath(from, to, board) && Math.abs(dx) === Math.abs(dy);
    }
    case 'r': {
      return isClearPath(from, to, board) && (dx === 0 || dy === 0);
    }
    case 'q': {
      return isClearPath(from, to, board) && (Math.abs(dx) === Math.abs(dy) || dx === 0 || dy === 0);
    }
    case 'k': {
      return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
    }
    default:
      return false;
  }
};

const isClearPath = (
  from: { row: number; col: number },
  to: { row: number; col: number },
  board: string[][]
): boolean => {
  const dx = Math.sign(to.col - from.col);
  const dy = Math.sign(to.row - from.row);

  let x = from.col + dx;
  let y = from.row + dy;

  while (x !== to.col || y !== to.row) {
    if (y < 0 || y >= 8 || x < 0 || x >= 8) {
      return false;
    }

    if (board[y][x] !== '') {
      return false;
    }

    x += dx;
    y += dy;
  }

  return true;
};

export const isKingCheckPieceLocation = (currentBoard: string[][]) => {
  const turnCount = useTurnCountStore.getState().turnCount;
  const currentPlayer = turnCount % 2 === 0 ? 'w' : 'b';
  const opponentPlayer = currentPlayer === 'w' ? 'b' : 'w';

  let kingPosition = { row: -1, col: -1 };
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (currentBoard[i][j] === `${currentPlayer}k`) {
        kingPosition = { row: i, col: j };
        break;
      }
    }
  }

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = currentBoard[i][j];
      if (piece && piece[0] === opponentPlayer) {
        if (canPieceAttack(piece[1], { row: i, col: j }, kingPosition, currentBoard)) {
          return { i, j };
        }
      }
    }
  }

  return false;
};
