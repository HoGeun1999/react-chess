import './CheckPopup.scss'
import { useIsKingCheckStore } from '../stores/isKingCheckstore'

const CheckPopup = () => {
  const {isCheck} = useIsKingCheckStore()
  
  if(!isCheck) return



  return(
    <div className='check-popup'>
      체크
    </div>
  )
}

export default CheckPopup