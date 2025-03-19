import './ChessBoard.scss';
import React, { useEffect } from 'react';
import BoardBlock from './BoardBlock';
import { useChessBoardDataHistoryStore } from '../stores/chessBoardDataHistoryStore';
import { useTurnCountStore } from '../stores/turnCountStore';
import { isKingCheckPieceLocation, canPieceAttack } from '../function/isKingCheckPieceLocation';


const ChessBoard: React.FC = () => {
  const { boardDataHistory } = useChessBoardDataHistoryStore();
  const { turnCount } = useTurnCountStore();

  useEffect(() => {
    const currentBoard = boardDataHistory[turnCount];
    console.log('check')
    const attackingPieceLocation = isKingCheckPieceLocation(currentBoard)
    if (attackingPieceLocation) {
      const isCheckmate = checkCheckmate(
        currentBoard, 
        turnCount % 2 === 0 ? 'w' : 'b', 
        { row: attackingPieceLocation.i, col: attackingPieceLocation.j }
      );
      if (isCheckmate) {
        alert('체크메이트!');
      }
    }
  }, [turnCount,boardDataHistory]);

  const checkCheckmate = (board: any[][], turnColor: string, attackingPieceLocation:{row:number,col:number}): boolean => {
    const kingPosition = findKingPosition(board, turnColor);
    if (!kingPosition) return false;

    if (canCaptureAttackingPiece(board, turnColor, attackingPieceLocation)) {
      console.log(1)
      return false; // 체크한 상대 기물을 잡을 수 있으면 체크메이트 아님
    }

    if (canBlockCheck(board, kingPosition, turnColor, attackingPieceLocation)) {
      console.log(2)
      return false; // 체크를 막을 수 있으면 체크메이트 아님
    }

    if (canKingEscape(board, kingPosition, turnColor)) {
      console.log(3)
      return false; // 킹이 도망갈 수 있으면 체크메이트 아님
    }

    return true; // 위 세 조건이 모두 해당되지 않으면 체크메이트
  };

  const findKingPosition = (board: any[][], turnColor: string): { row: number, col: number } | null => {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === `${turnColor}k`) {
          return { row, col };
        }
      }
    }
    return null;
  };

  const canCaptureAttackingPiece = (
    board: string[][],
    turnColor: string,
    attackingPieceLocation: { row: number; col: number }
  ): boolean => {
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (piece && piece[0] === turnColor) {
          const pieceType = piece[1];
          if (canPieceAttack(pieceType, { row, col }, attackingPieceLocation, board)) {
            const newBoard = board.map(row => [...row]); 
            newBoard[attackingPieceLocation.row][attackingPieceLocation.col] = piece;
            newBoard[row][col] = ''; 

            if (!isKingCheckPieceLocation(newBoard)) {
              return true; 
            }
          }
        }
      }
    }
    return false;
  };
  
  const canBlockCheck = (
    board: string[][],
    kingPosition: { row: number; col: number },
    turnColor: string,
    attackingPieceLocation: { row: number; col: number }
  ): boolean => {
    const attackingPiece = board[attackingPieceLocation.row][attackingPieceLocation.col];
  
    if (attackingPiece[1] === 'n') {
      return false;
    }
  
    const dx = Math.sign(kingPosition.col - attackingPieceLocation.col);
    const dy = Math.sign(kingPosition.row - attackingPieceLocation.row);
  
    let path = [];
    let x = attackingPieceLocation.col + dx;
    let y = attackingPieceLocation.row + dy;
  
    while (x !== kingPosition.col || y !== kingPosition.row) {
      path.push({ row: y, col: x });
      x += dx;
      y += dy;
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece && piece[0] === turnColor && piece[1] !== 'k') {
          for (const pos of path) {
            if (canPieceAttack(piece[1], { row: i, col: j }, pos, board)) {
              return true;
            }
          }
        }
      }
    }
  
    return false;
  };
  
  const canKingEscape = (
    board: string[][],
    kingPosition: { row: number; col: number },
    turnColor: string
  ): boolean => {
    const directions = [
      { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
      { row: 0, col: -1 },                         { row: 0, col: 1 },
      { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
    ];
  
    for (const { row: dRow, col: dCol } of directions) {
      const newRow = kingPosition.row + dRow;
      const newCol = kingPosition.col + dCol;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetPiece = board[newRow][newCol];
  
        if (!targetPiece || targetPiece[0] !== turnColor) {
          const newBoard = board.map(row => [...row]);
          newBoard[kingPosition.row][kingPosition.col] = '';
          newBoard[newRow][newCol] = `${turnColor}k`;
  
          if (!isKingCheckPieceLocation(newBoard)) {
            return true;
          }
        }
      }
    }
  
    return false;
  };
  

  return (
    <div className="chess-board">
      {boardDataHistory[turnCount].map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((piece, colIndex) => (
            <BoardBlock
              key={`${rowIndex}-${colIndex}`}
              row={rowIndex}
              col={colIndex}
              piece={piece}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default ChessBoard;
