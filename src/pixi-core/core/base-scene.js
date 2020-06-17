import * as pixi from 'pixi.js'
import GameObject from './game-object'

export default class BaseScene extends pixi.Container {
  /**
   *
   * @param {String} name Name of the scene
   */
  constructor(name) {
    super()
    this.name = name
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pivot.set(0, window.innerHeight)
    this.scale.set(1, -1)
  }

  /**
   * Update the scene
   * @virtual
   * @param {Number} delta
   */
  update(delta) {
    this.children.forEach((child) => {
      if (child.update && child.IsActive) {
        child.update(delta)
      }
    })
  }

  /**
   * @returns {pixi.Point}
   */
  get GlobalPosition() {
    return new pixi.Point(0, 0)
  }
}
