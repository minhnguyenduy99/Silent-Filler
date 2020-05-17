<template>
  <div @click.stop>
    <popup-form
      :isDataValid="_isWidthValid && _isHeightValid"
      :disabled="disabled"
      :isDataChanged="_isDataChanged"
      @save="saveData"
    >
      <b-button :disabled="disabled" slot="active" variant="dark">{{ _getFormatSizeString }}</b-button>
      <b-form-input
        class="mb-2"
        v-b-tooltip.hover title="Height"
        v-model.number="height"
        lazy
        :state="_isHeightValid"
        placeholder="Enter height"
        aria-describedby="input-live-help input-live-feedback"
      />
      <b-form-input
        v-b-tooltip.hover title="Width"
        v-model.number="width"
        lazy
        :state="_isWidthValid"
        placeholder="Enter width"
        aria-describedby="input-live-help input-live-feedback"
      />
      <b-form-invalid-feedback id="input-live-feedback" class="text-left">
        {{ _invalidMessage }}
      </b-form-invalid-feedback>
    </popup-form>
  </div>
</template>

<script>
import PopupForm from '../Utilities/PopupForm'

export default {
  name: 'SizeInput',
  components: {
    PopupForm
  },
  props: {
    disabled: {
      type: Boolean,
      default: () => false
    },
    size: {
      type: Object,
      required: true
    }
  },
  model: {
    prop: 'size',
    event: 'input'
  },
  data() {
    return {
      width: this.size.width,
      height: this.size.height,
      inputSize: this.size
    }
  },
  computed: {
    _isHeightValid() {
      return Number.isInteger(this.height) && this.height > 0
    },
    _isWidthValid() {
      return Number.isInteger(this.width) && this.width > 0
    },
    _getFormatSizeString() {
      return `${this.size.height} x ${this.size.width}`
    },
    _isDataChanged() {
      return this.width !== this.size.width || this.height !== this.size.height
    },
    _invalidMessage() {
      if (!this._isHeightValid || !this._isWidthValid) {
        return 'Size must be integer and positive'
      }
      return null
    }
  },
  methods: {
    saveData() {
      this.inputSize.width = this.width
      this.inputSize.height = this.height
      this.$emit('input', this.inputSize)
    }
  }
}
</script>
