import { useTurnCountStore } from '../../stores/turnCountStore';
import { useChessBoardDataHistoryStore } from '../../stores/chessBoardDataHistoryStore';
import { useCastlingCheckStore } from '../../stores/castlingCheckStore';
import { useCheckPawnLastMoveStore } from '../../stores/checkPawnLastMoveStore';
import { useEndGameTypeStore } from '../../stores/endGameTypeStore';
import { useFiftyMoveDrawCountStore } from '../../stores/fiftyMoveDrawCountStore';
import { useSelectedBoardBlockStore } from '../../stores/selectedBoardBlockStore';
import { useGameHistoryStore } from '../../stores/gameHistoryStore';
const RestartButton = () => {
  const { resetTurnCount } = useTurnCountStore();
  const { resetBoardDataHistory } = useChessBoardDataHistoryStore();
  const { resetCastlingCheck } = useCastlingCheckStore();
  const { resetPrevTurnDoubleForwardMovePawnLocation } = useCheckPawnLastMoveStore();
  const { resetEndGameType, resetIsGameEnd } = useEndGameTypeStore();
  const { resetFiftyMoveDrawCount } = useFiftyMoveDrawCountStore();
  const { resetSelectedBoardBlock } = useSelectedBoardBlockStore();
  const { resetGameHistoryLog } = useGameHistoryStore();

  const clickRestartGameButton = () => {
    resetTurnCount();
    resetBoardDataHistory();
    resetCastlingCheck();
    resetPrevTurnDoubleForwardMovePawnLocation();
    resetEndGameType();
    resetFiftyMoveDrawCount();
    resetSelectedBoardBlock();
    resetGameHistoryLog();
    resetIsGameEnd();
  };

  return (
    <div className='restart-button-container'>
      <button onClick={clickRestartGameButton} className='action-button'>Restart</button>
    </div>
  );
};

export default RestartButton;
