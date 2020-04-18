import { BaseScene, GameObject, PhysicalInstance } from '../core'
import Player from '../prefab/player'
import { TileMap, Rigidbody } from '../components'

export default class TestScene extends BaseScene {
  constructor() {
    super()

    this.__initializeGameObjects()
  }

  __initializeGameObjects() {
    let mapContainer = new GameObject()
    let map = mapContainer.addComponent(new TileMap(mapContainer))
    map.setFilter(0x000080)
    PhysicalInstance.tilemap = map

    let p = new Player(2, 2)
    p.position.set(32 << 1, 300)
    p.setFilter(0xff0000)
    p.addComponent(new Rigidbody())
    p.setVelocity(0, 15)
    this.addChild(mapContainer)
    this.addChild(p)
  }
}
