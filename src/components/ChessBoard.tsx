import './ChessBoard.scss';
import React from 'react';
import BoardBlock from './BoardBlock';
import { useChessBoardDataStore } from '../stores/chessBoardDataStore';

const ChessBoard:React.FC = () => {
  const { boardData } = useChessBoardDataStore();

  return (
    <div className="chess-board">
      {boardData.map((row, rowIndex) => (
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
