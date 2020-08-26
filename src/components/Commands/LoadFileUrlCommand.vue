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
import { readFileHelper } from '../../services'

export default {
  name: 'LoadFileUrlCommand',
  components: {
    LoadingDialog
  },
  props: {
    url: {
      type: String,
      required: false
    },
    lazy: {
      type: Boolean,
      default: () => false,
      required: false
    }
  },
  watch: {
    url: function(newVal, oldVal) {
      if (!newVal || !this.tab) {
        return
      }
      this.name = newVal
      readFileHelper.toBlobFromURL(newVal)
      .then(file => {
        this.localFile = file
        this._setUpCommand()
        if (this.lazy) {
          return
        }
        this.execute()
      })
    }
  },
  created: function() {
    if (!this.url) {
      return
    }
    this.name = this.url
    readFileHelper.toBlobFromURL(this.url)
    .then(file => {
      this.localFile = file
      this._setUpCommand()
    })
  },
  data: () => ({
    command: null,
    isLoading: false,
    localFile: null,
    name: '',
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
      reader.readAsDataURL(this.localFile)
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
      reader.readAsText(this.localFile, 'utf-8')
      reader.onload = function(evt) {
        let mapInfo = JSON.parse(evt.target.result)
        tab.tab.loadAvailableMap(mapInfo)
        this.isLoading = false
      }.bind(this)
    },
    _isImage(ext) {
      return ['.png', '.jpg', 'jpeg'].includes(ext.toLowerCase())
    },
    _setUpCommand() {
      let isImage = this.name.includes('mapimage')
      console.log(isImage)
      let callback = isImage ? this._loadImageToMap : this._loadGameInfo
      this.command = new Command(callback, this.tab)
    }
  }
}
</script>
