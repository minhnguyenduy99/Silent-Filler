<template>
  <div>
    <b-button class="b-icon" :size="size" :variant="variant" @click="onButtonClicked">
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
    }
  },
  methods: {
    onButtonClicked(ev) {
      this.$emit('clicked', ev)
    }
  }
}
</script>

<style scoped lang="scss">
  .btn-description {
    font-size: 15px;
  }
</style>
