import React, { act } from 'react'
import ReactDOM from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import CellSymbol from './CellSymbol.jsx'
import Icons from './Icons.jsx'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

async function renderWithIcons(value) {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = ReactDOM.createRoot(container)

  await act(async () => {
    root.render(
      <>
        <Icons />
        <CellSymbol index={0} value={value} />
      </>,
    )
  })

  return {
    container,
    async unmount() {
      await act(async () => {
        root.unmount()
      })
      container.remove()
    },
  }
}

describe('CellSymbol', () => {
  it('renders the circle glyph for value -1', async () => {
    const { container, unmount } = await renderWithIcons(-1)
    const use = container.querySelector('use')
    const symbol = container.querySelector('.ttt-symbol')

    expect(use).toBeTruthy()
    expect(use?.getAttribute('href')).toBe('#icon--circle')
    expect(symbol?.getAttribute('style')).toContain('75, 255, 75')
    await unmount()
  })

  it('renders the x glyph for value 1', async () => {
    const { container, unmount } = await renderWithIcons(1)
    const use = container.querySelector('use')
    const symbol = container.querySelector('.ttt-symbol')

    expect(use).toBeTruthy()
    expect(use?.getAttribute('href')).toBe('#icon--x')
    expect(symbol?.getAttribute('style')).toContain('5, 5, 255')
    await unmount()
  })

  it('renders no glyph for value 0', async () => {
    const { container, unmount } = await renderWithIcons(0)
    expect(container.querySelector('use')).toBeNull()
    await unmount()
  })
})
