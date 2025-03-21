import { useTurnCountStore } from '../../stores/turnCountStore'
import { useChessBoardDataHistoryStore } from '../../stores/chessBoardDataHistoryStore'
import { useSelectedBoardBlockStore } from '../../stores/selectedBoardBlockStore'


const NextTurnButton = () => {
  const { turnCount, increaseTurnCount } = useTurnCountStore()
  const { boardDataHistory } = useChessBoardDataHistoryStore.getState()
  const { resetSelectedBoardBlock } = useSelectedBoardBlockStore()

  const onclickNextTurnButton = () => {
    if(turnCount<boardDataHistory.length-1){
      resetSelectedBoardBlock()
      increaseTurnCount()
    }
  }

  return (
    <div>
      <button onClick={onclickNextTurnButton} className='action-button'>Next Turn</button>
    </div>
  )
}

export default NextTurnButton