<template>
  <div
    id="app"
    class="flex items-center justify-center h-screen text-center text-[#fefefe]"
    style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
  >
    <main class="px-4 w-full max-w-[600px]">
      <Icons />
      <div class="grid grid-cols-3 auto-rows-fr gap-[2px]">
        <div
          v-for="(value, index) in gameState"
          :key="index"
          class="bg-black/10 cursor-pointer"
          @click="selectCell(index, -1)"
        >
          <CellSymbol
            :index="index"
            :value="value"
          />
        </div>
      </div>
    </main>

    <div class="absolute top-4 left-4 text-left">
      <button
        class="block mb-4 mr-2 px-6 py-3 border-2 border-white rounded-sm text-xs uppercase tracking-widest cursor-pointer bg-transparent transition hover:bg-white hover:text-gray-800"
        @click="reset('other')"
      >
        {{ letOtherPlayerStartText }}
      </button>
    </div>

    <div :class="modalClass">
      <div
        class="modal-content"
        @click="reset('reset')"
      >
        <p>{{ modalMessage }}</p>
        <button
          class="button--inverted"
          @click="reset('reset')"
        >
          Ok
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import CellSymbol from './components/CellSymbol.vue'
import Icons from './components/Icons.vue'
import { detectOutcome, chooseComputerMove, MESSAGES } from './game.js'

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
      strategyIndex: Math.floor(Math.random() * 7),
      modalMessage: '',
    }
  },

  computed: {
    letOtherPlayerStartText() {
      return this.startingPlayer === -1 ? 'Let Computer Start' : 'Let Me Start'
    },

    gameIsOver() {
      return detectOutcome(this.gameState) !== null
    },

    modalClass() {
      return this.gameIsOver ? 'modal modal--active' : 'modal'
    },
  },

  watch: {
    gameState: {
      handler() {
        const outcome = detectOutcome(this.gameState)
        if (outcome) {
          this.modalMessage = MESSAGES[outcome]
          return
        }

        if (this.turn === 1) {
          const { cellToTake, nextStrategyIndex } = chooseComputerMove(
            this.gameState,
            this.strategyIndex,
          )
          this.strategyIndex = nextStrategyIndex
          if (cellToTake !== undefined && cellToTake !== null && cellToTake !== -1) {
            this.selectCell(cellToTake, 1)
          }
        }
      },
      deep: true,
    },
  },

  methods: {
    selectCell(index, value) {
      if (this.gameIsOver) return
      if (this.turn === value && this.gameState[index] === 0) {
        this.turn = this.turn * -1
        this.gameState[index] = value
      }
    },

    reset(type) {
      if (type === 'other') this.startingPlayer = this.startingPlayer * -1
      this.turn = this.startingPlayer
      this.strategyIndex = Math.floor(Math.random() * 7)
      this.modalMessage = ''
      this.gameState = [0, 0, 0, 0, 0, 0, 0, 0, 0]

      if (this.turn === 1) {
        const { cellToTake, nextStrategyIndex } = chooseComputerMove(
          this.gameState,
          this.strategyIndex,
        )
        this.strategyIndex = nextStrategyIndex
        if (cellToTake !== undefined && cellToTake !== null && cellToTake !== -1) {
          this.selectCell(cellToTake, 1)
        }
      }
    },
  },
}
</script>
