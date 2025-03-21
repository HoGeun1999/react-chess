import './EndGamePopup.scss';
import { useEndGameTypeStore } from '../stores/endGameTypeStore';

const EndGamePopup = () => {
  const { endGameType, resetEndGameType } = useEndGameTypeStore();

  if (endGameType === '') return null;

  return (
    <div className="end-game-overlay">
      <div className="end-game-popup">
        <p className="end-game-message">{endGameType}</p>
        <button className="close-button" onClick={resetEndGameType}>확인</button>
      </div>
    </div>
  );
};

export default EndGamePopup;
