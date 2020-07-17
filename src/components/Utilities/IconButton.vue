<template>
  <div>
    <b-button
      class="b-icon"
      v-bind="$attrs" v-on="$listeners"
      :variant="$attrs.variant ? $attrs.variant : 'outline-primary'"
      ref="innerButton">
      <b-icon :icon="btnIconName">
      </b-icon>
      <span v-if="textInButton">
        {{ btnTitle }}
      </span>
    </b-button>
    <span v-if="!textInButton" class="btn-description d-block text-center mt-1">{{ btnTitle }}</span>
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
    btnTitle: {
      type: String,
      required: false,
      default: () => ''
    },
    textInButton: {
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
