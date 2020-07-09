<template>
  <div class="layout__container" ref="container">
    <b-container fluid="false">
      <b-row no-gutters v-for="(row, rowIndex) in currentMap" :key="row.id" :cols="columns" :style="{height: _cellSize}" class="flex-nowrap">
        <b-col v-for="(cell, colIndex) in currentMap[rowIndex]" :key="cell.id">
          <grid-cell
            :size="_cellSize"
            :pos="{row: rowIndex, col: colIndex}"
            :color="_getColorByTag(cell)"
            @mousedown="_onEnterSelectedMode"
            @mouseenter="_onUpdateSelectedEndPoint"
            @mouseup="_onUpdateSelectedZone"
            ref="cells"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import GridCell from './GridCell'
import { GameObject } from '../MapUtilities'

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
    colors: Object,
    color: {
      type: String
    },
    tag: {
      type: String
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
      selectedCell: null,
      options: {
        boundaryPadding: 5,
        variant: 'info'
      }
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
    },
    _color() {
      return this.color
    },
    _colors() {
      return this.colors
    },
    _tag() {
      return this.tag
    }
  },
  methods: {

    drawBySize(startPoint, { width, height }, color = null) {
      let endPoint = {
        col: startPoint.col + width - 1,
        row: startPoint.row + height - 1
      }
      this._onDrawOnSelectedZone(startPoint, endPoint, color)
    },

    drawByZone(startPoint, endPoint, color = null, cb = (map, pos) => true) {
      this._onDrawOnSelectedZone(startPoint, endPoint, color, cb)
    },

    async clearAll() {
      await Promise.all(this.$refs.cells.map(cell => cell.updateColor('transparent')))
    },

    _parseToPx(value) {
      return `${value}px`
    },

    _onEnterSelectedMode(cell) {
      this.isOnSelectedMode = true
      this.startPoint = cell.pos
      this.$emit('selected-cell-changed', this.startPoint)
    },

    _onUpdateSelectedEndPoint(cell) {
      if (this.isOnSelectedMode) {
        this.endPoint = cell.pos
      }
    },

    _getColorByTag(cell) {
      return cell === '-1' ? 'transparent' : this.colors[cell]
    },

    _onUpdateSelectedZone(cell) {
      this.endPoint = cell.pos
      this.$emit('selected-zone-changed', this.startPoint, this.endPoint)
      this.isOnSelectedMode = false
    },

    _onDrawOnSelectedZone(startPoint, endPoint, color = null, cb = (map, pos) => true) {
      this._actionOnCell(startPoint, endPoint, function(cell) {
        let pos = cell.pos
        if (cb(this.map, pos)) {
          cell.updateColor(color ?? this._color)
          this.currentMap[pos.row][pos.col] = this._tag
        }
      }.bind(this))
    },

    _actionOnCell(startPoint, endPoint, cb) {
      let { row: sRow, col: sCol } = startPoint
      let { row: eRow, col: eCol } = endPoint
      let dentaRow = eRow - sRow > 0 ? 1 : -1
      let dentaCol = eCol - sCol > 0 ? 1 : -1
      eRow = dentaRow > 0 ? eRow + 1 : eRow - 1
      eCol = dentaCol > 0 ? eCol + 1 : eCol - 1
      let cells = Array.from(this.$refs.cells)
      for (let i = sRow; Math.abs(i - eRow) !== 0 && i < this.map.length; i += dentaRow) {
        for (let j = sCol; Math.abs(eCol - j) !== 0 && j < this.map[0].length; j += dentaCol) {
          let index = i * this.columns + j
          let cell = cells[index]
          if (!cell) {
            return
          }
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
    },

    _tagInfo(tag) {
      if (tag === '-1') {
        return 'Empty'
      }
      if (tag[0] === 'P') {
        return 'Playable object'
      }
      return 'Static object'
    }
  }
}
</script>

<style lang="scss" scoped>
  .layout__container {
    overflow: visible;
  }
</style>
