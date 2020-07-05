import GameObject from './GameObject'

export default class StaticObject extends GameObject {
  static DEFAULT_STATIC_OBJECT_SIZE = 1

  constructor(tag, name, color, id = null) {
    super(tag, name, color, {
      width: StaticObject.DEFAULT_STATIC_OBJECT_SIZE,
      height: StaticObject.DEFAULT_STATIC_OBJECT_SIZE
    }, id)
    this._isStatic = true
  }
}
