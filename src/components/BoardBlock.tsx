import './BoardBlock.scss'
import React from "react"
import ChessPiece from './ChessPiece';
import { useTurnCountStore } from '../stores/turnCountStore'
import { useSelectedBoardBlockStore } from '../stores/selectedBoardBlockStore';
import { useChessBoardDataHistoryStore } from '../stores/chessBoardDataHistoryStore';
import { useEffect, useState } from 'react';
interface BoardBlockProps {
  row: number; 
  col: number;  
  piece: string;
}

const BoardBlock:React.FC<BoardBlockProps> = React.memo(({ row, col, piece }) => {
  const { turnCount, increaseTurnCount } = useTurnCountStore()
  const { selectedBoardBlock, setSelectedBoardBlock } = useSelectedBoardBlockStore();
  const { boardDataHistory, addBoardDataHistory } = useChessBoardDataHistoryStore();
  const isSelected = selectedBoardBlock && selectedBoardBlock.row === row && selectedBoardBlock.col === col;
  const boardData = boardDataHistory[turnCount]
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
    if(!selectedBoardBlock){
      if(turnCount%2 === 0 && boardData[row][col].includes('w')){ 
        setSelectedBoardBlock({row,col,piece})
      }    
      else if(turnCount%2 === 1 && boardData[row][col].includes('b')){
        setSelectedBoardBlock({row,col,piece})
      }
    }    
    else{
      if(boardData[row][col] == '' || piece[0] !== selectedBoardBlock.piece[0]){
        if(selectedBoardBlock.piece[1] === 'p'){
          if(checkCanMovePawn() && !isKingCheck()){
            updateMoveToBoardData()
          }
        }
        else{
          if(!isKingCheck()){
            updateMoveToBoardData()
          }
          
        }
        
      }
      else{
        setSelectedBoardBlock({row,col,piece})
      }
    }
  }

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
    return newBoardData
  }
  
  const isCheckMate = ():boolean => {
    const newBoardData = makeNewBoardData();
    return false
  }

  const isKingCheck = (): boolean => {
    const newBoardData = makeNewBoardData();
    const currentPlayer = selectedBoardBlock!.piece[0]; // 'w' or 'b'
    const opponentPlayer = currentPlayer === 'w' ? 'b' : 'w';
  
    let kingPosition = { row: -1, col: -1 };
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (newBoardData[i][j] === `${currentPlayer}k`) {
          kingPosition = { row: i, col: j };
          break;
        }
      }
    }  

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = newBoardData[i][j];
        if (piece && piece[0] === opponentPlayer) {
          if (canPieceAttack(piece[1], { row: i, col: j }, kingPosition, newBoardData)) {
            return true;
          }
        }
      }
    }
  
    return false;
  };

  const canPieceAttack = (
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
      if (board[y][x] !== '') {
        return false;
      }
      x += dx;
      y += dy;
    }
  
    return true;
  };
  
  const checkCanMovePawn = ():boolean => {
    if(!selectedBoardBlock) return false
    const iswhitePawn = selectedBoardBlock.piece[0] === 'w';
    const direction = iswhitePawn ? -1 : 1;
    const startingRow = iswhitePawn ? 6 : 1;
    const frontRow = selectedBoardBlock.row + direction;
    if (row === frontRow && col === selectedBoardBlock.col) {
      if (boardData[frontRow][col] === "") {
        return true;
      }
    }

    if (selectedBoardBlock.row === startingRow && row === frontRow + direction && col === selectedBoardBlock.col) {
      if (boardData[frontRow][col] === "" && boardData[frontRow + direction][col] === "") {
        return true;
      }
    }

    if (row === frontRow && (col === selectedBoardBlock.col + 1 || col === selectedBoardBlock.col - 1)) {
      const targetPiece = boardData[row][col];
      if (targetPiece && targetPiece[0] !== selectedBoardBlock.piece[0]) {
        return true;
      }
    }

    // 앙파상 체크  

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

