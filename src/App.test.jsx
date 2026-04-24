import React, { act } from 'react'
import ReactDOM from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App.jsx'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

let container
let root

async function renderApp() {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = ReactDOM.createRoot(container)

  await act(async () => {
    root.render(<App />)
  })
}

function getCells() {
  return Array.from(container.querySelectorAll('[data-testid^="cell-"]'))
}

afterEach(() => {
  if (root) {
    act(() => {
      root.unmount()
    })
  }
  if (container) {
    container.remove()
  }
  root = null
  container = null
  vi.restoreAllMocks()
})

describe('App', () => {
  it('plays a human move then a computer move on click', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    await renderApp()

    const cells = getCells()
    expect(cells).toHaveLength(9)

    await act(async () => {
      cells[0].click()
    })

    const occupied = cells.filter((cell) => cell.querySelector('use'))
    expect(occupied).toHaveLength(2)
    expect(cells[0].querySelector('use')?.getAttribute('href')).toBe('#icon--circle')
    const computerMoves = cells.filter(
      (cell) => cell.querySelector('use')?.getAttribute('href') === '#icon--x',
    )
    expect(computerMoves).toHaveLength(1)
  })

  it('reset control flips the starting player and resets the board', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    await renderApp()

    const [firstCell] = getCells()
    await act(async () => {
      firstCell.click()
    })

    expect(getCells().filter((cell) => cell.querySelector('use'))).toHaveLength(2)

    const swapStartingPlayerButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Let Computer Start',
    )

    await act(async () => {
      swapStartingPlayerButton.click()
    })

    const occupied = getCells().filter((cell) => cell.querySelector('use'))
    expect(occupied).toHaveLength(1)

    expect(
      Array.from(container.querySelectorAll('button')).some(
        (button) => button.textContent === 'Let Me Start',
      ),
    ).toBe(true)
    expect(occupied[0].querySelector('use')?.getAttribute('href')).toBe('#icon--x')
  })

  it('clicking an already-taken cell is a no-op', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    await renderApp()

    const [firstCell] = getCells()
    await act(async () => {
      firstCell.click()
    })

    const snapshot = getCells()
      .map((cell) => cell.querySelector('use')?.getAttribute('href') ?? null)

    await act(async () => {
      firstCell.click()
    })

    const nextSnapshot = getCells().map(
      (cell) => cell.querySelector('use')?.getAttribute('href') ?? null,
    )
    expect(nextSnapshot).toEqual(snapshot)
  })
})
