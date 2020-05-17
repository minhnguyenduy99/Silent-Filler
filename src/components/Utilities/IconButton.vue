<template>
  <div>
    <keep-alive :include="isPressed ? 'b-button' : 'someName'">
      <b-button
        class="b-icon"
        :size="size"
        :variant="variant"
        v-bind="$attrs" v-on="$listeners"
        :disabled="disabled"
        :pressed="isPressed"
        @click="_onClick"
        ref="innerButton">
        <b-icon :icon="_displayIcon"></b-icon>
      </b-button>
    </keep-alive>
    <span class="btn-description d-block text-center mt-1">{{ _displayTitle }}</span>
  </div>
</template>

<script>
import { BIcon } from 'bootstrap-vue'

export default {
  name: 'IconButton',
  components: {
    BIcon
  },
  props: {
    btnIconName: String,
    size: {
      type: String,
      default: () => 'lg'
    },
    variant: {
      type: String,
      default: () => 'outline-primary'
    },
    btnTitle: {
      type: String,
      required: false,
      default: () => ''
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    toggle: {
      type: Boolean,
      default: () => false
    },
    toggleTitle: {
      type: String,
      required: false,
      default: () => ''
    },
    pressed: {
      type: Boolean
    },
    toggleIconName: String
  },
  data() {
    return {
      isPressed: false,
      localToggleIcon: this.toggleIconName,
      localToggleTitle: this.toggleTitle
    }
  },
  created: function() {
    if (this.toggle) {
      this.isPressed = this.pressed
    }
    if (!this.localToggleIcon || this.localToggleIcon === '') {
      this.localToggleIcon = this.btnIconName
    }
  },
  watch: {
    isPressed: function(newVal, oldVal) {
      this.$emit('press-changed', newVal)
    }
  },
  computed: {
    _displayIcon() {
      if (!this.toggle) {
        return this.btnIconName
      }
      return this.isPressed ? this.localToggleIcon : this.btnIconName
    },
    _displayTitle() {
      if (!this.toggle) {
        return this.btnTitle
      }
      return this.isPressed ? this.localToggleTitle : this.btnTitle
    },
    _pressedEvent() {
      return this.toggle ? 'pressed.sync' : 'pressed'
    }
  },
  methods: {
    _onClick() {
      if (!this.toggle) {
        return
      }
      this.isPressed = !this.isPressed
    }
  }
}
</script>

<style scoped lang="scss">
  .btn-description {
    font-size: 15px;
  }
</style>
