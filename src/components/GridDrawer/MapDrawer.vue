<template>
  <div>
    <grid-cell-layout
      v-model="currentMap"
      :cell-size="sizeOfCell"
      ref="layout"
      :color="color"
      :colors="colorTagMap"
      :tag="tag"
    />
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
      default: () => new GameObject(-1, null, 'transparent', { width: 0, height: 0 }, true)
    }
  },
  data: () => ({
    currentMap: null,
    selectedCell: null,
    mapWidth: 0,
    mapHeight: 0,
    localCellSize: 0,
    emptyTag: -1,
    emptyColor: 'transparent',
    colorMap: null
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
    ...mapState(['AVAILABLE_MODE']),
    ...mapGetters(['mode', 'isMapLoaded', 'currentTabData']),

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
      return this.mode === this.AVAILABLE_MODE.DRAW_MODE ? this.drawObject.color : this.emptyColor
    },
    rows() {
      return Math.floor(this.mapHeight / this.localCellSize)
    },
    cols() {
      return Math.floor(this.mapWidth / this.localCellSize)
    },
    colorTagMap() {
      return this.currentTabData.colors
    }
  },
  methods: {
    loadDefaultMap() {
      this.currentMap = this._getDefaultMap()
    },

    loadMapFrom({ map, cellSize }) {
      this._setMapBasedOnAvailableMap()
    },

    resetMap() {
      this.currentMap = this._getDefaultMap()
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
    }
  }
}
</script>

<style scoped>

</style>
