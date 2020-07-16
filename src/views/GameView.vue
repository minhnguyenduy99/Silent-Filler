<template>
  <div>
  </div>
</template>

<script>
// game core import
import { GameManager } from 'game/core'
import { TestScene } from 'game/scenes'
import { Player } from 'game/prefab'
import pixi, { Application, Sprite } from 'pixi.js'

export default {
  name: 'GameView',
  data() {
    return {
      resourceFolder: '@/pixi-core/game-assets/'
    }
  },
  async beforeCreate() {
    document.body.appendChild(GameManager.gameView)
    let resourceManager = GameManager.resourceManager
    resourceManager.addResourceFile('tilemap', require('../assets/tilemap.png'))
    resourceManager.addResourceFile('player', require('../assets/player.png'))
    resourceManager.addResourceFile('fplayer', require('../assets/fplayer.png'))
    resourceManager.addResourceFile('SelectArrow', require('../assets/SelectArrow.png'))
    await resourceManager.load()
    let scene = new TestScene()
    GameManager.addScene(scene)
    GameManager.start()
  }
}
</script>
