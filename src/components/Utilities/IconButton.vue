<template>
  <div>
    <b-button
      class="b-icon"
      :size="size"
      :variant="variant"
      v-bind="$attrs" v-on="$listeners"
      :disabled="disabled"
      ref="innerButton">
      <b-icon :icon="btnIconName"></b-icon>
    </b-button>
    <span class="btn-description d-block text-center mt-1">{{ btnTitle }}</span>
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
    }
  }
}
</script>

<style scoped lang="scss">
  .btn-description {
    font-size: 15px;
  }
</style>
