<template>
  <div>
    <grid-cell-layout
      v-model="currentMap"
      :colors="colors"
      :cell-size="80"
      ref="layout"
      @selectedCellChanged="onSelectedCellChanged"/>
  </div>
</template>

<script>
import GridCellLayout from './GridCellLayout'

export default {
  name: 'MapDrawer',
  components: {
    GridCellLayout
  },
  props: {
    map: {
      type: Array,
      required: true,
      default: () => Array.from(Array)
    },
    colors: {
      type: Array,
      required: true,
      default: () => []
    },
    drawObject: Object
  },
  data() {
    return {
      currentMap: this.map,
      selectedCell: null
    }
  },
  watch: {
    map: function(newVal, oldVal) {
      this.currentMap = newVal
    }
  },
  computed: {
    cellLayout() {
      return this.$refs.layout
    }
  },
  methods: {
    onSelectedCellChanged(cell) {
      this.selectedCell = cell
      if (!this.drawObject) {
        return
      }
      this.cellLayout.drawFromSelectedCell(this.drawObject)
    }
  }
}
</script>

<style scoped>

</style>
