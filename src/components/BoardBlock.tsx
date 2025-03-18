import './BoardBlock.scss'
import React from "react"
import ChessPiece from './ChessPiece';
import { useTurnCountStore } from '../stores/turnCountStore'
import { useSelectedBoardBlockStore } from '../stores/selectedBoardBlockStore';
import { useChessBoardDataHistoryStore } from '../stores/chessBoardDataHistoryStore';
import { isKingCheckPieceLocation } from '../function/isKingCheckPieceLocation';
import { useCheckPawnLastMoveStore } from '../stores/checkPawnLastMoveStore';
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
  const isSelected = selectedBoardBlock && selectedBoardBlock.row === row && selectedBoardBlock.col === col;
  const boardData = boardDataHistory[turnCount]
  let isEnPassant = false
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
    addBoardDataHistory(turnCount, newBoardData)
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
  
    return false;
  };
  
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

