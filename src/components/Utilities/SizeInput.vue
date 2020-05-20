<template>
  <div @click.stop>
    <popup-form
      :isDataValid="_isDataValid"
      :disabled="disabled"
      :isDataChanged="_isDataChanged"
      @save="saveData"
    >
      <slot slot="active">
        <b-button :disabled="disabled" variant="dark">{{ _getFormatSizeString }}</b-button>
      </slot>
      <b-form-input v-if="square"
        class="mb-2"
        v-b-tooltip.hover title="Size"
        v-model.number="squareSize"
        lazy
        :state="_isSquareSizeValid"
        placeholder="Enter size"
        aria-describedby="input-live-help input-live-feedback"
      />
      <div v-else>
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
      </div>
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
      type: [Object, Number]
    },
    square: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  model: {
    prop: 'size',
    event: 'input'
  },
  data() {
    return {
      width: 0,
      height: 0,
      squareSize: 0,
      inputSize: null
    }
  },
  created: function() {
    if (this.square) {
      this.squareSize = this.size
    } else {
      let { width, height } = this.size
      this.width = width
      this.height = height
      this.inputSize = this.size
    }
  },
  computed: {
    _isHeightValid() {
      return !this.square && Number.isInteger(this.height) && this.height > 0
    },
    _isWidthValid() {
      return !this.square && Number.isInteger(this.width) && this.width > 0
    },
    _isSquareSizeValid() {
      return this.square && Number.isInteger(this.squareSize) && this.squareSize > 0
    },
    _getFormatSizeString() {
      return this.square ? `${this.squareSize}px` : `${this.size.height} x ${this.size.width}`
    },
    _isDataChanged() {
      return this.square ? (this.squareSize !== this.size)
        : (this.width !== this.size.width || this.height !== this.size.height)
    },
    _isDataValid() {
      return this.square ? this._isSquareSizeValid : (this._isHeightValid && this._isWidthValid)
    },
    _invalidMessage() {
      let invalidMsg = null
      if (this.square) {
        if (!this._isHeightValid) {
          invalidMsg = 'Size must be integer and positive'
        }
      } else {
         if (!this._isHeightValid || !this._isWidthValid) {
          invalidMsg = 'Size must be integer and positive'
        }
      }
      return invalidMsg
    }
  },
  methods: {
    saveData() {
      if (this.square) {
        this.$emit('input', this.squareSize)
        return
      }
      this.inputSize.width = this.width
      this.inputSize.height = this.height
      this.$emit('input', this.inputSize)
    }
  }
}
</script>
