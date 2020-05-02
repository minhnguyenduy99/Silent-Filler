<template>
  <div>
    <side-panel direction="horizontal-left" background="#eeffee">
      <div class="d-flex flex-column p-1">
        <b-button class="m-1" variant="outline-primary">Test</b-button>
        <b-button class="m-1" variant="outline-primary">Save and Quit</b-button>
        <b-button class="m-1" variant="outline-primary">Play and Upload</b-button>
        <b-button class="m-1" variant="outline-primary">Quit Edit Mode</b-button>
      </div>
    </side-panel>
  </div>
</template>

<script>
import SidePanel from './SidePanel'

export default {
  name: 'ControlPanel',
  components: {
    SidePanel
  },
  data() {
    return {
      buttonClass: 'm-1 sm',
      isPanelShown: true
    }
  }
}
</script>

<style scoped lang="scss">
  .button-wrapper {
    background-color: #eeffee;
  }
</style>
