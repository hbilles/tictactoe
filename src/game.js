export const STRATEGIES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export const MESSAGES = {
  human: 'You won!',
  computer: 'You lost. Maybe next time!',
  stalemate: 'Stalemate. Play again!',
}

export function scoreBoard(state) {
  return STRATEGIES.map((strategy) => {
    return strategy.reduce((sum, index) => sum + state[index], 0)
  })
}

export function detectOutcome(state) {
  const scores = scoreBoard(state)
  if (scores.includes(-3)) return 'human'
  if (scores.includes(3)) return 'computer'
  if (state.every((cell) => cell !== 0)) return 'stalemate'
  return null
}

function hasHumanPlayedStrategy(state, strategyIndex) {
  return STRATEGIES[strategyIndex].some((i) => state[i] === -1)
}

function hasComputerPlayedStrategy(state, strategyIndex) {
  return STRATEGIES[strategyIndex].some((i) => state[i] === 1)
}

export function chooseComputerMove(state, strategyIndex) {
  const scores = scoreBoard(state)
  let cellToTake = null
  let nextStrategyIndex = strategyIndex

  const winningStrategyIndex = scores.findIndex((score, index) => {
    return score === 2 && !hasHumanPlayedStrategy(state, index)
  })

  const losingStrategyIndex = scores.findIndex((score, index) => {
    return score === -2 && !hasComputerPlayedStrategy(state, index)
  })

  if (winningStrategyIndex !== -1) {
    const strategyToPlay = STRATEGIES[winningStrategyIndex]
    cellToTake = strategyToPlay.find((i) => state[i] === 0)
  }

  if (losingStrategyIndex !== -1 && winningStrategyIndex === -1) {
    const strategyToPlay = STRATEGIES[losingStrategyIndex]
    cellToTake = strategyToPlay.find((i) => state[i] === 0)
  }

  const needToChangeStrategy = STRATEGIES[strategyIndex].some(
    (i) => state[i] === -1,
  )

  if (needToChangeStrategy && winningStrategyIndex === -1) {
    const newStrategy = scores.reduce(
      (accumulator, score, index) => {
        const isNewStrategy =
          score >= accumulator.score && !hasHumanPlayedStrategy(state, index)
        return isNewStrategy ? { index, score } : accumulator
      },
      { index: -1, score: 0 },
    )

    if (newStrategy.index !== -1) {
      nextStrategyIndex = newStrategy.index
    } else if (cellToTake === null || cellToTake === undefined) {
      cellToTake = state.findIndex((score) => score === 0)
    }
  }

  if (cellToTake === null || cellToTake === undefined) {
    cellToTake = STRATEGIES[nextStrategyIndex].find((i) => state[i] === 0)
  }

  if (cellToTake === null || cellToTake === undefined) {
    cellToTake = state.findIndex((score) => score === 0)
  }

  return { cellToTake, nextStrategyIndex }
}
