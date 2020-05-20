<template>
  <div>
    <grid-cell-layout
      v-model="currentMap"
      :colors="colors"
      :cell-size="sizeOfCell"
      ref="layout"
      @selectedCellChanged="_onSelectedCellChanged"/>
    <b-modal cancel-disabled :id="modalId">
      <span> {{ errorMsg }}</span>
    </b-modal>
  </div>
</template>

<script>
import GridCellLayout from './GridCellLayout'
import { GameMap, GameObject, RectangleArea, Position } from '../MapUtilities'
import { mapState, mapGetters } from 'vuex'
import uniqid from 'uniqid'

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
      },
      mapObjects: {
        type: GameMap,
        required: false,
        default: () => []
      }
    },
    cellSize: {
      type: Number,
      required: false,
      default: () => 0
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
    localCellSize: 0,
    emptyTag: -1,
    objects: [],
    modalId: uniqid(),
    OVERLAP_ERROR: 'This object has overlap another object',
    ERASE_ERROR: 'Cannot erase object overlap by another object',
    ERASE_EMPTY_ERROR: 'No object to erase',
    errorMsg: null
  }),
  created: function() {
    // If the map has not been loaded
    if (this.availableMap.map) {
      this._setMapBasedOnAvailableMap()
      return
    }
    this._setMapByMapInfo(this.mapInfo, this.cellSize)
  },
  updated: function() {
    this.$nextTick(function() {
      this.$emit('drawFinished')
    })
  },
  watch: {
    mapInfo: {
      handler: function(newVal, oldVal) {
        if (!newVal) {
          return
        }
        this._setMapByMapInfo(newVal, this.cellSize)
        // if the map is already loaded then applying the change by call `resetMap`
        if (this.isMapLoaded) {
          this.resetMap()
        }
      },
      deep: true
    },
    currentMap: function(newVal, oldVal) {
      this.$emit('map-changed', newVal)
    },
    cellSize: function(newVal, oldVal) {
      this.localCellSize = this.cellSize
    }
  },
  computed: {
    ...mapState(['AVAILABLE_MODE']),
    ...mapGetters(['mode', 'isMapLoaded']),

    cellLayout() {
      return this.$refs.layout
    },
    sizeOfCell() {
      return this.localCellSize
    },
    rows() {
      return Math.floor(this.mapHeight / this.localCellSize)
    },
    cols() {
      return Math.floor(this.mapWidth / this.localCellSize)
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
        this.errorMsg = this.OVERLAP_ERROR
        this.$bvModal.show(this.modalId)
        return
      }
      this.cellLayout.drawFromSelectedCell(obj)
      this._onGameMapChanged()
    },

    async eraseObject() {
      if (!this.selectedCell) {
        return
      }
      let cellPosition = this.selectedCell.pos
      let selectedPos = new Position(cellPosition.col, cellPosition.row)
      if (this.gameMap.isEmpty()) {
        this.errorMsg = this.ERASE_EMPTY_ERROR
        this.$bvModal.show(this.modalId)
        return
      }
      let removedObj = await this.gameMap.remove(selectedPos)
      if (!removedObj) {
        this.errorMsg = this.ERASE_ERROR
        this.$bvModal.show(this.modalId)
        return
      }
      this.cellLayout.drawFromSelectedCell({ ...removedObj, tag: this.emptyTag, color: 'transparent' })
      this._onGameMapChanged()
    },

    resetMap() {
      this.currentMap = this._getDefaultMap()
      this.gameMap = new GameMap()
    },

    _setMapByMapInfo(mapInfo, cellSize) {
      let { width, height } = mapInfo
      this.localCellSize = cellSize
      this.mapWidth = width - width % this.localCellSize
      this.mapHeight = height - height % this.localCellSize
    },

    _setMapBasedOnAvailableMap() {
      let { objects, map, mapObjects } = this.availableMap
      this.localCellSize = this.cellSize
      this.currentMap = map
      this.mapWidth = map[0].length
      this.mapHeight = map.length
      this.objects = objects ?? []
      this.gameMap = mapObjects
    },

    _onGameMapChanged() {
      this.$emit('gamemap-changed', this.gameMap)
    },

    _onSelectedCellChanged(cell) {
      this.selectedCell = cell
      switch (this.mode) {
        case this.AVAILABLE_MODE.DRAW_MODE:
          if (!this.drawObject) {
            console.log('No object selected')
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
