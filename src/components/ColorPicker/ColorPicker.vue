<template>
  <div>
    <side-panel background="#efefef" direction="horizontal-right" mainPanelClass="shadow-lg">
      <div :style="{'max-width': getPanelWidth}" class="pl-2 py-1">
        <b-container fluid="false">
          <b-row no-gutters class="p-2" align-h="start">
            <b-col cols="auto" class="mr-2 my-1" v-for="color in getRecentUsedColors" :key="color.id">
              <color-item :color="color" size="lg" @click="changeSelectedColor(color)"></color-item>
            </b-col>
          </b-row>
          <b-row no-gutters class="p-2" align-h="start" align-v="end">
            <b-col cols="auto" class="mr-2 my-1" v-for="color in colors" :key="color.id">
              <color-item
                class="color-item-col"
                :color="color"
                @click="changeSelectedColor(color)"
              />
            </b-col>
          </b-row>
          <b-row no-gutters class="p-2">
            <b-col cols="10">
              <b-form-input
                v-model="inputColor"
                :state="isInputColorValid"
                placeholder="Enter color code"
                aria-describedby="input-live-help input-live-feedback"
              />
              <b-form-invalid-feedback id="input-live-feedback" class="text-left">
                Color code is invalid
              </b-form-invalid-feedback>
            </b-col>
            <b-col cols="2">
              <b-form-input v-b-tooltip.hover title="Custom color" type="color" @input="changeSelectedColor"/>
            </b-col>
            <b-col cols="auto">
              <color-item v-show="isInputColorValid" :color="inputColor" size="lg" class="mt-3 ml-auto" @click="changeSelectedColor(inputColor)"></color-item>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </side-panel>
  </div>
</template>

<script>
import ColorItem from './ColorItem'
import IconButton from '../Utilities/IconButton'
import SidePanel from '../Utilities/SidePanel'

export default {
  name: 'ColorPicker',
  components: {
    ColorItem, SidePanel
  },
  data() {
    return {
      recentUsedColors: [],
      colors: null,
      inputColor: null,
      smallColorItemWidth: null,
      colorItemPerRow: 10,
      panelWidth: 0,
      customColor: '#000000',
      selectedColor: null
    }
  },
  created: function () {
    this.colors = this.getBasicColors
  },
  computed: {
    getPanelWidth() {
      return `${this.colorItemPerRow * 33 + 24}px`
    },
    getRecentUsedColors() {
      if (this.recentUsedColors.length === 0) {
        return this.colors.slice(0, 3)
      }
      return this.recentUsedColors
    },
    getBasicColors() {
      let colors = []
      for (let r = 0; r < 255; r += 100) {
        for (let g = 0; g < 255; g += 100) {
          for (let b = 0; b < 255; b += 100) {
            colors.push(`rgb(${b},${g},${r})`)
          }
        }
      }
      colors.push('rgb(255,255,255)')
      return colors
    },
    isInputColorValid() {
      return /^#[\da-f]{6}$/.test(this.inputColor)
    }
  },
  methods: {
    changeSelectedColor(color) {
      this.selectedColor = color
      this.$store.commit('updateCurrentColor', this.selectedColor)
      console.log(`selected color: ${this.selectedColor}`)
    }
  }
}
</script>

<style scoped lang="scss">
.color-item-col {
  &:hover {
    > * {
      transform: scale(2, 2);
    }
  }
}
</style>
