<template>
  <div>
    <b-button
      :style="getItemStyle"
      :size="getItemSize"
      class="border-black"
      v-b-tooltip.hover="{ variant: 'dark', customClass: 'color-item__tooltip'}" :title="getHexColorFormat"
      @click="onClick"
      @mouseenter="onMouseEnter"></b-button>
  </div>
</template>

<script>
export default {
  name: 'ColorItem',
  props: {
    color: {
      type: String,
      default: () => 'transparent'
    },
    size: {
      type: String,
      required: false,
      validator: (val) => {
        return ['sm', 'lg', 'auto'].includes(val)
      },
      default: () => 'sm'
    }
  },
  data() {
    return {
      baseStyle: {
        backgroundColor: this.color,
        border: 'none'
      },
      largeItemStyle: {
        width: '40px',
        height: '40px'
      },
      smallItemStyle: {
        width: '25px',
        height: '25px'
      },
      autoItemStyle: {
        width: 'auto',
        height: 'auto'
      },
      isSizeAuto: false
    }
  },
  watch: {
    color(newVal, oldVal) {
      this.baseStyle.backgroundColor = newVal
    }
  },
  computed: {
    getItemSize() {
      if (this.size === 'auto') {
        return
      }
      return this.size
    },
    isHexFormat() {
      return this.color[0] === '#'
    },
    getHexColorFormat() {
      if (!this._isColorValid(this.color)) {
        return null
      }
      if (this.isHexFormat) {
        return this.color
      }
      let colorParts = this.color.split(/[\\(,\\),\\, ]/)
      let hex = '#'
      for (let i = 1; i < colorParts.length - 1; i++) {
        let hexi = Number(colorParts[i]).toString(16)
        if (hexi.length < 2) {
          hexi = '0' + hexi
        }
        hex = hex + hexi
      }
      return hex
    },
    getItemStyle() {
      let style = this.baseStyle
      switch (this.size) {
        case 'lg': return { ...style, ...this.largeItemStyle }
        case 'sm': return { ...style, ...this.smallItemStyle }
        case 'auto': return { ...style, ...this.autoItemStyle }
      }
      return null
    }
  },
  methods: {
    _isColorValid(colorCode) {
      return /(^#[\da-f]{6}$)|(^rgb\(\d{1,3},\d{1,3},\d{1,3}\)$)/.test(colorCode)
    },
    onMouseEnter() {
      this.$emit('mouseenter')
    },
    onClick(ev) {
      this.$emit('click', ev)
    }
  }
}
</script>

<style scoped lang="scss">
.color-item {

  &__tooltip {
    letter-spacing: 0.1em;
  }
}
</style>
