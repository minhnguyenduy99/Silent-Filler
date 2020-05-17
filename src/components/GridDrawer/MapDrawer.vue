<template>
  <div>
    <grid-cell-layout
      v-model="currentMap"
      :colors="colors"
      :cell-size="sizeOfCell"
      ref="layout"
      @selectedCellChanged="_onSelectedCellChanged"/>
    <b-modal cancel-disabled id="error-modal">
      <span> {{ overlapError }}</span>
    </b-modal>
  </div>
</template>

<script>
import GridCellLayout from './GridCellLayout'
import { GameMap, GameObject, RectangleArea, Position } from '../MapUtilities'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'MapDrawer',
  components: {
    GridCellLayout
  },
  props: {
    mapInfo: {
      width: {
        type: Number,
        required: false,
        default: () => 0
      },
      height: {
        type: Number,
        required: false,
        default: () => 0
      },
      required: false,
      default: () => null
    },
    availableMap: {
      objects: {
        type: Array,
        required: false,
        default: () => []
      },
      map: {
        type: Array,
        required: false,
        default: () => null
      }
    },
    'cell-size': {
      type: Number,
      required: false,
      default: () => 20
    },
    drawObject: GameObject
  },
  data: () => ({
    currentMap: null,
    selectedCell: null,
    objectLocationMap: {},
    gameMap: new GameMap(),
    mapWidth: 0,
    mapHeight: 0,
    emptyTag: -1,
    objects: [],
    overlapError: 'This object has overlap another object'
  }),
  created: function() {
    // If the map has not been loaded
    if (this.availableMap.map) {
      this._setMapBasedOnAvailableMap()
      return
    }
    let { width, height } = this.mapInfo
    this.mapWidth = width - width % this.cellSize
    this.mapHeight = height - height % this.cellSize
  },
  updated: function() {
    this.$nextTick(function() {
      this.$emit('drawFinished')
      this.$emit('map-loaded')
    })
  },
  mounted: function() {
    this.$emit('map-loaded')
  },
  watch: {
    mapInfo: {
      handler: function(newVal, oldVal) {
        if (!newVal) {
          return
        }
        let { width, height } = newVal
        this.mapWidth = width - width % this.cellSize
        this.mapHeight = height - height % this.cellSize
        this.resetMap()
      },
      deep: true
    },
    currentMap: function(newVal, oldVal) {
      this.$emit('map-changed', newVal)
    }
  },
  computed: {
    ...mapState(['AVAILABLE_MODE']),
    ...mapGetters(['mode']),

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
    },
    colors() {
      return this.objects.map(obj => obj.color)
    }
  },
  methods: {
    loadDefaultMap() {
      this.currentMap = this._getDefaultMap()
    },

    /**
     * @param {GameObject} obj
     */
    async drawObjOnSelectedCell(obj) {
      let { row: y, col: x } = this.selectedCell.pos
      let isNotOverlap = await this.gameMap.add(new Position(x, y), obj)
      if (!isNotOverlap) {
        this.$bvModal.show('error-modal')
        return
      }
      this.cellLayout.drawFromSelectedCell(obj)
    },

    async eraseObject() {
      if (!this.selectedCell) {
        return
      }
      let cellPosition = this.selectedCell.pos
      let selectedPos = new Position(cellPosition.col, cellPosition.row)
      let removedObj = await this.gameMap.remove(selectedPos)
      if (!removedObj) {
        console.log('Cannot erase object')
        return
      }
      this.cellLayout.drawFromSelectedCell({ ...removedObj, tag: this.emptyTag, color: 'transparent' })
    },

    resetMap() {
      this.currentMap = this._getDefaultMap()
      this.gameMap = new GameMap()
    },

    _setMapBasedOnAvailableMap() {
      let { objects, map } = this.availableMap
      this.currentMap = map
      this.mapWidth = map[0].length
      this.mapHeight = map.length
      this.objects = objects ?? []
      this.gameMap = new GameMap()
    },

    _onSelectedCellChanged(cell) {
      this.selectedCell = cell
      switch (this.mode) {
        case this.AVAILABLE_MODE.DRAW_MODE:
          if (!this.drawObject) {
            return
          }
          this.drawObjOnSelectedCell(this.drawObject); break
        case this.AVAILABLE_MODE.ERASE_MODE: this.eraseObject(); break
      }
    },

    _getDefaultMap() {
      // Create 2D cells with value of `this.emptyTag`
      let map = Array(this.rows).fill(null).map(function(val) {
        return Array(this.cols).fill(this.emptyTag)
      }.bind(this))
      return map
    },

    /**
     * @param {GameObject} obj
     */
    async _isObjectsOverlap(obj) {
      let { col: x, row: y } = this.selectedCell.pos
      return this.gameMap.isOverlap(new Position(x, y), obj)
    },

    _createArrayOfAllPositions(startY, endY, startX, endX) {
      let arrayY = this._createArrayFromRange(startY, endY)
      let arrayX = this._createArrayFromRange(startX, endX)
      let cells = []
      arrayY.forEach(y => {
        arrayX.forEach(x => {
          cells.push({ x, y })
        })
      })
      return cells
     },

    _createArrayFromRange(a, b) {
      return Array.from(Array(b - a + 1), (x, index) => index + a)
    }
  }
}
</script>

<style scoped>

</style>
