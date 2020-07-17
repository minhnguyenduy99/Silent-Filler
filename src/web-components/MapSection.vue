<template>
  <div class="map-section map-section__container">
    <div class="recent-maps__title text-left mb-3">
      <h3>{{ title }}</h3>
    </div>
    <div v-if="listMap !== null && listMap.length > 0" class="recent-maps__list d-flex flex-wrap">
      <map-view-item
        v-for="map in listMap" :key="map.id"
        class="mr-3"
        :data="map"
      />
    </div>
    <div v-else>
      <h4>{{ emptyContent }}</h4>
    </div>
    <slot>
      <b-button v-if="loadButton" variant="primary" @click="onLoadButtonClicked">Load more</b-button>
    </slot>
  </div>
</template>

<script>
import MapViewItem from './MapViewItem'
export default {
  name: 'MapSection',
  components: {
    MapViewItem
  },
  props: {
    title: {
      type: String,
      required: false,
      default: () => null
    },
    listMap: {
      type: Array,
      required: false,
      default: () => []
    },
    loadButton: {
      type: Boolean,
      required: false,
      default: () => false
    },
    emptyContent: {
      type: String,
      required: false,
      default: () => 'Empty'
    }
  },
  data: () => ({
    DEFAULT_PAGE_SIZE: 3,
    totalPage: 0,
    currentPage: 1
  }),
  created: function () {
    if (!this.pagination) {
      return
    }
    this.totalPage = Math.ceil(this.totalCount / this.pageSize)
  },
  methods: {
    onLoadButtonClicked() {
      this.$emit('loadButtonClicked', this)
    }
  }
}
</script>
