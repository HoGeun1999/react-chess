import './GameHistoryBoard.scss'
import { useEffect, useState } from 'react'
import { useChessBoardDataHistoryStore } from '../../stores/chessBoardDataHistoryStore'
import { useTurnCountStore } from '../../stores/turnCountStore'

const GameHistoryBoard = () => {
  const { boardDataHistory } = useChessBoardDataHistoryStore()
  const { turnCount } = useTurnCountStore()
  const [historyLog, setHistoryLog] = useState<{ piece: string; move: string }[]>([])

  useEffect(() => {
    if (boardDataHistory.length < 2) return
    setHistoryLog([])

    for (let i = 1; i < boardDataHistory.length; i++) {
      const prevBoard = boardDataHistory[i - 1]
      const currentBoard = boardDataHistory[i]
      let movedPiece = ''
      let to = { row: -1, col: -1 }
      let capturedPiece = null

      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          if (prevBoard[row][col] !== currentBoard[row][col]) {
            if (currentBoard[row][col] !== '') {
              movedPiece = currentBoard[row][col]
              to = { row, col }
              if (prevBoard[row][col] !== '') {
                capturedPiece = prevBoard[row][col]
              }
            }
          }
        }
      }

      if (movedPiece) {
        const columnLetter = String.fromCharCode(97 + to.col) // 0 -> 'a', 1 -> 'b', ..., 7 -> 'h'
        const moveText = capturedPiece
          ? `x${columnLetter}${8 - to.row}`
          : `${columnLetter}${8 - to.row}`

        setHistoryLog(prev => [...prev, { piece: movedPiece, move: moveText }])
      }
    }
  }, [boardDataHistory])  

  return (
    <div className="game-history-board">
      {historyLog.reduce((rows: { piece: string; move: string }[][], move, index) => {
        if (index % 2 === 0) {
          rows.push([move]) // 새로운 행 시작
        } else {
          rows[rows.length - 1].push(move) // 기존 행에 추가
        }
        return rows
      }, []).map((row, index) => (
        <div key={index} className="history-entry">
          {row.map((entry, i) => {
            const moveIndex = index * 2 + i // 현재 이동의 전체 index 계산
            const isCurrentMove = moveIndex === turnCount - 1 // 현재 이동과 일치하는지 확인

            return (
              <div key={i} className={`history-move ${isCurrentMove ? 'current-turn' : ''}`}>
                <img src={`https://assets-themes.chess.com/image/ejgfv/150/${entry.piece}.png`} alt={entry.piece} className="piece-icon" />
                {entry.move}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default GameHistoryBoard
