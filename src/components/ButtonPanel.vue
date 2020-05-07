<template>
  <div>
    <side-panel direction="vertical-top" background="#efefef">
      <div>
        <b-container class="p-3" fluid="false">
          <b-row align-h="start">
            <icon-button size="lg" class="btn--block col col-1" btnIconName="square" btnTitle="Block mode" @click="onBlockButtonClicked"></icon-button>
            <icon-button size="lg" class="btn--eraser col col-1" btnIconName="archive" btnTitle="Erase mode"></icon-button>
            <icon-button size="lg" class="btn--duplicate col col-1" btnIconName="files" btnTitle="Duplicate"></icon-button>
            <icon-button size="lg" class="btn--add col col-1" btnIconName="plus-circle" btnTitle="Add"></icon-button>
            <b-form-file accept="image/*" size="lg" @input="onFileUploaded" class="col" browse-text="Upload"/>
          </b-row>
        </b-container>
      </div>
    </side-panel>
  </div>
</template>

<script>
import SidePanel from './Utilities/SidePanel'
import IconButton from './Utilities/IconButton'

export default {
  name: 'ButtonPanel',
  components: {
    SidePanel, IconButton
  },
  data: () => {
    return {
      cursorIconSources: [
        'eraser.png'
      ]
    }
  },
  methods: {
    onFileUploaded(file) {
      this.$emit('fileUploaded', file)
    },
    onBlockButtonClicked(ev) {
      this.$emit('blockClicked', ev)
    }
  }
}
</script>

<style scoped lang="scss">
  .panel-background {
    opacity: 0.3;
    background-color: #bbbbbb;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
</style>
