<template>
  <div>
    <grid-cell-layout
      v-model="currentMap"
      :colors="colors"
      :cell-size="sizeOfCell"
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
      required: false,
      default: () => []
    },
    colors: {
      type: Array,
      required: true,
      default: () => []
    },
    w: {
      type: Number,
      required: true,
      default: () => 0
    },
    h: {
      type: Number,
      required: true,
      default: () => 0
    },
    'cell-size': {
      type: Number,
      required: false,
      default: () => 20
    },
    drawObject: Object
  },
  data() {
    return {
      currentMap: null,
      selectedCell: null,
      mapWidth: 0,
      mapHeight: 0,
      emptyTag: -1
    }
  },
  watch: {
    map: function(newVal, oldVal) {
      if (!newVal || newVal.length === 0) {
        this.currentMap = this._getDefaultMap()
        return
      }
      this.currentMap = newVal
    },
    w: function(newVal, oldVal) {
      this.mapWidth = newVal - newVal % this.cellSize
    },
    h: function(newVal, oldVal) {
      this.mapHeight = newVal - newVal % this.cellSize
    }
  },
  computed: {
    cellLayout() {
      return this.$refs.layout
    },
    sizeOfCell() {
      return this.cellSize
    },
    rows() {
      return Math.floor(this.mapHeight / this.cellSize)
    },
    cols() {
      return Math.floor(this.mapWidth / this.cellSize)
    }
  },
  methods: {
    onSelectedCellChanged(cell) {
      this.selectedCell = cell
      if (!this.drawObject) {
        return
      }
      this.cellLayout.drawFromSelectedCell(this.drawObject)
    },
    loadDefaultMap() {
      this.currentMap = this._getDefaultMap()
    },
    _getDefaultMap() {
      // Create 2D cells with value of `this.emptyTag`
      return Array(this.rows).fill(Array(this.cols).fill(this.emptyTag))
    }
  }
}
</script>

<style scoped>

</style>
