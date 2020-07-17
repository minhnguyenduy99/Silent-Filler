<template>
  <div>
    <b-modal
      hide-header
      hide-footer
      no-close-on-backdrop
      no-close-on-esc
      v-bind="$attrs"
      v-on="$listeners"
      v-model="localShow"
      modal-class="justify-content-center"
      dialog-class="w-auto">
      <div class="w-100 d-flex flex-column align-items-center py-4">
        <b-spinner class="d-block">
        </b-spinner>
        <h4 class="text-primary mt-4">{{ content }}</h4>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'LoadingDialog',
  props: {
    show: {
      type: Boolean,
      default: () => true
    },
    content: String
  },
  model: {
    prop: 'show',
    event: 'input'
  },
  data() {
    return {
      localShow: this.show
    }
  },
  watch: {
    localShow: function(newVal) {
      this.$emit('input', newVal)
    },
    show: function(newVal) {
      this.localShow = newVal
    }
  }
}
</script>
