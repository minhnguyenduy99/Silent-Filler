<template>
  <div>
    <b-modal id="pause-game-modal" centered title="PAUSE GAME" hide-footer>
      <div class="d-flex flex-wrap">
        <b-button variant="primary" @click="resumeGame">RESUME</b-button>
        <b-button variant="warning" class="ml-3" @click="restartGame">RESTART</b-button>
        <b-button variant="danger" class="ml-3" style="justify-content-self: end" @click="exitGame">EXIT</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
// game core import
import { GameManager, ObjectMapper } from 'game/core'
import { TestScene, NewScene } from 'game/scenes'
import { Player } from 'game/prefab'
import pixi, { Application, Sprite } from 'pixi.js'
import { readFileHelper } from '../services'

export default {
  name: 'GameView',
  data() {
    return {
      resourceFolder: '@/pixi-core/game-assets/',
      isFirstPaused: true,
      map: null,
      mapObj: null
    }
  },
  created: function() {
    this.loadingPage('Game is loading ...')
  },
  mounted: function() {
    let map_id = this.$route.params.id
    this.getMapById(map_id)
    .then(function (map) {
      this.map = map
      readFileHelper.readJSONFileFromURL(this.map.map_file)
      .then(function (content) {
        this.mapObj = JSON.parse(content)
        this.loadGame()
        setTimeout(function() {
          this.unloadingPage()
        }.bind(this), 1000)
      }.bind(this))
    }.bind(this))
    .catch(err => {
      console.log(err)
    })
  },
  methods: {
    ...mapActions('map', ['getMapById']),
    ...mapMutations('web', ['loadingPage', 'unloadingPage']),

    onGamePaused(e) {
      if (e.detail.value) {
        if (this.isFirstPaused) {
          this.isFirstPaused = false
          return
        }
        this.$bvModal.show('pause-game-modal')
      } else {
        this.$bvModal.hide('pause-game-modal')
      }
    },

    resumeGame() {
      GameManager._sceneManager.currentScene.IsPause = false
      this.$bvModal.hide('pause-game-modal')
    },

    restartGame() {
      document.location.reload(true)
    },

    exitGame() {
      this.$router.push({
        name: 'ListGamePlay'
      })
    },

    onGameWin(e) {
      console.log(e)
    },

    loadGame() {
      Math.obj = this.mapObj
      document.body.appendChild(GameManager.gameView)
      GameManager.gameView.addEventListener('Pause', this.onGamePaused.bind(this))
      GameManager.gameView.addEventListener('Win', this.onGameWin.bind(this))
      let resourceManager = GameManager.resourceManager
      resourceManager.addResourceFile('tilemap', require('../assets/tilemap.png'))
      resourceManager.addResourceFile('player', require('../assets/player.png'))
      resourceManager.addResourceFile('fplayer', require('../assets/fplayer.png'))
      resourceManager.addResourceFile('SelectArrow', require('../assets/SelectArrow.png'))
      resourceManager.addResourceFile('lava', require('../assets/lava.png'))
      resourceManager.load()
      .then(() => {
        let scene = new NewScene()
        GameManager.addScene(scene)
        GameManager.start()
      })
    }
  }
}
</script>
