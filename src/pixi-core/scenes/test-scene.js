import { BaseScene, GameObject, PhysicalInstance } from '../core'
import Player from '../prefab/player'
import { TileMap } from '../components'
import { Point } from 'pixi.js'
// import { FPlayer } from '../prefab'

export default class TestScene extends BaseScene {
  constructor() {
    super()

    this.__initializeGameObjects()
  }

  p2

  __initializeGameObjects() {
    let mapContainer = new GameObject()
    let map = mapContainer.addComponent(new TileMap(mapContainer))
    this.addChild(mapContainer)
    map.setFilter(0x000080)
    PhysicalInstance.tilemap = map

    // let p = new Player(new Point(32 * 4 - 10, 32 * 9), new Point(16, 16), 0xff0000, 1, 1)
    // this.addChild(p)

    // let p3 = new Player(new Point(32 * 5.5 - 16, 32 * 11), new Point(32, 32), 0x00ffff, 1, 1)
    // this.addChild(p3)

    this.p2 = new Player(new Point(32 * 2 - 16, 32 * 11), new Point(128 + 16 + 32, 32 + 16 + 64), 0xffff00, 1, 1)
    this.addChild(this.p2)
  }
}
