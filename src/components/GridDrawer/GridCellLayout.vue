<template>
  <div class="layout__container" ref="container">
    <b-container fluid="false">
      <b-row no-gutters v-for="(row, rowIndex) in currentMap" :key="row.id" :cols="columns" :style="{height: _cellSize}" class="flex-nowrap">
        <b-col v-for="(cell, colIndex) in currentMap[rowIndex]" :key="cell.id">
          <grid-cell
            :size="_cellSize"
            :pos="{row: rowIndex, col: colIndex}"
            :color="_getCellColor(cell)"
            @mousedown="_onEnterSelectedMode"
            @mouseenter="_onUpdateSelectedEndPoint"
            @mouseup="_onUpdateSelectedZone"
            @selected="_updateSelectedCell"
            ref="cells"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import GridCell from './GridCell'

export default {
  name: 'GridCellLayout',
  components: {
    GridCell
  },
  props: {
    cellSize: {
      type: Number,
      required: true,
      validator: (val) => Number.isInteger(val) && val >= 0
    },
    map: {
      type: Array,
      required: false,
      default: () => Array.from(Array)
    },
    colors: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  model: {
    prop: 'map', // Using v-model on property `map`
    event: 'mapChanged'
  },
  data() {
    return {
      isOnSelectedMode: false,
      startPoint: null,
      endPoint: null,
      currentMap: this.map,
      selectedCell: null
    }
  },
  watch: {
    cellSize: function(newVal, oldVal) {
      this.cellSize = newVal
    },
    map: function(newVal, oldVal) {
      this.currentMap = newVal
    }
  },
  computed: {
    rows() {
      return this.map.length
    },
    columns() {
      return this.map[0].length
    },
    _cellSize() {
      return this._parseToPx(this.cellSize)
    }
  },
  methods: {
    draw({ startPoint, size, color, tag }) {
      let endPoint = { row: startPoint.row + size.height - 1, col: startPoint.col + size.width - 1 }
      let updatedCells = []
      this._actionOnCell(startPoint, endPoint, function (cell) {
        cell.updateColor(color)
        updatedCells.push(cell)
      })
      this._updateMaps(updatedCells.map(cell => cell.pos), tag)
    },
    drawFromSelectedCell(object) {
      object.startPoint = this.selectedCell.pos
      this.draw(object)
    },
    _getCellColor(tag) {
      return this.colors[tag]
    },
    _parseToPx(value) {
      return `${value}px`
    },
    _updateMaps(cellPos, tag) {
      if (!cellPos) {
        return
      }
      cellPos.forEach(function (pos) {
        this.currentMap[pos.row][pos.col] = tag
      }.bind(this))
      this.$emit('mapChanged', this.currentMap)
    },
    _updateSelectedCell(cell) {
      this.selectedCell = cell
      this.$emit('selectedCellChanged', cell)
    },
    _onEnterSelectedMode(cell) {
      this.isOnSelectedMode = true
      this.startPoint = cell.pos
    },
    _onUpdateSelectedEndPoint(cell) {
      if (this.isOnSelectedMode) {
        this.endPoint = cell.pos
      }
    },
    _onUpdateSelectedZone(cell) {
      this.endPoint = cell.pos
      this._actionOnCell(this.startPoint, this.endPoint, (cell) => cell.select())
      this.isOnSelectedMode = false
    },
    _actionOnCell(startPoint, endPoint, cb) {
      let { row: sRow, col: sCol } = startPoint
      let { row: eRow, col: eCol } = endPoint
      let dentaRow = eRow - sRow > 0 ? 1 : -1
      let dentaCol = eCol - sCol > 0 ? 1 : -1
      eRow = dentaRow > 0 ? eRow + 1 : eRow - 1
      eCol = dentaCol > 0 ? eCol + 1 : eCol - 1
      let cells = Array.from(this.$refs.cells)
      for (let i = sRow; Math.abs(i - eRow) !== 0; i += dentaRow) {
        for (let j = sCol; Math.abs(eCol - j) !== 0; j += dentaCol) {
          let index = i * this.columns + j
          // call the callback on every cell
          cb(cells[index])
        }
      }
    },
    /**
     * @param {Vue} cell
     */
    _isCellOnSelectedZone(cell) {
      let { row, col } = cell.pos
      let isXInMiddle = (col - this.startPoint.col) * (col - this.endPoint.col) < 0
      let isYInMiddle = (row - this.startPoint.row) * (row - this.endPoint.row) < 0
      return isXInMiddle && isYInMiddle
    }
  }
}
</script>

<style lang="scss" scoped>
  .layout__container {
    overflow: visible;
  }
</style>
