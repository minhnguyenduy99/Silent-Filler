<template>
  <div
    @mousedown="onMouseDown"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @mouseup="onMouseUp"
    :style="getCellStyle" class="cell__container d-inline-flex">
    <b-button
      v-on="$attrs"
      @click="toggleSelect"
      ref="button-cell"
      class="cell__object --flat bg-transparent"></b-button>
  </div>
</template>

<script>
export default {
  name: 'GridCell',
  props: {
    size: String,
    pos: {
      type: Object,
      required: true,
      default: function() {
        return { row: 0, col: 0 }
      }
    },
    color: {
      type: String,
      required: false,
      validator: (val) => /(^#[\da-f]{6}$)|(transparent)/.test(val),
      default: () => 'transparent'
    }
  },
  data() {
    return {
      isSelected: false,
      selectedColor: '#0f0f0f',
      isHover: false,
      currentColor: this.color
    }
  },
  watch: {
    color: function(newVal, oldVal) {
      if (!newVal) {
        return
      }
      this.currentColor = newVal || 'transparent'
    }
  },
  computed: {
    getCellStyle() {
      return {
        width: this.size,
        height: this.size,
        backgroundColor: this.currentColor,
        ...this._getStyleByState
      }
    },
    _getStyleByState() {
      return {
        backgroundColor: this.isHover ? 'rgba(255, 255, 255, 20%)' : this.currentColor
      }
    }
  },
  methods: {
    updateColor(color) {
      this.currentColor = color
    },
    select() {
      this.isSelected = true
      this._onCellClicked()
    },
    unselect() {
      this.isSelected = false
      this._onCellClicked()
    },
    toggleSelect() {
      let cb = this.isSelected ? this.unselect : this.select
      cb()
    },
    onMouseDown() {
      this.$emit('mousedown', this)
    },
    onMouseUp() {
      this.$emit('mouseup', this)
    },
    onMouseEnter() {
      this.isHover = true
      this.$emit('mouseenter', this)
    },
    onMouseLeave() {
      this.isHover = false
    },
    _onCellClicked() {
      let event = this.isSelected ? 'selected' : 'unselected'
      this.$emit(event, this)
    }
  }
}
</script>

<style scoped lang="scss">
  .cell {
    &__container {
      box-sizing: border-box;
      &:hover {
        background-color: #aaaaaa;
      }
    }
    &__object {
      box-sizing: border-box;
      border-collapse: collapse;
      height: 100%;
      width: 100%;
      padding: 0;

      &.--flat {
        border-radius: 0;
        border: 1px solid rgb(200, 200, 200);
      }
    }
  }
</style>
