import './BoardBlock.scss'
import React from "react"
import ChessPiece from './ChessPiece';
import { useTurnCountStore } from '../stores/turnCountStore'
import { useSelectedBoardBlockStore } from '../stores/selectedBoardBlockStore';
import { useChessBoardDataHistoryStore } from '../stores/chessBoardDataHistoryStore';
import { isKingCheckPieceLocation } from '../function/isKingCheckPieceLocation';
import { useCheckPawnLastMoveStore } from '../stores/checkPawnLastMoveStore';
import { useCastlingCheckStore } from '../stores/castlingCheckStore';
import { useFiftyMoveDrawCountStore } from '../stores/fiftyMoveDrawCountStore'

interface BoardBlockProps {
  row: number; 
  col: number;  
  piece: string;
}

const BoardBlock:React.FC<BoardBlockProps> = React.memo(({ row, col, piece }) => {
  const { turnCount, increaseTurnCount } = useTurnCountStore()
  const { selectedBoardBlock, setSelectedBoardBlock } = useSelectedBoardBlockStore();
  const { boardDataHistory, addBoardDataHistory } = useChessBoardDataHistoryStore();
  const { prevTurnDoubleForwardMovePawnLocation, setprevTurnDoubleForwardMovePawnLocation } = useCheckPawnLastMoveStore();
  const { leftWhiteRook, rightWhiteRook, leftBlackRook, rightBlackRook, whiteKing, blackKing, setLeftWhiteRook, setRightWhiteRook, setLeftBlackRook, setRightBlackRook, setWhiteKing, setBlackKing } = useCastlingCheckStore();
  const { fiftyMoveDrawCount, setFiftyMoveDrawCount, increaseFiftyMoveDrawCount } = useFiftyMoveDrawCountStore();

  const isSelected = selectedBoardBlock && selectedBoardBlock.row === row && selectedBoardBlock.col === col;
  const boardData = boardDataHistory[turnCount]
  let isEnPassant = false
  let isCastling = false
  // console.log(row)
  // console.log(boardDataHistory)
  
  const boardBlockColor = ():string => {
    if (row % 2 === 0) {
      return col % 2 === 0 ? 'white' : 'black';
    } else {
      return col % 2 === 0 ? 'black' : 'white';
    }
  }

  const clickBoardBlock = () => {
    if (!selectedBoardBlock) {
      if (turnCount % 2 === 0 && boardData[row][col][0] === 'w') {
        setSelectedBoardBlock({ row, col, piece });
      } else if (turnCount % 2 === 1 && boardData[row][col][0] === 'b') {
        setSelectedBoardBlock({ row, col, piece });
      }
    } else {
      if (boardData[row][col] === '' || piece[0] !== selectedBoardBlock.piece[0]) {
        const newBoardData = makeNewBoardData();
        const isKingCheck = isKingCheckPieceLocation(newBoardData);
        const pieceType = selectedBoardBlock.piece[1];

        let canMove = false;

        switch (pieceType) {
          case 'p':
            canMove = checkCanMovePawn();
            break;
          case 'r':
            canMove = checkCanMoveRook();
            break;
          case 'n':
            canMove = checkCanMoveKnight();
            break;
          case 'b':
            canMove = checkCanMoveBishop();
            break;
          case 'q':
            canMove = checkCanMoveQueen();
            break;
          case 'k':
            canMove = checkCanMoveKing();
            break;
          default:
            break;
        }

        if (canMove && !isKingCheck) {
          if(pieceType !== 'p'){
            setprevTurnDoubleForwardMovePawnLocation(null)
          }
          updateMoveToBoardData();
        } else if(isKingCheck){
          alert('체크');
        }
      } else {
        setSelectedBoardBlock({ row, col, piece });
      }
    }
  };


  const updateMoveToBoardData = ():void => {
    const newBoardData = makeNewBoardData()
    if(selectedBoardBlock?.piece === 'wk'){
      setWhiteKing(turnCount)
    } else if(selectedBoardBlock?.piece === 'bk'){
      setBlackKing(turnCount)
    } else if(selectedBoardBlock?.piece === 'wr' && col === 0){
      setLeftWhiteRook(turnCount)
    } else if(selectedBoardBlock?.piece === 'wr' && col === 7){
      setRightWhiteRook(turnCount)
    } else if(selectedBoardBlock?.piece === 'br' && col === 0){
      setLeftBlackRook(turnCount)
    } else if(selectedBoardBlock?.piece === 'br' && col === 7){
      setRightBlackRook(turnCount)
    }
    
    if(whiteKing && whiteKing>=turnCount){
      setWhiteKing(null!)
    }
    if(blackKing && blackKing>=turnCount){
      setBlackKing(null!)
    }
    if(leftWhiteRook && leftWhiteRook>=turnCount){
      setLeftWhiteRook(null!)
    }
    if(rightWhiteRook && rightWhiteRook>=turnCount){
      setRightWhiteRook(null!)
    }
    if(leftBlackRook && leftBlackRook>=turnCount){
      setLeftBlackRook(null!)
    }
    if(rightBlackRook && rightBlackRook>=turnCount){
      setRightBlackRook(null!)
    }

    if(selectedBoardBlock!.piece[1] === 'p' || boardData[row][col] !== ''){
      setFiftyMoveDrawCount(0)
    } else{
      const reCount = boardDataHistory.length-1 - turnCount
      if(fiftyMoveDrawCount - reCount < 0){
        setFiftyMoveDrawCount(0)
        increaseFiftyMoveDrawCount();
      } else{
        setFiftyMoveDrawCount(fiftyMoveDrawCount - reCount)
        increaseFiftyMoveDrawCount();
      }
    }
    // console.log(fiftyMoveDrawCount)
    addBoardDataHistory(turnCount, newBoardData);
    increaseTurnCount();
    setSelectedBoardBlock(null!);
  };

  const makeNewBoardData = ():string[][] => {
    const { row: fromRow, col: fromCol } = selectedBoardBlock!;
    const toRow = row;
    const toCol = col;
    const newBoardData = structuredClone(boardData)
    newBoardData[toRow][toCol] = newBoardData[fromRow][fromCol];
    newBoardData[fromRow][fromCol] = '';

    if(isEnPassant&&prevTurnDoubleForwardMovePawnLocation){
      newBoardData[prevTurnDoubleForwardMovePawnLocation.row][prevTurnDoubleForwardMovePawnLocation.col] = "";
    }

    if(isCastling){
      if(row === 7 && col === 2){
        newBoardData[row][3] = newBoardData[row][0]
        newBoardData[row][0] = ''
      } else if(row === 7 && col === 6){
        newBoardData[row][5] = newBoardData[row][7]
        newBoardData[row][7] = ''
      } else if(row === 0 && col === 2){
        newBoardData[row][3] = newBoardData[row][0]
        newBoardData[row][0] = ''
      } else if(row === 0 && col === 6){
        newBoardData[row][5] = newBoardData[row][7]
        newBoardData[row][7] = ''
      }
    }

    return newBoardData
  }
  
  const checkCanMovePawn = (): boolean => {
    if (!selectedBoardBlock) return false;
    const isWhitePawn = selectedBoardBlock.piece[0] === 'w';
    const direction = isWhitePawn ? -1 : 1;
    const startingRow = isWhitePawn ? 6 : 1;
    const frontRow = selectedBoardBlock.row + direction;

    if (row === frontRow && col === selectedBoardBlock.col) {
      if (boardData[frontRow][col] === "") {
        setprevTurnDoubleForwardMovePawnLocation(null)
        return true;
      }
    }
  
    if (selectedBoardBlock.row === startingRow && row === frontRow + direction && col === selectedBoardBlock.col) {
      if (boardData[frontRow][col] === "" && boardData[frontRow + direction][col] === ""){
        setprevTurnDoubleForwardMovePawnLocation({row,col})
        return true;
      } 
    }
  
    if (row === frontRow && (col === selectedBoardBlock.col + 1 || col === selectedBoardBlock.col - 1)) {
      const targetPiece = boardData[row][col];
      if (targetPiece && targetPiece[0] !== selectedBoardBlock.piece[0]) {
        setprevTurnDoubleForwardMovePawnLocation(null)
        return true;
      }
    }

    if (prevTurnDoubleForwardMovePawnLocation) {
      if (selectedBoardBlock.row === prevTurnDoubleForwardMovePawnLocation.row && Math.abs(selectedBoardBlock.col - prevTurnDoubleForwardMovePawnLocation.col) === 1) {
        if (isWhitePawn) {
          if (row === prevTurnDoubleForwardMovePawnLocation.row - 1 && col === prevTurnDoubleForwardMovePawnLocation.col) {
            isEnPassant = true
            return true;
          }
        } else {
          if (row === prevTurnDoubleForwardMovePawnLocation.row + 1 && col === prevTurnDoubleForwardMovePawnLocation.col) {
            isEnPassant = true
            return true;
          }
        }
      }
    }
    
    return false;
  };
  
  const checkCanMoveRook = (): boolean => {
    if (!selectedBoardBlock) return false;
  
    if (selectedBoardBlock.row !== row && selectedBoardBlock.col !== col) return false;
  
    const rowDirection = row === selectedBoardBlock.row ? 0 : Math.sign(row - selectedBoardBlock.row);
    const colDirection = col === selectedBoardBlock.col ? 0 : Math.sign(col - selectedBoardBlock.col);
  
    let r = selectedBoardBlock.row + rowDirection;
    let c = selectedBoardBlock.col + colDirection;
  
    while (r !== row || c !== col) {
      if (boardData[r][c] !== "") return false;
      r += rowDirection;
      c += colDirection;
    }
  
    return boardData[row][col] === "" || boardData[row][col][0] !== selectedBoardBlock.piece[0];
  };
  
  const checkCanMoveKnight = (): boolean => {
    if (!selectedBoardBlock) return false;
  
    const dx = Math.abs(selectedBoardBlock.col - col);
    const dy = Math.abs(selectedBoardBlock.row - row);
  
    if ((dx === 2 && dy === 1) || (dx === 1 && dy === 2)) {
      return boardData[row][col] === "" || boardData[row][col][0] !== selectedBoardBlock.piece[0];
    }
  
    return false;
  };
  
  const checkCanMoveBishop = (): boolean => {
    if (!selectedBoardBlock) return false;
  
    if (Math.abs(selectedBoardBlock.row - row) !== Math.abs(selectedBoardBlock.col - col)) return false;
  
    const rowDirection = Math.sign(row - selectedBoardBlock.row);
    const colDirection = Math.sign(col - selectedBoardBlock.col);
  
    let r = selectedBoardBlock.row + rowDirection;
    let c = selectedBoardBlock.col + colDirection;
  
    while (r !== row || c !== col) {
      if (boardData[r][c] !== "") return false;
      r += rowDirection;
      c += colDirection;
    }
  
    return boardData[row][col] === "" || boardData[row][col][0] !== selectedBoardBlock.piece[0];
  };
  
  const checkCanMoveQueen = (): boolean => {
    return checkCanMoveRook() || checkCanMoveBishop();
  };
  
  const checkCanMoveKing = (): boolean => {
    if (!selectedBoardBlock) return false;
  
    const dx = Math.abs(selectedBoardBlock.col - col);
    const dy = Math.abs(selectedBoardBlock.row - row);
  
    if (dx <= 1 && dy <= 1) {
      return boardData[row][col] === "" || boardData[row][col][0] !== selectedBoardBlock.piece[0];
    }
  
    // 캐슬링 검사
    if (selectedBoardBlock.piece === "wk" || selectedBoardBlock.piece === "bk") {
      if (selectedBoardBlock.piece === "wk") { // 백 킹
        if (row === 7 && col === 2) { // 킹이 2열로 이동하는 경우 (퀸 사이드 캐슬링)
          const rook = boardData[7][0]; // 좌측 룩
          if (rook === "wr" && !hasPieceBetween(7, 0, 7, 3) && !isKingRouteCheck(7, 4) && !isKingRouteCheck(7, 3)) {
            if (whiteKing && whiteKing < turnCount) return false;
            if (leftWhiteRook && leftWhiteRook < turnCount) return false;
            isCastling = true
            return true;
          }
        }
        if (row === 7 && col === 6) { // 킹이 6열로 이동하는 경우 (킹 사이드 캐슬링)
          const rook = boardData[7][7]; // 우측 룩
          if (rook === "wr" && !hasPieceBetween(7, 7, 7, 5) && !isKingRouteCheck(7, 4) && !isKingRouteCheck(7, 5)) {
            if (whiteKing && whiteKing < turnCount) return false;
            if (rightWhiteRook && rightWhiteRook < turnCount) return false;
            isCastling = true
            return true;
          }
        }
      } else if (selectedBoardBlock.piece === "bk") { // 흑 킹
        if (row === 0 && col === 2) { // 킹이 2열로 이동하는 경우 (퀸 사이드 캐슬링)
          const rook = boardData[0][0]; // 좌측 룩
          if (rook === "br" && !hasPieceBetween(0, 0, 0, 3) && !isKingRouteCheck(0, 4) && !isKingRouteCheck(0, 3)) {
            if (blackKing && blackKing < turnCount) return false;
            if (leftBlackRook && leftBlackRook < turnCount) return false;
            isCastling = true
            return true;
          }
        }
        if (row === 0 && col === 6) { // 킹이 6열로 이동하는 경우 (킹 사이드 캐슬링)
          const rook = boardData[0][7]; // 우측 룩
          if (rook === "br" && !hasPieceBetween(0, 7, 0, 5) && !isKingRouteCheck(0, 4) && !isKingRouteCheck(0, 5)) {
            if (blackKing && blackKing < turnCount) return false;
            if (rightBlackRook && rightBlackRook < turnCount) return false;
            isCastling = true
            return true;
          }
        }
      }
    }
    
    return false;
  };
  
  // 경로에 다른 기물이 있는지 확인하는 함수
  const hasPieceBetween = (startRow: number, startCol: number, endRow: number, endCol: number): boolean => {
    const directionRow = startRow === endRow ? 0 : startRow < endRow ? 1 : -1;
    const directionCol = startCol === endCol ? 0 : startCol < endCol ? 1 : -1;
  
    let row = startRow + directionRow;
    let col = startCol + directionCol;
  
    while (row !== endRow || col !== endCol) {
      if (boardData[row][col] !== "") {
        return true; // 기물이 있음
      }
      row += directionRow;
      col += directionCol;
    }
  
    return boardData[endRow][endCol] !== ""; // 마지막칸검사
  };
  
  const isKingRouteCheck = (row: number, col: number): boolean => {
    const newBoardData = structuredClone(boardData)
    newBoardData[selectedBoardBlock!.row][selectedBoardBlock!.col] = ''
    newBoardData[row][col] = selectedBoardBlock!.piece
    

    const isKingCheck = isKingCheckPieceLocation(newBoardData);
    if (isKingCheck) {
      return true;
    }
    return false
  }

  return (
    <div 
      className={`board-block ${boardBlockColor()} ${isSelected ? 'selected' : ''}`}
      onClick={clickBoardBlock}
    >
      <ChessPiece  
        key={`${row}-${col}`}
        piece={piece}
      />
    </div>
  )
})

export default BoardBlock

