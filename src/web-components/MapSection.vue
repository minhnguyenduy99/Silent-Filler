<template>
  <div class="map-section map-section__container">
    <div class="recent-maps__title text-left mb-3">
      <h3>{{ title }}</h3>
    </div>
    <div class="recent-maps__list d-flex flex-wrap">
      <map-view-item
        v-for="map in listMap" :key="map.id"
        class="mr-3"
        :data="map"
      />
    </div>
    <slot>
      <b-button variant="primary">Load more</b-button>
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
    pagination: {
      type: Boolean,
      required: false,
      default: () => false
    },
    totalCount: {
      type: Number,
      required: false,
      default: () => 0
    },
    pageSize: {
      type: Number,
      required: false,
      validator: (val) => val > 0,
      default: () => 3
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
  }
}
</script>
