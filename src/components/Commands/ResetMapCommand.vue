<template>
  <div>
    <loading-dialog v-model="isLoading" :centered="true" :content="content"/>
  </div>
</template>

<script>
import LoadingDialog from '../Utilities/LoadingDialog'
import { mapGetters, mapActions } from 'vuex'
import { Command } from '.'

export default {
  name: 'DrawMapCommand',
  components: {
    LoadingDialog
  },
  data: () => ({
    command: null,
    isLoading: false,
    content: 'Đang tạo map ...'
  }),
  computed: {
    ...mapGetters(['tab'])
  },
  watch: {
    tab: function(newVal, oldVal) {
      if (!newVal) {
        return
      }
      this.command = new Command(this._resetMap.bind(this), newVal)
      newVal.$on('draw-finished', function() {
        this.isLoading = false
      }.bind(this))
    }
  },
  methods: {
    ...mapActions(['addCommand']),

    execute() {
      this.command.execute()
      this.addCommand(this.command)
    },
    _resetMap(tab) {
      this.isLoading = true
      tab.resetMap()
    }
  }
}
</script>
