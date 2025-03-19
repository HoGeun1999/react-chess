import './App.scss'
import ChessBoard from './components/ChessBoard'
import PrevTurnButton from './components/Buttons/PrevTurnButton'
import NextTurnButton from './components/Buttons/NextTurnButton'
import PromotionBox from './components/PromotionBox'
function App() {

  return (
    <div className='app-grid-container'>  
      <ChessBoard />
      <PrevTurnButton/>
      <NextTurnButton/>
      <PromotionBox/>
    </div>
  )
}

export default App
