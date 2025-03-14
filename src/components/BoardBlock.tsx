import './BoardBlock.scss'
import React from "react"
import ChessPiece from './ChessPiece';

interface BoardBlockProps {
  row: number; 
  col: number;  
  piece: string;
}

const BoardBlock:React.FC<BoardBlockProps> = React.memo(({ row, col, piece }) => {
  console.log(row,col)
  const boardBlockColor = () => { 
    if (row % 2 === 0) {
      return col % 2 === 0 ? 'white' : 'black';
    } else {
      return col % 2 === 0 ? 'black' : 'white';
    }
  }

  const selectMoveBoardBlock = () => {
    console.log('click',row,col)
  }

  return (
    <div className={`board-block ${boardBlockColor()}`} onClick={selectMoveBoardBlock}>
      <ChessPiece
        key={`${row}-${col}`}
        piece={piece}
      />
    </div>
  )
})

export default BoardBlock

