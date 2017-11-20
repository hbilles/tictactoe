<template>
  <span
    class="ttt-symbol"
    :style="cellStyle"
  >
    <svg class="symbol"><use :xlink:href="symbol"></use></svg>
  </span>
</template>

<script>
export default {
  name: 'CellSymbol',

  props: {
    index: Number,
    value: Number,
  },

  data() {
    return {}
  },

  computed: {
    symbol() {
      switch (this.value) {
        case 0:
          return ''
        case 1:
          return '#icon--x'
        case -1:
          return '#icon--circle'
      }
    },

    cellStyle() {
      const color = this.value === -1 ? 'rgba(75, 255, 75, 1)' : 'rgba(5, 5, 255, 1)'

      return `color: ${color};`
    },
  },
}
</script>

<style lang="stylus">
.ttt-symbol
  position relative
  display block
  width 100%
  height 0
  padding-top 100%

// separate the positioning rules due to
// an apparent stylus bug somewhere
.symbol
  position absolute
  top 5%
  left 5%

.symbol
	display inline-block
	width 90%
	height 90%
	stroke-width 0
	stroke currentColor
	fill currentColor

</style>
