<template>
  <span
    class="ttt-symbol"
    :style="cellStyle"
  >
    <svg
      v-if="symbol"
      class="symbol"
    ><use :xlink:href="symbol" /></svg>
  </span>
</template>

<script>
export default {
  name: 'CellSymbol',

  props: {
    index: {
      type: Number,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
  },

  computed: {
    symbol() {
      switch (this.value) {
        case 1:
          return '#icon--x'
        case -1:
          return '#icon--circle'
        default:
          return ''
      }
    },

    cellStyle() {
      const color = this.value === -1 ? 'rgba(75, 255, 75, 1)' : 'rgba(5, 5, 255, 1)'
      return `color: ${color};`
    },
  },
}
</script>
