import './App.scss';
import ChessBoard from './components/ChessBoard';
import PrevTurnButton from './components/Buttons/PrevTurnButton';
import NextTurnButton from './components/Buttons/NextTurnButton';
import PromotionBox from './components/PromotionBox';
import GameHistoryBoard from './components/GameHistoryBoard/GameHistoryBoard';
import EndGamePopup from './components/EndGamePopup';
import RestartButton from './components/Buttons/RestartButton';
import CheckPopup from './components/CheckPopup';

function App() {
  return (
    <div className='app-grid-container'>
      <div className='chess-board-container'>
        <ChessBoard />
      </div>
      <div className='game-history-board-container'>
        <div className='game-history-board'>
          <GameHistoryBoard />
        </div>
        <div className='button-container'>
          <PrevTurnButton />
          <NextTurnButton />
          <RestartButton />
        </div>
      </div>

      <div className='promotion-box-container'>
        <PromotionBox />
      </div>
      <div>
        <EndGamePopup />
      </div>
      <div>
        <CheckPopup />
      </div>
    </div>
  );
}

export default App;
