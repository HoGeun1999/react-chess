import './App.scss'
import ChessBoard from './components/ChessBoard'
import PrevTurnButton from './components/Buttons/PrevTurnButton'
import NextTurnButton from './components/Buttons/NextTurnButton'
import PromotionBox from './components/PromotionBox'
import GameHistoryBoard from './components/GameHistoryBoard/GameHistoryBoard'
import EndGamePopup from './components/EndGamePopup'
import RestartButton from './components/Buttons/RestartButton'
import CheckPopup from './components/CheckPopup'
function App() {

  return (
    <div className='app-grid-container'>  
      <div>
        <ChessBoard />
      </div>
      <div>
        <GameHistoryBoard />
      </div>
      <PrevTurnButton/>
      <NextTurnButton/>
      <RestartButton/>
      <PromotionBox/>
      <EndGamePopup/>
      <CheckPopup/>
    </div>
  )
}

export default App
