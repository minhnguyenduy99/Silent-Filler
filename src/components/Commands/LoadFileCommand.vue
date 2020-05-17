<template>
  <div>
    <loading-dialog v-model="isLoading" :centered="true" :content="content"/>
  </div>
</template>

<script>
import Command from './Command'
import LoadingDialog from '../Utilities/LoadingDialog'
import { mapState, mapMutations } from 'vuex'

export default {
  name: 'LoadFileCommand',
  components: {
    LoadingDialog
  },
  props: {
    file: {
      type: File
    }
  },
  watch: {
    file: function(newVal, oldVal) {
      if (!newVal || !this.tab) {
        return
      }
      this.command = new Command(this._loadImageToMap, this.tab)
      this.execute()
    }
  },
  data: () => ({
    command: null,
    isLoading: false,
    content: 'Đang load file ...'
  }),
  computed: mapState({
    tab: state => state.currentTab
  }),
  methods: {
    execute() {
      this.isLoading = true
      this.command.execute()
      this.$emit('image-loaded')
    },
    _loadImageToMap(tab) {
      // this.isLoading = true
      let reader = new FileReader()
      reader.readAsDataURL(this.file)
      reader.onload = evt => {
        let img = new Image()
        img.onload = function() {
          tab.loadImage(img)
          this.isLoading = false
        }.bind(this)
        img.src = evt.target.result
      }

      reader.onerror = evt => {
        console.error(evt)
      }
    },
    _loadGameInfo(file) {
      let reader = new FileReader()
      reader.readAsText(file, 'utf-8')
      reader.onload = function(evt) {
        // this.gameInfo = JSON.parse(evt.target.result)
        this.isLoading = false
      }.bind(this)
    },
    _isImage(ext) {
      return ['.png', '.jpg', 'jpeg'].includes(ext.toLowerCase())
    }
  }
}
</script>
