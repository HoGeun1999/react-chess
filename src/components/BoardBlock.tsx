import './BoardBlock.scss'
import React from "react"
import ChessPiece from './ChessPiece';
import { useTurnCountStore } from '../stores/turnCountStore'
import { useChessBoardDataStore } from '../stores/chessBoardDataStore';
import { useSelectedBoardBlockStore } from '../stores/selectedBoardBlockStore';
import { useChessBoardDataHistoryStore } from '../stores/chessBoardDataHistoryStore';
interface BoardBlockProps {
  row: number; 
  col: number;  
  piece: string;
}

const BoardBlock:React.FC<BoardBlockProps> = React.memo(({ row, col, piece }) => {
  const { turnCount, increaseTurnCount } = useTurnCountStore()
  const { boardData , movePieceToBoardData} = useChessBoardDataStore();
  const { selectedBoardBlock, setSelectedBoardBlock } = useSelectedBoardBlockStore();
  const { addBoardDataHistory } = useChessBoardDataHistoryStore.getState();
  const isSelected = selectedBoardBlock && selectedBoardBlock.row === row && selectedBoardBlock.col === col;
  // console.log(row)
  const boardBlockColor = ():string => { 
    if (row % 2 === 0) {
      return col % 2 === 0 ? 'white' : 'black';
    } else {
      return col % 2 === 0 ? 'black' : 'white';
    }
  }

  const clickBoardBlock = () => {
    if(!selectedBoardBlock){
      if(turnCount%2 === 1 && boardData[row][col].includes('w')){ 
        setSelectedBoardBlock({row,col,piece})
      }    
      else if(turnCount%2 === 0 && boardData[row][col].includes('b')){
        setSelectedBoardBlock({row,col,piece})
      }
    }    
    else{
      if(boardData[row][col] === '' || piece[0] !== selectedBoardBlock.piece[0]){
        if(piece[1] === 'p'){
          if(checkCanMovePawn() && isKingCheck()){

          }
        }
        updateMoveToBoardData()
          increaseTurnCount
      }
      else{
        setSelectedBoardBlock({row,col,piece})
      }
    }
  }

  const updateMoveToBoardData = ():void => {
    const { row: fromRow, col: fromCol } = selectedBoardBlock!;
    const toRow = row;
    const toCol = col;
    movePieceToBoardData(fromRow, fromCol, toRow, toCol); 
    addBoardDataHistory(turnCount, boardData)
    increaseTurnCount();
    setSelectedBoardBlock(null!);
  };

  const checkCanMovePawn = () => {
        
    return true
  }

  const isKingCheck = () => {

    return true
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

