<template>
  <b-tab v-on="$listeners" v-bind="$attrs" :title="title">
    <div v-if="!localTabObject.isImageLoaded">
      <span class="h2 d-block text-left">This tab is empty</span>
    </div>
    <div v-else class="map-area">
      <img class="map-area__image" :src="localTabObject.image.src" />
      <map-drawer
        class="map-area__map"
        :mapInfo.sync="localTabObject.mapInfo"
        :drawObject="selectedObj"
        :availableMap="localTabObject.availableMap"
        :cellSize.sync="cellSize"
        ref="map-drawer"
        @drawFinished="_onDrawFinished"
        @map-changed="_onMapChanged"
        @gamemap-changed="_onGameMapChanged"
      />
    </div>
  </b-tab>
</template>

<script>
import MapDrawer from '../GridDrawer/MapDrawer'
import TabObject from './TabObject'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import GameObject from '../MapUtilities/GameObject'

export default {
  name: 'DrawTab',
  components: {
    MapDrawer
  },
  props: {
    tab: {
      type: TabObject,
      required: true,
      default: () => new TabObject()
    },
    image: {
      type: Image,
      required: false,
      default: () => null
    }
  },
  data: () => ({
    title: null,
    localTabObject: null
  }),
  created: function() {
    this.title = this.tab ? this.tab.title : null
    this.localTabObject = this.tab
  },
  watch: {
    title: function(newVal, oldVal) {
      this.localTabObject.title = newVal
    },
    image: function(newVal, oldVal) {
      if (!newVal) {
        return
      }
      this.tab.loadImage(newVal)
      this._onImageLoaded()
    },
    tab: function(newVal, oldVal) {
      this.title = newVal ? newVal.title : null
      this.localTabObject = newVal
    }
  },
  computed: {
    ...mapGetters(['currentTabData']),

    selectedObj() {
      return this.currentTabData.currentSelectedObj
    },

    cellSize() {
      return this.tab.cellSize
    }
  },
  methods: {
    loadImage(img) {
      this.tab.loadImage(img)
      this._onImageLoaded()
    },
    loadDefaultMap() {
      return new Promise(function (resolve, reject) {
        setTimeout(function() {
          this.$refs['map-drawer'].loadDefaultMap()
        }.bind(this), 1000)
      }.bind(this))
    },
    _onImageLoaded() {
      this.$emit('image-loaded', this)
    },
    _onDrawFinished() {
      this.$emit('draw-finished', this)
    },
    _onMapChanged(map) {
      this.tab.availableMap.map = map
    },
    _onGameMapChanged(gameMap) {
      this.tab.availableMap.mapObjects = gameMap
    }
  }
}
</script>

<style scoped lang="scss">
.map-area {
  position: relative;

  & &__map {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }
}
</style>
