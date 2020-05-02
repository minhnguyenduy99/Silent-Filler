<template>
  <b-card
    :style="_cardStyle"
    class="game-object__container p-3" bg-variant="info"
    @click="toggleSelect"
    >
    <b-container fluid="false">
      <b-row no-gutters>
        <b-col cols="auto">
          <div class="d-flex flex-column justify-content-end h-100">
            <b-row no-gutters class="text-light mb-2">
              <b-col cols="7" class="text-left">
                <span><strong>Tag</strong>: {{ tag }}</span>
              </b-col>
              <b-col cols="5">{{ getFormatSize }}</b-col>
            </b-row>
            <b-row no-gutters class="text-light" align-v="end">
              <b-col cols="7">
                <b-form-input type="text" required v-model="name"></b-form-input>
              </b-col>
              <b-col cols="5">
                <color-item :color="color" size="lg"></color-item>
              </b-col>
            </b-row>
          </div>
        </b-col>
        <b-col cols="auto">
          <b-row no-gutters class="justify-content-between">
            <b-button class="col col-12 btn-success w-100 mb-2" size="sm">Save</b-button>
            <b-button class="col col-12 btn-danger w-100" size="sm">Delete</b-button>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
import ColorItem from '../ColorPicker/ColorItem'

export default {
  name: 'GameObjectItem',
  components: {
    ColorItem
  },
  props: {
    gameObject: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tag: this.gameObject.tag,
      name: this.gameObject.name,
      size: this.gameObject.size,
      color: this.gameObject.color,
      isSelected: false
    }
  },
  computed: {
    _gameObject: {
      get () {
        let newObjectValue = {
          tag: this.tag,
          name: this.name,
          size: this.size,
          color: this.color
        }
        this.$emit('input', newObjectValue)
        return newObjectValue
      },
      set(val) {
        this.gameObject = val
        this.$emit('input', val)
      }
    },
    _cardStyle() {
      return {
        opacity: this.isSelected ? '1' : '0.6'
      }
    },
    getFormatSize() {
      let { width, height } = this._gameObject.size
      return `${width} x ${height}`
    }
  },
  methods: {
    toggleSelect() {
      let cb = this.isSelected ? this.unselect : this.select
      cb()
    },
    select() {
      this.isSelected = true
      this.$emit('selected', this)
    },
    unselect() {
      if (!this.isSelected) {
        return
      }
      this.isSelected = false
      this.$emit('unselected', this)
    }
  }
}
</script>

<style scoped lang="scss">
.game-object {

  &__container {

    // override bootstrap class
    &.card {
      > .card-body {
        padding: 0;
      }
    }

    &:hover {
      cursor: pointer;
    }
  }
}
</style>
