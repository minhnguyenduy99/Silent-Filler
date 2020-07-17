import GameObject from './GameObject'

export default class PlayableObject extends GameObject {
  constructor(tag, name, color, size, id = null) {
    super(tag, name, color, size, id)
    this._isStatic = false
  }
}
