<template>
  <div>
    <b-container class="h-100">
      <b-row no-gutters class="h-100">
        <b-col cols="12">
          <div class="h-100 d-flex flex-wrap align-items-baseline justify-content-between align-content-between">
            <h4 v-if="isNewMap">Map name</h4>
            <b-input v-model="map_name" lazy :class="inputNameClass"/>
            <h6 class="m-0" v-if="!isNewMap">{{ lastEditedProp }}</h6>
          </div>
        </b-col>
        <b-col cols="12" v-if="!isNewMap">
          <b-button @click="loadMap" class="w-100" variant="primary" :disabled="isMapLoaded">Load map</b-button>
        </b-col>
      </b-row>
    </b-container>
    <load-file-url-command :url="mapItem.map_file_url" lazy ref="map-loader"/>
    <load-file-url-command :url="mapItem.map_image_url" lazy ref="image-loader"/>
  </div>
</template>

<script>
import { LoadFileUrlCommand } from '../components/Commands'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'MapInfoView',
  components: {
    LoadFileUrlCommand
  },
  data: () => ({
    map_name: 'New map name'
  }),
  created: function () {
    this.mapObj.map_name = this.map_name
  },
  watch: {
    map_name: function (newVal, oldVal) {
      this.mapObj.map_name = newVal
    },
    mapObj: function (newVal, oldVal) {
      if (!newVal) {
        return
      }
      this.map_name = newVal.map_name
    }
  },
  computed: {
    ...mapState('map-edit', ['isNewMap']),
    ...mapGetters('map-edit', ['mapObj', 'isMapLoaded']),

    inputNameClass() {
      return this.isNewMap ? ['mb-1', 'w-100'] : ['mb-1', 'w-75']
    },

    mapItem() {
      if (this.mapObj) {
        return this.mapObj
      }
      return {
        map_name: null,
        map_file_url: null,
        map_image_url: null,
        last_edited: new Date()
      }
    },

    lastEditedProp() {
      let lastEdited = new Date(this.mapItem.last_edited)
      let day = lastEdited.getDate()
      let month = lastEdited.getMonth()
      let year = lastEdited.getFullYear()
      return `${day}/${month}/${year}`
    }
  },
  methods: {
    loadMap() {
      if (this.isMapLoaded) {
        return
      }
      setTimeout(function() {
        this.$refs['image-loader'].execute()
        this.$refs['map-loader'].execute()
      }.bind(this), 1000)
    }
  }
}
</script>
