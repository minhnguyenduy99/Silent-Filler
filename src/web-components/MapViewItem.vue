<template>
  <div class="map-item__container mb-3" @click="navigateToEditMapPage">
     <b-card
      :img-src="data.map_image_url"
      img-alt="Image"
      img-width="100%"
      img-height="200px"
      :text-variant="isMouseIn ? 'light' : 'dark'"
      :bg-variant="isMouseIn ? 'primary' : 'light'"
      :border-variant="isMouseIn ? 'primary' : 'light'"
      tag="article"
      style="max-width: 18rem;"
      class="map-item__content text-left h-100"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
    >
    <b-card-title>
      <h5 class="overflow-hidden text-nowrap">
        {{ data.map_name.toUpperCase() }}
      </h5>
    </b-card-title>
    <b-card-text>
      <div class="d-flex justify-content-between flex-wrap">
        <span>Last edited</span>
        <span>
          <b>
            {{ lastEditedProps }}
          </b>
        </span>
      </div>
    </b-card-text>
  </b-card>
  </div>
</template>

<script>
export default {
  name: 'MapViewItem',
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          id: null,
          map_name: '',
          map_image_url: '',
          map_file_url: null,
          last_edited: new Date()
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
    isMouseIn: false
  }),
  computed: {
    lastEditedProps() {
      let lastEdited = this.data.last_edited
      let day = lastEdited.getDate()
      let month = lastEdited.getMonth()
      let year = lastEdited.getFullYear()
      return `${day}/${month}/${year}`
    }
  },
  methods: {
    onMouseEnter() {
      this.isMouseIn = true
    },
    onMouseLeave() {
      this.isMouseIn = false
    },
    navigateToEditMapPage() {
      this.$router.push({
        name: 'EditMap',
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
