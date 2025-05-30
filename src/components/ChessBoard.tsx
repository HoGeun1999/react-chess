import './ChessBoard.scss';
import React, { useEffect } from 'react';
import BoardBlock from './BoardBlock';
import { useChessBoardDataHistoryStore } from '../stores/chessBoardDataHistoryStore';
import { useTurnCountStore } from '../stores/turnCountStore';
import { isKingCheckPieceLocation, canPieceAttack } from '../function/isKingCheckPieceLocation';
import { useCheckPawnLastMoveStore } from '../stores/checkPawnLastMoveStore';
import { useFiftyMoveDrawCountStore } from '../stores/fiftyMoveDrawCountStore'
import { useEndGameTypeStore } from '../stores/endGameTypeStore';
import { useIsPromotionStore } from '../stores/isPromotionStore';
const ChessBoard: React.FC = () => {
  const { boardDataHistory } = useChessBoardDataHistoryStore();
  const { turnCount } = useTurnCountStore();
  const { prevTurnDoubleForwardMovePawnLocation } = useCheckPawnLastMoveStore();
  const { fiftyMoveDrawCount } = useFiftyMoveDrawCountStore();
  const { setIsGameEnd, setEndGameType } = useEndGameTypeStore();
  const {setIsPromotion} = useIsPromotionStore();
  
  useEffect(() => {
    const currentBoard = boardDataHistory[turnCount];

    const attackingPieceLocation = isKingCheckPieceLocation(currentBoard)
    if (attackingPieceLocation) {
      const isCheckmate = checkCheckmate(
        currentBoard, 
        turnCount % 2 === 0 ? 'w' : 'b', 
        { row: attackingPieceLocation.i, col: attackingPieceLocation.j }
      );
      if (isCheckmate) {
        setIsGameEnd(true);
        setEndGameType('체크메이트!');
      }
    }

    for(let i=0;i<8;i++){
      for(let j=0;j<8;j++){
        if(currentBoard[i][j]==='wp' && i === 0){
          setIsPromotion(true)
        }
        else if(currentBoard[i][j]==='bp' && i === 7){
          setIsPromotion(true)
        }
      }
    }


    if(lackPieceDraw(currentBoard)){
      setIsGameEnd(true);
      setEndGameType('기물부족 무승부')
    }

    if(checkStalemate(currentBoard,turnCount%2===0?'w':'b')){
      setIsGameEnd(true);
      setEndGameType('스테일메이트');
    }

    if(threeFoldRepetition()){
      setIsGameEnd(true);
      setEndGameType('3수 동형 무승부')
    }
    
    if(fiftyMoveDrawCount>=50){
      setIsGameEnd(true);
      setEndGameType('50회 무승부')
    }



  }, [turnCount,boardDataHistory]);

  const checkCheckmate = (board: any[][], turnColor: string, attackingPieceLocation:{row:number,col:number}): boolean => {
    const kingPosition = findKingPosition(board, turnColor);
    if (!kingPosition) return false;

    if (canCaptureAttackingPiece(board, turnColor, attackingPieceLocation)) {
      return false; // 체크한 상대 기물을 잡을 수 있으면 체크메이트 아님
    }

    if (canBlockCheck(board, kingPosition, turnColor, attackingPieceLocation)) {
      return false; // 체크를 막을 수 있으면 체크메이트 아님
    }

    if (canKingEscape(board, kingPosition, turnColor)) {
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

  const lackPieceDraw = (board: string[][]): boolean => {
    const whitePieces: string[] = []
    const blackPieces: string[] = []
  
    // 보드에서 남아있는 기물들을 분류
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell !== '') {
          if (cell.startsWith('w')) whitePieces.push(cell)
          else if (cell.startsWith('b')) blackPieces.push(cell)
        }
      })
    })
  
    // 1. 킹만 남아있는 경우 (wk, bk만 존재)
    if (whitePieces.length === 1 && blackPieces.length === 1) {
      return true
    }
  
    // 2. 한쪽이 킹만 있고, 다른 쪽이 '킹+나이트' 또는 '킹+비숍'만 있는 경우
    if (
      (whitePieces.length === 1 && blackPieces.length === 2 && (blackPieces.includes('bn') || blackPieces.includes('bb'))) ||
      (blackPieces.length === 1 && whitePieces.length === 2 && (whitePieces.includes('wn') || whitePieces.includes('wb')))
    ) {
      return true
    }
  
    // 3. 킹+2나이트 vs 킹
    if (
      (whitePieces.length === 3 && whitePieces.filter(p => p === 'wn').length === 2 && blackPieces.length === 1) ||
      (blackPieces.length === 3 && blackPieces.filter(p => p === 'bn').length === 2 && whitePieces.length === 1)
    ) {
      return true
    }
  
    // 4. 킹+나이트 or 비숍 vs 킹+나이트 or 비숍
    if (
      whitePieces.length === 2 && blackPieces.length === 2 &&
      (whitePieces.includes('wn') || whitePieces.includes('wb')) &&
      (blackPieces.includes('bn') || blackPieces.includes('bb'))
    ) {
      return true
    }
  
    return false
  }
  

  const checkStalemate = (board: any[][], turnColor: string): boolean => {
    if (isKingCheckPieceLocation(boardDataHistory[turnCount])){ // 현재 킹의 위치가 체크상태면 스테일 메이트 x
      return false
    }

    const canMove = (row: number, col: number, piece: string, board: any[][]): boolean => {
      const isValidPosition = (r: number, c: number): boolean => r >= 0 && r < 8 && c >= 0 && c < 8;
      const isOpponentPiece = (r: number, c: number): boolean => isValidPosition(r, c) && board[r][c] && board[r][c][0] !== piece[0];
      const isEmpty = (r: number, c: number): boolean => isValidPosition(r, c) && board[r][c] === null;
    
      switch (piece[1]) {
        case 'p': { // ✅ 폰 (Pawn)
          const direction = piece[0] === 'w' ? -1 : 1;
          const startRow = piece[0] === 'w' ? 6 : 1;
    
          if (isEmpty(row + direction, col)) return true;
          if (row === startRow && isEmpty(row + direction, col) && isEmpty(row + 2 * direction, col)) return true;
          if (isOpponentPiece(row + direction, col - 1) || isOpponentPiece(row + direction, col + 1)) return true;
    
          if (prevTurnDoubleForwardMovePawnLocation) {
            if (
              row + direction === prevTurnDoubleForwardMovePawnLocation.row &&
              (col + 1 === prevTurnDoubleForwardMovePawnLocation.col || col - 1 === prevTurnDoubleForwardMovePawnLocation.col)
            ) {
              return true;
            }
          }
          break;
        }
    
        case 'r': // ✅ 룩 (Rook)
        case 'b': // ✅ 비숍 (Bishop)
        case 'q': { // ✅ 퀸 (Queen)
          const directions = {
            r: [{ r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 }], // 룩: 상하좌우
            b: [{ r: -1, c: -1 }, { r: -1, c: 1 }, { r: 1, c: -1 }, { r: 1, c: 1 }], // 비숍: 대각선
            q: [
              { r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 },
              { r: -1, c: -1 }, { r: -1, c: 1 }, { r: 1, c: -1 }, { r: 1, c: 1 }
            ] // 퀸: 상하좌우 + 대각선
          };
    
          for (const { r, c } of directions[piece[1]]) {
            let newRow = row + r, newCol = col + c;
            while (isValidPosition(newRow, newCol)) {
              if (isEmpty(newRow, newCol)) return true;
              if (isOpponentPiece(newRow, newCol)) return true;
              
              newRow += r;
              newCol += c;
            }
          }
          break;
        }
    
        case 'n': { // ✅ 나이트 (Knight)
          const knightMoves = [
            { r: -2, c: -1 }, { r: -2, c: 1 }, { r: -1, c: -2 }, { r: -1, c: 2 },
            { r: 1, c: -2 }, { r: 1, c: 2 }, { r: 2, c: -1 }, { r: 2, c: 1 }
          ];
    
          for (const { r, c } of knightMoves) {
            if (isValidPosition(row + r, col + c) && (isEmpty(row + r, col + c) || isOpponentPiece(row + r, col + c))) {
              return true;
            }
          }
          break;
        }
    
        default:
          return false;
      }
    
      return false;
    };
    
    

    let kingPosition = { row: -1, col: -1 };
  
    // 현재 turnColor의 기물이 이동할 수 있는지 확인
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {

        const piece = board[row][col];
  
        if (!piece || piece[0] !== turnColor) continue; // 해당 칸이 비었거나 상대방 기물인 경우 무시
  
        if (piece[1] === 'k') {
          kingPosition = { row, col }; // 킹의 위치 저장
          continue
        }
        if (canMove(row, col, piece, board)) {
          return false; // 하나라도 움직일 수 있으면 스테일메이트 아님
        }
      }
    }

    // 킹이 이동할 수 있는지 확인
    const { row: kRow, col: kCol } = kingPosition;
    const kingMoves = [
      { r: -1, c: -1 }, { r: -1, c: 0 }, { r: -1, c: 1 },
      { r: 0, c: -1 }, /* (킹) */ { r: 0, c: 1 },
      { r: 1, c: -1 }, { r: 1, c: 0 }, { r: 1, c: 1 },
    ];
  
    for (const { r, c } of kingMoves) {
      const newRow = kRow + r, newCol = kCol + c;
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && board[newRow][newCol][0] !== turnColor) {
        const newBoard = structuredClone(board);  // 깊은 복사
        newBoard[kRow][kCol] = null;  // 기존 위치 비우기
        newBoard[newRow][newCol] = `${turnColor}k`;  // 킹 이동
  
        if (!isKingCheckPieceLocation(newBoard)) {
          return false; // 킹이 이동할 수 있으면 스테일메이트 아님
        }
      }
    }
  
    return true; // 모든 경우의 수를 확인한 결과, 이동할 수 있는 기물이 없으면 스테일메이트
  };
  
  const threeFoldRepetition = (): boolean => {
    if (turnCount < 9) return false; 
  
    const isSameBoard = (turn1: number, turn2: number) => {
      if (turn1 < 0 || turn2 < 0) return false; 
      return JSON.stringify(boardDataHistory[turn1]) === JSON.stringify(boardDataHistory[turn2]);
    };
  
    // 각각의 조건을 독립적으로 확인
    const condition1 = isSameBoard(turnCount, turnCount - 4) && isSameBoard(turnCount, turnCount - 8)
    const condition2 = isSameBoard(turnCount - 2, turnCount - 6);
    const condition3 = isSameBoard(turnCount - 1, turnCount - 5) && isSameBoard(turnCount-1,turnCount-9);
    const condition4 = isSameBoard(turnCount - 3, turnCount - 7);
  
    return condition1 && condition2 && condition3 && condition4;
  };


  return (
    <div className="chess-board">
      {boardDataHistory[turnCount] ? (
        boardDataHistory[turnCount].map((row, rowIndex) => (
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
        ))
      ) : (
        <div>Invalid board state</div> // 예외 처리
      )}
    </div>
);
}


export default ChessBoard;
