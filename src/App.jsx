import React, { useEffect, useMemo, useState } from 'react'
import CellSymbol from './components/CellSymbol.jsx'
import Icons from './components/Icons.jsx'
import { chooseComputerMove, detectOutcome, MESSAGES } from './game.js'

const EMPTY_BOARD = [0, 0, 0, 0, 0, 0, 0, 0, 0]

function getRandomStrategyIndex() {
  return Math.floor(Math.random() * 7)
}

export default function App() {
  const [startingPlayer, setStartingPlayer] = useState(-1)
  const [turn, setTurn] = useState(-1)
  const [gameState, setGameState] = useState(EMPTY_BOARD)
  const [strategyIndex, setStrategyIndex] = useState(getRandomStrategyIndex)
  const [modalMessage, setModalMessage] = useState('')

  const outcome = useMemo(() => detectOutcome(gameState), [gameState])
  const gameIsOver = outcome !== null
  const letOtherPlayerStartText =
    startingPlayer === -1 ? 'Let Computer Start' : 'Let Me Start'
  const modalClass = gameIsOver ? 'modal modal--active' : 'modal'

  useEffect(() => {
    if (outcome) {
      setModalMessage(MESSAGES[outcome])
      return
    }

    if (turn === 1) {
      const { cellToTake, nextStrategyIndex } = chooseComputerMove(
        gameState,
        strategyIndex,
      )

      setStrategyIndex(nextStrategyIndex)

      if (cellToTake !== undefined && cellToTake !== null && cellToTake !== -1) {
        setTurn(-1)
        setGameState((currentState) => {
          if (currentState[cellToTake] !== 0) return currentState
          const nextState = [...currentState]
          nextState[cellToTake] = 1
          return nextState
        })
      }
    }
  }, [gameState, outcome, strategyIndex, turn])

  function selectCell(index, value) {
    if (gameIsOver) return
    if (turn !== value || gameState[index] !== 0) return

    setTurn((currentTurn) => currentTurn * -1)
    setGameState((currentState) => {
      if (currentState[index] !== 0) return currentState
      const nextState = [...currentState]
      nextState[index] = value
      return nextState
    })
  }

  function reset(type) {
    const nextStartingPlayer = type === 'other' ? startingPlayer * -1 : startingPlayer
    const nextTurn = nextStartingPlayer
    const nextStrategyIndex = getRandomStrategyIndex()

    if (type === 'other') {
      setStartingPlayer(nextStartingPlayer)
    }

    setTurn(nextTurn)
    setStrategyIndex(nextStrategyIndex)
    setModalMessage('')
    setGameState(EMPTY_BOARD)

    if (nextTurn === 1) {
      const { cellToTake, nextStrategyIndex: updatedStrategyIndex } = chooseComputerMove(
        EMPTY_BOARD,
        nextStrategyIndex,
      )
      setStrategyIndex(updatedStrategyIndex)

      if (cellToTake !== undefined && cellToTake !== null && cellToTake !== -1) {
        const nextState = [...EMPTY_BOARD]
        nextState[cellToTake] = 1
        setTurn(-1)
        setGameState(nextState)
      }
    }
  }

  return (
    <div
      className="flex items-center justify-center h-screen text-center text-[#fefefe]"
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <main className="px-4 w-full max-w-[600px]">
        <Icons />
        <div className="grid grid-cols-3 auto-rows-fr gap-[2px]">
          {gameState.map((value, index) => (
            <div
              key={index}
              className="bg-black/10 cursor-pointer"
              data-testid={`cell-${index}`}
              onClick={() => selectCell(index, -1)}
            >
              <CellSymbol index={index} value={value} />
            </div>
          ))}
        </div>
      </main>

      <div className="absolute top-4 left-4 text-left">
        <button
          className="block mb-4 mr-2 px-6 py-3 border-2 border-white rounded-sm text-xs uppercase tracking-widest cursor-pointer bg-transparent transition hover:bg-white hover:text-gray-800"
          onClick={() => reset('other')}
          type="button"
        >
          {letOtherPlayerStartText}
        </button>
      </div>

      <div className={modalClass}>
        <div
          className="modal-content"
          onClick={() => reset('reset')}
        >
          <p>{modalMessage}</p>
          <button
            className="button--inverted"
            onClick={() => reset('reset')}
            type="button"
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  )
}
