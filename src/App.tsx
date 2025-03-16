import './App.scss'
import ChessBoard from './components/ChessBoard'
import PrevTurnButton from './components/Buttons/PrevTurnButton'
import NextTurnButton from './components/Buttons/NextTurnButton'
function App() {

  return (
    <div className='app-grid-container'>  
      <ChessBoard />
      <PrevTurnButton/>
      <NextTurnButton/>
    </div>
  )
}

export default App
