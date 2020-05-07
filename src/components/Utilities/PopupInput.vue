<template>
  <div @click.stop>
    <b-dropdown ref="drop-down" no-caret toggle-class="p-0 m-0 bg-transparent border-0" menu-class="p-1" :disabled="disabled">
      <slot name="active"></slot>
      <b-dropdown-form form-class="p-2">
        <slot name="content"></slot>
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
  name: 'PopupInput',
  props: {
    isDataValid: {
      type: Boolean,
      default: () => true
    }
  },
  mounted: function() {
    this.$root.$on('bv::dropdown::hide', function(bvEvent) {
      if (this.isDataValid) {
        return
      }
      bvEvent.preventDefault()
    }.bind(this))
  },
  methods: {
    _saveButtonClicked() {
      this.$emit('click', this)
      this.$refs['drop-down'].hide(true)
    }
  }
}
</script>
