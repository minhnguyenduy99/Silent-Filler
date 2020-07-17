<template>
  <div class="map-section map-section__container">
    <div class="recent-maps__title mb-5">
      <h3>{{ title.toUpperCase() }}</h3>
    </div>
    <div class="recent-maps__list d-flex flex-wrap justify-content-center">
      <game-state-item
        v-for="state in gameStates" :key="state.id"
        class="mr-3"
        :data="state"
      />
    </div>
    <slot>
      <b-button v-if="loadButton" variant="primary" @click="onLoadButtonClicked">Load more</b-button>
    </slot>
  </div>
</template>

<script>
import GameStateItem from './GameStateItem'
export default {
  name: 'GameStateSection',
  components: {
    GameStateItem
  },
  props: {
    title: {
      type: String,
      required: false,
      default: () => null
    },
    gameStates: {
      type: Array,
      required: false,
      default: () => []
    },
    loadButton: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  methods: {
    onLoadButtonClicked() {
      this.$emit('loadButtonClicked', this)
    }
  }
}
</script>
