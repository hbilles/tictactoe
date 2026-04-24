import React from 'react'

function getSymbol(value) {
  switch (value) {
    case 1:
      return '#icon--x'
    case -1:
      return '#icon--circle'
    default:
      return ''
  }
}

export default function CellSymbol({ index, value }) {
  const symbol = getSymbol(value)
  const color = value === -1 ? 'rgba(75, 255, 75, 1)' : 'rgba(5, 5, 255, 1)'

  return (
    <span
      className="ttt-symbol"
      data-index={index}
      style={{ color }}
    >
      {symbol ? (
        <svg className="symbol">
          <use href={symbol} />
        </svg>
      ) : null}
    </span>
  )
}
