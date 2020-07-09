<template>
  <div>
    <grid-cell-layout
      v-model="currentMap"
      :cell-size="sizeOfCell"
      ref="layout"
      :color="color"
      :colors="colorTagMap"
      :tag="tag"
      @selected-cell-changed="_onSelectedCellChanged"
      @selected-zone-changed="_onSelectedZoneChanged"
    />
    <b-modal :id="modalId">
      <span><strong>{{ currentMsg }}</strong></span>
    </b-modal>
  </div>
</template>

<script>
import GridCellLayout from './GridCellLayout'
import { GameMap, RectangleArea, Position, StaticObject, GameObject, Player } from '../MapUtilities'
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

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
    map: {
      type: Array,
      required: false,
      default: () => null
    },
    cellSize: {
      type: Number,
      required: false,
      default: () => 0
    },
    drawObject: {
      type: GameObject,
      required: true,
      default: () => new StaticObject('-1', null, 'transparent')
    }
  },
  data: () => ({
    OBJECT_OVERLAP_MSG: 'Object bị overlap',
    OBJECT_NOT_EXIST_MSG: 'Không có object tại ô này',
    PLAYER_NOT_ALLOW_TO_DRAW: 'Không được phép vẽ player',
    currentMap: null,
    selectedCell: null,
    mapWidth: 0,
    mapHeight: 0,
    localCellSize: 0,
    emptyTag: '-1',
    eraseColor: 'transparent',
    colorMap: null,
    currentMsg: null
  }),
  created: function() {
    // If the map has not been loaded
    if (this.map) {
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
    map: function(newVal, oldVal) {
      this.currentMap = newVal
    },
    cellSize: function(newVal, oldVal) {
      this.localCellSize = this.cellSize
    }
  },
  computed: {
    ...mapState(['AVAILABLE_MODE', 'AVAILABLE_ERASE_MODE', 'playerItemState']),
    ...mapGetters(['mode', 'isMapLoaded', 'currentTabData', 'eraseMode', 'isEraseMode']),

    modalId() {
      return 'modal_' + this.currentTabData._id
    },
    cellLayout() {
      return this.$refs.layout
    },
    sizeOfCell() {
      return this.localCellSize
    },
    tag() {
      return this.mode === this.AVAILABLE_MODE.DRAW_MODE ? this.drawObject.tag : this.emptyTag
    },
    color() {
      return this.mode === this.AVAILABLE_MODE.DRAW_MODE ? this.drawObject.color : this.eraseColor
    },
    rows() {
      return Math.floor(this.mapHeight / this.localCellSize)
    },
    cols() {
      return Math.floor(this.mapWidth / this.localCellSize)
    },
    colorTagMap() {
      let map = {}
      let { staticObjects, playableObjects, player } = this.currentTabData
      map[player.tag] = player.color
      staticObjects.objects.forEach(function(val) {
        map[val.tag] = val.color
      })
      playableObjects.objects.forEach(function(val) {
        map[val.tag] = val.color
      })
      return map
    },
    drawStatic() {
      return this.isEraseMode
        ? this.eraseMode === this.AVAILABLE_ERASE_MODE.MAP
        : this.drawObject ? this.drawObject.isStatic : false
    },
    playableObjects() {
      return this.currentTabData.playableObjects
    },
    isPlayerStartPositionSelected() {
      return this.playerItemState.isStartPosSelected
    }
  },
  methods: {
    ...mapActions(['changeMode']),
    ...mapMutations(['updatePlayerPosition']),

    loadDefaultMap() {
      this.currentMap = this._getDefaultMap()
    },

    loadMapFrom({ map, cellSize }) {
      this._setMapBasedOnAvailableMap()
    },

    async resetMap() {
      if (!this.isMapLoaded) {
        return
      }
      this.currentMap = this._getDefaultMap()
      await this.cellLayout.clearAll()
    },

    _setMapByMapInfo(mapInfo, cellSize) {
      let { width, height } = mapInfo
      this.localCellSize = cellSize
      this.mapWidth = width - width % this.localCellSize
      this.mapHeight = height - height % this.localCellSize
    },

    _setMapBasedOnAvailableMap() {
      this.localCellSize = this.cellSize
      this.currentMap = this.map
      this.mapWidth = this.map[0].length
      this.mapHeight = this.map.length
    },

    _getDefaultMap() {
      // Create 2D cells with value of `this.emptyTag`
      let map = Array(this.rows).fill(null).map(function(val) {
        return Array(this.cols).fill(this.emptyTag)
      }.bind(this))
      return map
    },

    _onSelectedCellChanged(startPoint) {
      if (this.drawStatic) {
        return
      }
      if (this.isEraseMode) {
        this._eraseObjectOnSelectedPoint(startPoint)
        return
      }
      return this._drawObjectOnSelectedPoint(startPoint)
    },

    _onSelectedZoneChanged(startPoint, endPoint) {
      if (!this.drawStatic || (this.isEraseMode && this.eraseMode !== this.AVAILABLE_ERASE_MODE.MAP)) {
        return
      }
      if (this.isEraseMode) {
        this._eraseOnSelectedZone(startPoint, endPoint)
        return
      }
      this._drawOnSelectedZone(startPoint, endPoint)
    },

    async _drawObjectOnSelectedPoint(startPoint) {
      let position = new Position(startPoint.col, startPoint.row)
      let notOverlap = await this.currentTabData.savePlayableObjectPosition(this.drawObject, position)
      if (!notOverlap) {
        this._notify(this.OBJECT_OVERLAP_MSG)
        return
      }
      this.cellLayout.drawBySize(startPoint, this.drawObject.size)
      this._onObjectDrawn(position)
    },

    _eraseObjectOnSelectedPoint(startPoint) {
      let position = new Position(startPoint.col, startPoint.row)
      // remove object in tab data (pass position to it as parameter)
      let object = this.currentTabData.removeObject(position)
      if (!object) {
        this._notify(this.OBJECT_NOT_EXIST_MSG)
        return
      }
      // erase object on map
      this.cellLayout.drawBySize(startPoint, object.size)
      this._onObjectErased(object, startPoint)
    },

    _onObjectDrawn(position) {
      if (this.drawObject instanceof Player) {
        let previousPosition = null
        if (this.isPlayerStartPositionSelected) {
          previousPosition = this.drawObject._startPosition
        } else {
          previousPosition = this.drawObject._endPosition
        }
        if (previousPosition) {
          this.cellLayout.drawBySize(
            { row: previousPosition.y, col: previousPosition.x },
            this.drawObject.size, 'transparent')
          this.currentTabData.removeObject(previousPosition)
        }

        this.updatePlayerPosition(position)
      }
    },

    _onObjectErased(object, { row, col }) {
      if (!(object instanceof Player)) {
        return
      }
      if (object.isStartPoint(col, row)) {
        object.setStartPosition(null)
      } else if (object.isEndPoint(col, row)) {
        object.setEndPosition(null)
      }
    },

    async _drawOnSelectedZone(startPoint, endPoint) {
      let [top, left, bottom, right] = await Promise.all([
        Math.min(startPoint.row, endPoint.row),
        Math.min(startPoint.col, endPoint.col),
        Math.max(startPoint.row, endPoint.row),
        Math.max(startPoint.col, endPoint.col)
      ])

      let isObjectInRange = this.currentTabData.isAnyObjectInRange(
        new Position(left, top),
        new Position(right, bottom)
      )
      if (isObjectInRange) {
        this._notify(this.OBJECT_OVERLAP_MSG)
        return
      }
      this.cellLayout.drawByZone(startPoint, endPoint)
    },

    _eraseOnSelectedZone(startPoint, endPoint) {
      this.cellLayout.drawByZone(startPoint, endPoint, null, (map, pos) => map[pos.row][pos.col][0] !== 'P')
    },

    _notify(msg) {
      this.currentMsg = msg
      this.$bvModal.show(this.modalId)
    }
  }
}
</script>

<style scoped>

</style>
