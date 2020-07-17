<template>
  <div id="game-view" class="position-relative">
    <div class="game__background position-relative" style="overflow: hidden">
      <div class="game__background__darken position-absolute top-0 left-0 w-100 h-100"></div>
      <b-img class="game__background__image" :src="backgroundImage" />
    </div>
    <b-modal id="pause-game-modal" centered title="PAUSE GAME" hide-footer>
      <div class="d-flex flex-wrap">
        <b-button variant="primary" @click="resumeGame">RESUME</b-button>
        <b-button variant="warning" class="ml-3" @click="restartGame">RESTART</b-button>
        <b-button variant="danger" class="ml-3" style="justify-content-self: end" @click="exitGame">EXIT</b-button>
      </div>
    </b-modal>
    <b-modal id="start-game-modal" centered title="ARE YOU READY" hide-footer>
      <div class="d-flex flex-wrap">
        <b-button size="lg" variant="primary" class="mr-3" @click="startGame">Yes</b-button>
        <b-button size="lg" variant="outline-danger" @click="navigateToGamePlay">Back to list game play</b-button>
      </div>
    </b-modal>
    <b-modal id="win-game-modal" centered title="YOU WIN :D" hide-footer>
      <h4 class="text-left mb-3">Time used: {{ winTime }}s</h4>
      <div class="d-flex flex-wrap">
        <b-button size="lg" variant="primary" class="mr-3" @click="restartGame">Play again</b-button>
        <b-button size="lg" variant="outline-danger" @click="navigateToGamePlay">Exit</b-button>
      </div>
    </b-modal>
    <b-modal id="lose-game-modal" centered title="YOU LOSE :((" hide-footer>
    <h4 class="text-left mb-3">{{ loseReason }}</h4>
      <div class="d-flex flex-wrap">
        <b-button size="lg" variant="primary" class="mr-3" @click="restartGame">Play again</b-button>
        <b-button size="lg" variant="outline-danger" @click="navigateToGamePlay">Exit</b-button>
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

var timeOutVar
export default {
  name: 'GameView',
  data() {
    return {
      resourceFolder: '@/pixi-core/game-assets/',
      isFirstPaused: true,
      map: null,
      mapObj: null,
      backgroundImage: null,
      countDown: 3,
      loseReason: '',
      winTime: 0
    }
  },
  created: function() {
    this.loadingPage('Game is loading ...')
  },
  mounted: function() {
    GameManager.gameView.style.position = 'absolute'
    GameManager.gameView.style.top = 0
    GameManager.gameView.style.left = 0
    let map_id = this.$route.params.id
    this.getMapById(map_id)
    .then(function (map) {
      this.map = map
      this.backgroundImage = map.map_image
      readFileHelper.readJSONFileFromURL(this.map.map_file)
      .then(function (content) {
        this.mapObj = JSON.parse(content)
        this.loadGame()
        this.unloadingPage()
        this.$bvModal.show('start-game-modal')
      }.bind(this))
    }.bind(this))
    .catch(err => {
      console.log(err)
    })
  },
  computed: {
    ...mapGetters('auth', ['user'])
  },
  methods: {
    ...mapActions('map', ['getMapById']),
    ...mapActions('game_state', ['updateGameState', 'createState', 'updateGameState']),
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

    startGame() {
      this.$bvModal.hide('start-game-modal')
      GameManager._sceneManager.currentScene.IsPause = false
    },

    navigateToGamePlay() {
      this.$router.push({
        name: 'ListGamePlay'
      })
      document.location.reload()
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
      this.winTime = Math.floor(e.detail.value)
      this.$bvModal.show('win-game-modal')
      if (!this.map.state) {
        this.createState({
          game_map: this.map.id,
          user: this.user.id
        })
      } else {
        this.updateGameState(this.map.state.id, 'AR')
      }
    },

    onGameLose(e) {
      this.loseReason = e.detail.value
      this.$bvModal.show('lose-game-modal')
    },

    loadGame() {
      Math.obj = this.mapObj
      document.getElementById('game-view').appendChild(GameManager.gameView)
      GameManager.gameView.addEventListener('Pause', this.onGamePaused.bind(this))
      GameManager.gameView.addEventListener('Win', this.onGameWin.bind(this))
      GameManager.gameView.addEventListener('Die', this.onGameLose.bind(this))
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

<style scoped lang="scss">
.game {
  &__background {
    z-index: 0;
    width: fit-content;
    height: fit-content;

    &__darken {
      background-color: black;
      opacity: 0.5;
      z-index: 0;
    }

    &__image {
      z-index: 1;
    }
  }
}
</style>
