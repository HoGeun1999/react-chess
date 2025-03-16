import './ChessBoard.scss';
import React from 'react';
import BoardBlock from './BoardBlock';
import { useChessBoardDataHistoryStore } from '../stores/chessBoardDataHistoryStore';
import { useTurnCountStore } from '../stores/turnCountStore';

const ChessBoard:React.FC = () => {
  const { boardDataHistory } = useChessBoardDataHistoryStore.getState();
  const { turnCount } = useTurnCountStore();

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
