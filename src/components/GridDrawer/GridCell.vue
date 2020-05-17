<template>
  <div
    :style="getCellStyle" class="cell__container d-inline-flex">
    <b-button
      v-on="$attrs"
      @click="toggleSelect"
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
      required: true,
      validator: (val) => /(^#[\da-f]{6}$)|(transparent)/.test(val),
      default: () => 'transparent'
    }
  },
  data() {
    return {
      isSelected: false,
      selectedColor: '#0f0f0f',
      currentColor: this.color,
      colorStack: []
    }
  },
  watch: {
    color: function(newVal, oldVal) {
      if (!newVal) {
        this.currentColor = null
        return
      }
      if (newVal !== 'transparent') {
        this.currentColor = newVal
        this.colorStack.push(newVal)
        return
      }
      this.currentColor = colorStack.pop() || 'transparent'
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
        'border-width': this.isSelected ? '4px' : '1px'
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
      this.$emit('mouseenter', this)
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
