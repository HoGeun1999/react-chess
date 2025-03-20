import './App.scss'
import ChessBoard from './components/ChessBoard'
import PrevTurnButton from './components/Buttons/PrevTurnButton'
import NextTurnButton from './components/Buttons/NextTurnButton'
import PromotionBox from './components/PromotionBox'
import GameHistoryBoard from './components/GameHistoryBoard/GameHistoryBoard'

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
      <PromotionBox/>
    </div>
  )
}

export default App
