# Tic Tac Toe

> Play Tic-Tac-Toe against your browser.

This project is a React implementation of the original Tic-Tac-Toe UI, built with Vite, Tailwind CSS, and Vitest. The gameplay rules and computer strategy still live in [`src/game.js`](./src/game.js); the framework migration is intended to preserve the existing browser behavior rather than redesign the game.

## Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at http://localhost:8080
npm run dev

# build for production
npm run build

# preview the production build at localhost:8080
npm run preview

# run the test suite
npm run test

# run a targeted test file
npx vitest run src/App.test.jsx

# lint source files
npm run lint
```

## Notes On Approach

The first question for me was how to represent the board as well as the board's current state. I decided to go with a one-dimensional array where each item in the array represents a square or cell on the board, arranged like so:

```
0 1 2
3 4 5
6 7 8
```

To represent the state of the board, each array position has a value between -1 and 1. A cell is assigned a score of -1 when the user takes it and +1 when the computer takes it. By default an open cell is given a value of 0. Using a one-dimensional array in this manner makes it simpler to traverse the state of the board. The game is won when the score for a row, column, or diagonal on the board reaches -3 for the user or +3 for the computer.

I defined an array of the 8 possible ways to win, `STRATEGIES`, that groups the index keys from `gameState` that are required for a win.

Scoring each strategy produces an 8-element scores array. The `detectOutcome` helper reads that array to determine if the game has been won by either player, or if the game has ended in a stalemate.

The logic for how the computer plays the game lives in `chooseComputerMove`. When a game is started the computer randomly chooses a strategy to play from the list. Each time the computer plays, it checks 3 things:

* If the computer can win on this move, take the appropriate cell
* The computer checks if the human can win on the next move, and if so, block the win by taking the appropriate cell
* The computer checks if the human has played a cell that is part of its current strategy, and if so pick a new strategy with the highest score in its favor
* If none of the above applies, the computer plays a cell in its current strategy
* If that's not possible, pick any remaining available cell to play to stalemate
