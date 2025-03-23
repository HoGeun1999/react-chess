import './PromotionBox.scss';
import { useChessBoardDataHistoryStore } from '../stores/chessBoardDataHistoryStore';
import { useTurnCountStore } from '../stores/turnCountStore';
import { useIsPromotionStore } from '../stores/isPromotionStore';

const PromotionBox = () => {
  const { boardDataHistory, setBoardDataHistory } = useChessBoardDataHistoryStore();
  const { turnCount } = useTurnCountStore();
  const { isPromotion, setIsPromotion } = useIsPromotionStore();
  if(!isPromotion) return

  const currentBoard = boardDataHistory[turnCount];
  let promotionPieceColor: 'w' | 'b' | null = null;
  let promotionPawnPosition: { row: number; col: number } | null = null;

  currentBoard.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      if (cell === 'wp' && rowIndex === 0) {
        promotionPieceColor = 'w';
        promotionPawnPosition = { row: rowIndex, col: colIndex };
      } else if (cell === 'bp' && rowIndex === 7) {
        promotionPieceColor = 'b';
        promotionPawnPosition = { row: rowIndex, col: colIndex };
      }
    });
  });

  const clickPromotionPiece = (piece: string) => {
    const { row, col } = promotionPawnPosition!;
    setBoardDataHistory(row, col, piece);
    setIsPromotion(false)
  };

  return (
    <div className="promotion-container">
      {['q', 'b', 'r', 'n'].map((piece) => (
        <div key={piece} className="promotion-block" onClick={() => clickPromotionPiece(`${promotionPieceColor}${piece}`)}>
          <img
            className="piece-img"
            src={`https://assets-themes.chess.com/image/ejgfv/150/${promotionPieceColor}${piece}.png`}
            alt={`chess-piece-${piece}`}
          />
        </div>
      ))}
    </div>
  );
};

export default PromotionBox;
