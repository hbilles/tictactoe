<template>
  <div id="app">
    <main>
      <icons/>
      <div class="ttt-grid">
        <div
          class="ttt-cell"
          v-for="(value, index) in gameState"
          :key="index"
          @click="selectCell(index, -1)"
        >
          <cell-symbol
            :index="index"
            :value="value"
          ></cell-symbol>
        </div>
      </div>
    </main>

    <div class="btn-group">
      <!-- <button class="reset" @click="reset('reset')">New Game</button> -->
      <button class="reset" @click="reset('other')">{{ letOtherPlayerStartText }}</button>
    </div>

    <div
      :class="modalClass"
    >
      <div
        class="modal__content"
        @click="reset('reset')"
      >
        <p>{{ modalMessage }}</p>
        <button
          class="button--inverted"
          @click="reset('reset')"
        >Ok</button>
      </div>
    </div>
  </div>
</template>

<script>
import 'sanitize.css'
import CellSymbol from './components/CellSymbol'
import Icons from './components/Icons'

export default {
  name: 'App',

  components: {
    CellSymbol,
    Icons,
  },

  data() {
    return {
      // -1 = human, +1 = computer
      startingPlayer: -1,

      turn: -1,

      // O = -1, X = +1, empty = 0
      gameState: [0, 0, 0, 0, 0, 0, 0, 0, 0],

      strategies: [
        // rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],

        // columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],

        // diagonals
        [0, 4, 8],
        [2, 4, 6],
      ],

      // randomly pick a strategy for computer,
      // generates index for strategies
      strategyIndex: Math.floor(Math.random() * 7),

      modalMessage: '',
    }
  },

  computed: {
    letOtherPlayerStartText() {
      return this.startingPlayer === -1 ? 'Let Computer Start' : 'Let Me Start'
    },

    // score each winning combo,
    // -3 = human wins, +3 = computer wins
    s0() {
      return this.gameState[0] + this.gameState[1] + this.gameState[2]
    },

    s1() {
      return this.gameState[3] + this.gameState[4] + this.gameState[5]
    },

    s2() {
      return this.gameState[6] + this.gameState[7] + this.gameState[8]
    },

    s3() {
      return this.gameState[0] + this.gameState[3] + this.gameState[6]
    },

    s4() {
      return this.gameState[1] + this.gameState[4] + this.gameState[7]
    },

    s5() {
      return this.gameState[2] + this.gameState[5] + this.gameState[8]
    },

    s6() {
      return this.gameState[0] + this.gameState[4] + this.gameState[8]
    },

    s7() {
      return this.gameState[2] + this.gameState[4] + this.gameState[6]
    },

    // groups scores
    scores() {
      return [
        this.s0,
        this.s1,
        this.s2,
        this.s3,
        this.s4,
        this.s5,
        this.s6,
        this.s7,
      ]
    },

    gameIsOver() {
      const isHuman = this.scores.findIndex(value => {
        return value === -3
      })

      const isComputer = this.scores.findIndex(value => {
        return value === 3
      })

      const isNotStalemate = this.gameState.some(index => {
        return index === 0
      })

      if (isHuman !== -1) {
        this.modalMessage = 'You won!'
        return true
      }
      if (isComputer !== -1) {
        this.modalMessage = 'You lost. Maybe next time!'
        return true
      }
      if (!isNotStalemate) {
        this.modalMessage = 'Stalemate. Play again!'
        return true
      }

      return false
    },

    // the current strategy pursued by the computer
    strategy() {
      return this.strategies[this.strategyIndex]
    },

    // checks if computer needs to change strategy
    // because human has marked a spot in strategy
    needToChangeStrategy() {
      const result = this.strategy.find(gameStateIndex => {
        return this.gameState[gameStateIndex] === -1
      })

      return result !== undefined
    },

    // checks if computer can win on next move
    // and returns index of strategy to play
    winningStrategyIndex() {
      return this.scores.findIndex((score, index) => {
        return (score === 2 && !this.hasHumanPlayedStrategy(index))
      })
    },

    // checks if human can win on next move
    // and returns index of strategy to block
    losingStrategyIndex() {
      return this.scores.findIndex((score, index) => {
        return (score === -2 && !this.hasComputerPlayedStrategy(index))
      })
    },

    modalClass() {
      return this.gameIsOver ? 'modal modal--active' : 'modal'
    },
  },

  watch: {
    gameState() {
      // if it's the computer's turn
      if (this.turn === 1 && !this.gameIsOver) {
        var cellToTake = null

        // if computer is set to win, go for it!
        if (this.winningStrategyIndex !== -1) {
          const strategyToPlay = this.strategies[this.winningStrategyIndex]
          cellToTake = strategyToPlay.find(gameStateIndex => {
            return this.gameState[gameStateIndex] === 0
          })
        }

        // if human is set to win, block!
        if (this.losingStrategyIndex !== -1 && this.winningStrategyIndex === -1) {
          const strategyToPlay = this.strategies[this.losingStrategyIndex]
          cellToTake = strategyToPlay.find(gameStateIndex => {
            return this.gameState[gameStateIndex] === 0
          })
        }

        // if strategy needs to change, do it
        if (this.needToChangeStrategy && this.winningStrategyIndex === -1) {
          const newStrategy = this.scores.reduce((accumulator, score, index) => {
            // check if current strategy item has better score and has not been played by human
            const isNewStrategy = (score >= accumulator.score && !this.hasHumanPlayedStrategy(index))
            return isNewStrategy ? { index, score } : accumulator
          }, { index: -1, score: 0 })

          // If a new strategy was found, choose it
          if (newStrategy.index !== -1) {
            this.strategyIndex = newStrategy.index
          } else {
            // can't win, just pick a cell
            cellToTake = this.gameState.findIndex(score => {
              return score === 0
            })
          }
        }

        // set cellToTake if it hasn't been set already
        if (cellToTake === null) {
          cellToTake = this.strategy.find(gameStateIndex => {
            return this.gameState[gameStateIndex] === 0
          })
        }

        // take the cell
        return this.selectCell(cellToTake, 1)
      }
    },
  },

  methods: {
    hasHumanPlayedStrategy(strategyIndex) {
      return this.strategies[strategyIndex].some(gameStateIndex => {
        return this.gameState[gameStateIndex] === -1
      })
    },

    hasComputerPlayedStrategy(strategyIndex) {
      return this.strategies[strategyIndex].some(gameStateIndex => {
        return this.gameState[gameStateIndex] === 1
      })
    },

    selectCell(index, value) {
      // must be player's turn and selected cell must be empty
      if (this.turn === value && this.gameState[index] === 0) {
        // it's now the other player's turn
        this.turn = this.turn * -1
        // must use this.$set in order for CellSymbol to update
        this.$set(this.gameState, index, value)
      }
    },

    reset(type) {
      if (type === 'other') this.startingPlayer = this.startingPlayer * -1
      this.turn = this.startingPlayer
      this.strategyIndex = Math.floor(Math.random() * 7)
      this.gameState = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
  },
}
</script>

<style lang="stylus">
html
  background linear-gradient(0deg, #cdb167, #2374a1)

html,
body
  padding 0
  margin 0

#app
  display flex
  justify-content center
  align-items center
  height 100vh
  font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif
  text-align center
  color #fefefe

  button
    padding .75em 1.5em
    border 2px solid #fefefe
    border-radius 2px
    font-size 12px
    text-transform uppercase
    letter-spacing .1em
    cursor pointer
    background-color transparent
    transition all .25s cubic-bezier(0.35, -0.05, 0.2, 1.1)
    user-select none
    appearance none

    &:hover
    &:focus
      background-color #fefefe
      color #333

    &.button--inverted
      border-color #333

      &:hover
      &:focus
        background-color #333
        color #fefefe

.modal
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  display flex
  justify-content center
  align-items flex-start
  text-align left
  opacity 0
  pointer-events none
  transition all .6s cubic-bezier(0.35, -0.05, 0.2, 1.1)

  &--active
    opacity 1
    pointer-events auto

  &__content
    width 90%
    max-width 480px
    margin 2rem 0 0
    padding 2rem
    color #333
    background-color #fff
    box-shadow 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)

    p
      margin 0 0 2rem
      font-size 28px

    button
      float right

main
  padding 0 1em
  width 100%
  max-width 600px

.ttt-grid
  display grid
  grid-template-columns 1fr 1fr 1fr
  grid-auto-rows 1fr
  grid-gap 2px

.ttt-cell
  background rgba(0, 0, 0, .1)
  cursor pointer

.btn-group {
  position absolute
  top 1em
  left 1em
  text-align left
}

.reset
  display block
  margin 0 .5em 1em 0
</style>
