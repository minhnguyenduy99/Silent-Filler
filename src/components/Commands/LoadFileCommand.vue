<template>
  <div>
    <loading-dialog v-model="isLoading" :centered="true" :content="content"/>
  </div>
</template>

<script>
import Command from './Command'
import LoadingDialog from '../Utilities/LoadingDialog'
import { mapState, mapMutations } from 'vuex'
import { GameObject } from '../MapUtilities'

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
      console.log(newVal)
      let parts = newVal.name.split('.')
      let callback = parts[parts.length - 1] === 'json' ? this._loadGameInfo : this._loadImageToMap
      this.command = new Command(callback, this.tab)
      this.execute()
    }
  },
  data: () => ({
    command: null,
    isLoading: false,
    content: 'Đang load file ...'
  }),
  computed: {
    ...mapState('map-edit', {
      tab: state => state.currentTab,
      currentTabData: state => state.currentTabData
    })
  },
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
    _loadGameInfo(tab) {
      let reader = new FileReader()
      reader.readAsText(this.file, 'utf-8')
      reader.onload = function(evt) {
        let mapInfo = JSON.parse(evt.target.result)
        tab.tab.loadAvailableMap(mapInfo)
        this.isLoading = false
      }.bind(this)
    },
    _isImage(ext) {
      return ['.png', '.jpg', 'jpeg'].includes(ext.toLowerCase())
    }
  }
}
</script>
