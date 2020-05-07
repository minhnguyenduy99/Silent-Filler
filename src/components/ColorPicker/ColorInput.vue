<template>
  <div @click.stop>
    <b-dropdown ref="drop-down" no-caret toggle-class="p-0 m-0 bg-transparent border-0" menu-class="p-1" :disabled="disabled">
      <color-item slot="button-content" :color="inputColor" :size="size"></color-item>
      <b-dropdown-form form-class="p-2">
        <b-form-input
          v-model="inputColor"
          :state="isInputColorValid"
          placeholder="Enter color code"
          aria-describedby="input-live-help input-live-feedback"
        />
        <b-form-invalid-feedback id="input-live-feedback" class="text-left">
          Color code is invalid
        </b-form-invalid-feedback>
        <b-button
          class="mt-2"
          variant="success"
          :disabled="!isInputColorValid"
          @click="updateColor">Save</b-button>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
import ColorItem from './ColorItem'
export default {
  name: 'ColorInput',
  components: {
    ColorItem
  },
  props: {
    color: {
      type: String,
      default: () => 'transparent'
    },
    disabled: Boolean,
    size: {
      type: String,
      required: false,
      validator: (val) => {
        return ['sm', 'lg', 'auto'].includes(val)
      },
      default: () => 'sm'
    }
  },
  model: {
    prop: 'color',
    event: 'input'
  },
  data() {
    return {
      inputColor: this.color,
      isShow: false
    }
  },
  mounted: function() {
    this.$root.$on('bv::dropdown::hide', function(bvEvent) {
      if (this.isInputColorValid) {
        return
      }
      bvEvent.preventDefault()
    }.bind(this))
  },
  computed: {
    isInputColorValid() {
      return /^#[\da-f]{6}$/.test(this.inputColor)
    }
  },
  methods: {
    updateColor() {
      this.$emit('input', this.inputColor)
      this.$refs['drop-down'].hide(true)
    }
  }
}
</script>
