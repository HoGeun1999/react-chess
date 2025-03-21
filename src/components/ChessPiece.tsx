import React from "react";
import './ChessPiece.scss'

interface chessPieceProps{
  piece: string;
}

const ChessPiece:React.FC<chessPieceProps> = React.memo(({ piece }) => {

  const pieceURL = `https://assets-themes.chess.com/image/ejgfv/150/${piece}.png`


  return(
    <div className="piece-img-container">
      {piece && (
      <img className="piece-img" src={pieceURL} alt="chess-piece-img"></img>
      )}
    </div>
  )
})



export default ChessPiece;