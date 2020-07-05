<template>
  <b-tab v-on="$listeners" v-bind="$attrs" :title="title">
    <div slot="title" class="d-flex justify-content-start align-items-center">
      <b-form-input class="w-50 mr-2" v-model.lazy="localTabObject.title"></b-form-input>
      <icon-button
        size="xs"
        btnIconName="x"
        variant="danger"
        v-b-tooltip.hover
        title="Remove tab"
        @click="_onTabRemoveButtonClicked"
      />
    </div>
    <div v-if="!localTabObject.isImageLoaded">
      <span class="h2 d-block text-left">This tab is empty</span>
    </div>
    <div v-else class="map-area">
      <img class="map-area__image" :src="localTabObject.image.src" />
      <map-drawer
        class="map-area__map"
        :mapInfo.sync="localTabObject.mapInfo"
        :map="map"
        :drawObject="selectedObj"
        :cellSize.sync="cellSize"
        ref="map-drawer"
        @drawFinished="_onDrawFinished"
        @map-changed="_onMapChanged"
      />
    </div>
  </b-tab>
</template>

<script>
import MapDrawer from '../GridDrawer/MapDrawer'
import TabObject from './TabObject'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import { GameObject } from '../MapUtilities'
import IconButton from '../Utilities/IconButton'

export default {
  name: 'DrawTab',
  components: {
    MapDrawer, IconButton
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
      return this.currentTabData.selectedObj
    },

    map() {
      return this.localTabObject.map
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
    drawMapFrom({ map, cellSize }) {
      this.$refs['map-drawer'].drawMapFrom({ map, cellSize })
    },
    loadDefaultMap() {
      return new Promise(function (resolve, reject) {
        setTimeout(function() {
          this.$refs['map-drawer'].loadDefaultMap()
        }.bind(this), 1000)
      }.bind(this))
    },
    resetMap() {
      return new Promise(function (resolve, reject) {
        setTimeout(async function() {
          await this.$refs['map-drawer'].resetMap()
          this.currentTabData.resetMap()
          resolve()
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
      this.tab.map = map
    },
    _onTabRemoveButtonClicked() {
      this.$emit('on-remove', this)
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
