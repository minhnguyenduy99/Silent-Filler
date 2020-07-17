<template>
  <div @click.stop>
    <popup-form :disabled="disabled" :isDataValid="isInputColorValid" :isDataChanged="dataChanged" @save="updateColor">
      <color-item slot="active" :color="inputColor" :size="size"></color-item>
      <b-form-input
        v-model="inputColor"
        :state="isInputColorValid"
        placeholder="Enter color code"
        aria-describedby="input-live-help input-live-feedback"
      />
      <b-form-invalid-feedback id="input-live-feedback" class="text-left">
        Color code is invalid
      </b-form-invalid-feedback>
    </popup-form>
  </div>
</template>

<script>
import ColorItem from './ColorItem'
import PopupForm from '../Utilities/PopupForm'

export default {
  name: 'ColorInput',
  components: {
    ColorItem, PopupForm
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
      dataChanged: false
    }
  },
  watch: {
    inputColor: function(newVal, oldVal) {
      this.dataChanged = newVal !== this.color
    }
  },
  computed: {
    isInputColorValid() {
      return /^#[\da-f]{6}$/.test(this.inputColor)
    }
  },
  methods: {
    updateColor() {
      this.$emit('input', this.inputColor)
    }
  }
}
</script>
