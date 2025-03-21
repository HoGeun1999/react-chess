import './EndGamePopup.scss'
import { useEndGameTypeStore } from '../stores/endGameTypeStore'

const EndGamePopup = () => {
  const {endGameType} = useEndGameTypeStore()
  if (endGameType === '') return null


  return (
    <div className="end-game-popup">
      {endGameType}
    </div>
  )
}

export default EndGamePopup