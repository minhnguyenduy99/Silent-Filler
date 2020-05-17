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
        :drawObject="localObject"
        :availableMap="localTabObject.availableMap"
        ref="map-drawer"
        @drawFinished="_onDrawFinished"
        @map-changed="_onMapChanged"
        @map-loaded="_onMapLoaded"
      />
    </div>
  </b-tab>
</template>

<script>
import MapDrawer from '../GridDrawer/MapDrawer'
import TabObject from './TabObject'
import { mapState, mapActions, mapMutations } from 'vuex'
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
    },
    selectedObjIndex: {
      type: Number,
      required: true,
      default: () => -1
    }
  },
  data: () => ({
    title: null,
    localTabObject: null,
    localObject: null
  }),
  created: function() {
    this.title = this.tab ? this.tab.title : null
    this.localTabObject = this.tab
    this.localObject = null
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
      this.localObject = this.localObject.currentSelectedObj
    },
    selectedObjIndex: function(newVal, oldVal) {
      this.localObject = this.localTabObject.currentSelectedObj
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
    _onMapLoaded() {
      this.$emit('loaded', this)
    },
    _onDrawFinished() {
      this.$emit('draw-finished', this)
    },
    _onMapChanged(map) {
      this.tab.availableMap.map = map
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
