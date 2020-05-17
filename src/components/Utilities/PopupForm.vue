<template>
  <div>
    <b-dropdown
      ref="drop-down"
      no-caret
      right
      toggle-class="p-0 m-0 bg-transparent border-0"
      menu-class="p-1" :disabled="disabled">
      <slot slot="button-content" name="active"></slot>
      <b-dropdown-form form-class="p-2">
        <slot></slot>
        <b-button
          class="mt-2"
          variant="success"
          :disabled="!isDataValid"
          @click="_saveButtonClicked">Save</b-button>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: 'PopupForm',
  props: {
    isDataValid: {
      type: Boolean,
      default: () => true
    },
    isDataChanged: {
      type: Boolean,
      default: () => false
    },
    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      dataChanged: this.isDataChanged
    }
  },
  watch: {
    isDataChanged: function(newVal) {
      this.dataChanged = newVal
    }
  },
  mounted: function() {
    this.$root.$on('bv::dropdown::hide', function(bvEvent) {
      if (this.isDataValid && !this.dataChanged) {
        return
      }
      bvEvent.preventDefault()
    }.bind(this))
  },
  methods: {
    _saveButtonClicked() {
      this.$emit('save', this)
      this.dataChanged = false
      this.$refs['drop-down'].hide(true)
    }
  }
}
</script>
