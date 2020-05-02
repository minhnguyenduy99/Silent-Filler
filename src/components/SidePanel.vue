<template>
  <div class="panel-container">
    <transition-group
      :enter-active-class="`animated fast ${getStyleClass.open}`"
      :leave-active-class="`animated fast ${getStyleClass.close}`"
    >
      <div key="panel" v-if="isPanelShown" :class="getMainContentClasses" :style="{'background-color': background}">
        <slot></slot>
        <icon-button
          :class="[...getToggleButtonClasses, '--close']"
          variant="primary"
          size="sm"
          :btnIconName="getButtonName.close"
          @clicked="onTogglePanel(false)">
        </icon-button>
      </div>
      <icon-button
        key="openButton"
        v-show="!isPanelShown"
        style="z-index: -1"
        :class="[...getToggleButtonClasses, '--open']"
        variant="primary"
        size="sm"
        :btnIconName="getButtonName.open"
        @clicked="onTogglePanel(true)">
      </icon-button>
    </transition-group>
  </div>
</template>

<script>
import IconButton from './IconButton'

export default {
  name: 'SidePanel',
  components: {
    IconButton
  },
  props: {
    isOpened: {
      type: Boolean,
      required: false,
      default: () => true
    },
    direction: {
      type: String,
      required: false,
      validator: (val) => /^(vertical-(top|bottom))|(horizontal-(left|right))$/.test(val),
      default: () => 'vertical-top'
    },
    background: {
      type: String,
      required: false,
      default: () => 'white'
    },
    mainPanelClass: {
      type: String,
      required: false,
      default: () => ''
    }
  },
  created: function() {
    this.isPanelShown = this.isOpened
  },
  data() {
    return {
      verticalStyleClasses: {
        topOpen: 'slideInDown',
        topClose: 'slideOutUp',
        bottomOpen: 'slideInUp',
        bottomClose: 'slideOutDown'
      },
      horizontalStyleClasses: {
        leftOpen: 'slideInLeft',
        leftClose: 'slideOutLeft',
        rightOpen: 'slideInRight',
        rightClose: 'slideOutRight'
      },
      buttonClasses: {
        verticalClasses: ['toggle-panel', '--vertical'],
        horizontalClasses: ['toggle-panel', '--horizontal']
      },
      isPanelShown: true
    }
  },
  computed: {
    getStyleClass() {
      const [axis, side] = this.direction.split('-')
      if (axis === 'vertical') {
        return this._getVerticalPanelStyleClassObj(side)
      }
      return this._getHorizontalPanelStyleClassObj(side)
    },
    getToggleButtonClasses() {
      const [axis, side] = this.direction.split('-')
      let classArr = [`--${side}`]
      if (axis === 'vertical') {
        classArr.push(...this.buttonClasses.verticalClasses)
      } else {
        classArr.push(...this.buttonClasses.horizontalClasses)
      }
      return classArr
    },
    getMainContentClasses() {
      const [axis, side] = this.direction.split('-')
      let sideAppliedClasses
      if (axis === 'vertical') {
        sideAppliedClasses = side === 'top' ? 'pb-2' : 'pt-2'
      } else {
        sideAppliedClasses = side === 'left' ? 'pr-2' : 'pl-2'
      }
      return [sideAppliedClasses, this.mainPanelClass]
    },
    getButtonName() {
      const [axis, side] = this.direction.split('-')
      let close = side
      let open
      if (axis === 'vertical') {
        close = side === 'top' ? 'up' : 'down'
        open = close === 'up' ? 'down' : 'up'
      } else {
        open = close === 'left' ? 'right' : 'left'
      }
      return {
        open: `chevron-double-${open}`,
        close: `chevron-double-${close}`
      }
    }
  },
  methods: {
    onTogglePanel(isShown) {
      let event = isShown ? 'panelOpened' : 'panelClosed'
      this.isPanelShown = isShown
      this.$emit(event, this.isPanelShown)
    },
    _getVerticalPanelStyleClassObj(side) {
      const { topOpen, topClose, bottomOpen, bottomClose } = this.verticalStyleClasses
      if (side === 'top') {
        return { open: topOpen, close: topClose }
      } else if (side === 'bottom') {
        return { open: bottomOpen, close: bottomClose }
      }
      return null
    },
    _getHorizontalPanelStyleClassObj(side) {
      const { leftOpen, leftClose, rightOpen, rightClose } = this.horizontalStyleClasses
      if (side === 'left') {
        return { open: leftOpen, close: leftClose }
      } else if (side === 'right') {
        return { open: rightOpen, close: rightClose }
      }
      return null
    }
  }
}
</script>

<style scoped lang="scss">
  .panel-container {
    position: relative;

    .content-slot {
      background-color: white;
    }

    .toggle-panel {

      &.--vertical {
        left: 45%;
      }

      &.--horizontal {
        top: 45%;
      }

      &.--open {
        position: fixed;
        z-index: 0;

        &.--vertical {
          &.--top {
            top: -10px;
          }
          &.--bottom {
            bottom: 0;
          }
        }

        &.--horizontal {
          &.--left {
            left: -10px;
          }
          &.--right {
            right: -10px;
          }
        }
      }

      &.--close {
        position: absolute;
        &.--vertical {
          &.--top {
            bottom: -10px;
          }
          &.--bottom {
            top: -10px;
          }
        }

        &.--horizontal {
          &.--left {
            right: -25px;
          }
          &.--right {
            left: -25px;
          }
        }
      }
    }
  }
</style>
