<template>
  <div class="map-item__container" @click="navigateToGame">
     <b-card
      :img-src="game_map.map_image_url"
      img-alt="Image"
      img-height="200px"
      img-top
      :text-variant="isMouseIn ? 'light' : 'dark'"
      :bg-variant="isMouseIn ? 'primary' : 'light'"
      :border-variant="isMouseIn ? 'primary' : 'light'"
      tag="article"
      style="max-width: 18rem;"
      class="map-item__content mb-3 text-left"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
    <b-card-title>
      <h5 class="overflow-hidden text-nowrap">
        {{ game_map.map_name.toUpperCase() }}
      </h5>
    </b-card-title>
    <b-card-text>
      <div class="d-flex justify-content-between flex-wrap">
        <span>State</span>
        <span :style="getStateTextStyle">
          <b>
            {{ stateText }}
          </b>
        </span>
      </div>
    </b-card-text>
  </b-card>
  </div>
</template>

<script>
export default {
  name: 'GameStateItem',
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          id: null,
          saved_date: null,
          state: null,
          map_name: '',
          map_image: '',
          map_file: null,
          last_edited: new Date(),
          game_map: {
            id: null,
            map_name: null,
            map_image_url: null,
            map_file_url: null,
            created_by: null,
            last_edited: new Date()
          }
        }
      },
      required: true
    }
  },
  data: () => ({
    CARD_CLASS: [
      'map-item__content',
      'mb-3',
      'text-left'
    ],
    MOUSE_IN_CARD_CLASS: [
    ],
    MOUSE_OUT_CARD_CLASS: [
    ],
    isMouseIn: false
  }),
  computed: {
    game_map() {
      return this.data.game_map
    },
    stateText() {
      switch (this.data.state) {
        case 'AR': return 'Archieved'
        case 'OP': return 'On progress'
        case 'NA': return 'Not archieved'
      }
      return null
    },
    getStateTextStyle() {
      let style = {
        color: null
      }
      switch (this.data.state) {
        case 'AR': style.color = 'green'; break
        case 'OP': style.color = 'yellow'; break
        case 'NA': style.color = 'red'; break
      }
      return style
    }
  },
  methods: {
    onMouseEnter() {
      this.isMouseIn = true
    },
    onMouseLeave() {
      this.isMouseIn = false
    },
    navigateToGame() {
      this.$router.push({
        name: 'Game',
        params: {
          id: this.data.id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.map-item {
  &__content {
    user-select: none;
    cursor: pointer;
    transition: 0.1s ease-in;

    img {
      transition: 0.1s ease-in;
      opacity: 0.7;
    }

    &:hover {
      img {
        opacity: 1;
      }
    }
  }
}
</style>
