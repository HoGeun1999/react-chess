import { useTurnCountStore } from '../../stores/turnCountStore'
import { useSelectedBoardBlockStore } from '../../stores/selectedBoardBlockStore'

const PrevTurnButton = () => {
  const { turnCount, decreaseTurnCount } = useTurnCountStore()
  const { resetSelectedBoardBlock } = useSelectedBoardBlockStore()
  
  const onclickPrevTurnButton = ():void => {
    if(turnCount>0){
      resetSelectedBoardBlock()
      decreaseTurnCount()
    }
  }

  return (
    <div>
      <button onClick={onclickPrevTurnButton} className='action-button'>Prev Turn</button>
    </div>
  )
}

export default PrevTurnButton