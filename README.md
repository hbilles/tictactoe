# Tic Tac Toe

> Play Tic-Tac-Toe against your browser.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## Notes On Approach

The first question for me was how to represent the board as well as the board's current state. I decided to go with a one-dimensional array where each item in the array represents a square or cell on the board, arranged like so:

```
0 1 2
3 4 5
6 7 8
```

To represent the state of the board, each array position has a value between -1 and 1. A cell is assigned a score of -1 when the user takes it and +1 when the computer takes it. By default an open cell is given a value of 0. Using a one-dimensional array in this manner makes it simpler to traverse the state of the board. The game is won when the score for a row, column, or diagonal on the board reaches -3 for the user or +3 for the computer.



