import './BoardBlock.scss'
import React from "react"
import ChessPiece from './ChessPiece';
import { useTurnCountStore } from '../stores/turnCountStore'
import { useChessBoardDataStore } from '../stores/chessBoardDataStore';
import { useSelectedBoardBlockStore } from '../stores/selectedBoardBlockStore';
interface BoardBlockProps {
  row: number; 
  col: number;  
  piece: string;
}

const BoardBlock:React.FC<BoardBlockProps> = React.memo(({ row, col, piece }) => {
  const { turnCount, increaseTurnCount } = useTurnCountStore()
  const { boardData , setBoardData} = useChessBoardDataStore();
  const { selectedBoardBlock, setSelectedBoardBlock } = useSelectedBoardBlockStore();
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
      if(turnCount%2 === 0 && boardData[row][col].includes('w')){ 
        setSelectedBoardBlock({row,col,piece})
      }    
      else if(turnCount%2 === 1 && boardData[row][col].includes('b')){
        setSelectedBoardBlock({row,col,piece})
      }
    }    
    else{
      if(boardData[row][col] === '' || piece[0] !== selectedBoardBlock.piece[0]){
        updateMoveToBoardData()
      }
      else{
        setSelectedBoardBlock({row,col,piece})
      }
    }
  }

  const updateMoveToBoardData = () => {
    const { row: fromRow, col: fromCol } = selectedBoardBlock!;
    const toRow = row;
    const toCol = col;
    setBoardData(fromRow, fromCol, toRow, toCol); 
    increaseTurnCount();
    setSelectedBoardBlock(null!);
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

