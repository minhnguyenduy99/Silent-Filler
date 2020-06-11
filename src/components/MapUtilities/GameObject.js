import uniqid from 'uniqid'

export default class GameObject {
  static DEFAULT_STATIC_OBJECT_SIZE = 1

  /**
   * @type {String}
   */
  id

  /**
   * @type {number}
   */
  tag

  /**
   * @type {String}
   */
  _color

  /**
   * @type {String}
   */
  name

  /**
   * @type {{ width: number, height: number }}
   */
  size

  /**
   * @type {Boolean}
   */
  isStatic

  /**
   * @type {(GameObject) => void}
   */
  onColorChanged

  /**
   *
   * @param {number} tag
   * @param {String} name
   * @param {Stringg} _color
   * @param {{ width: number, height: number }} size
   * @param {Boolean} isStatic Specify if the object is static (ground, grass, ...)
   */
  constructor(tag, name, _color, size, isStatic = true) {
    this.id = uniqid()
    this.tag = tag
    this.name = name
    this._color = _color
    this.isStatic = isStatic
    if (this.isStatic) {
      this.size = {
        width: GameObject.DEFAULT_STATIC_OBJECT_SIZE,
        height: GameObject.DEFAULT_STATIC_OBJECT_SIZE
      }
    } else {
      this.size = size
    }
  }

  get color() {
    return this._color
  }

  set color(val) {
    if (this._color === val) {
      return
    }
    this._color = val
    this.onColorChanged(this)
  }

  /**
   * @returns {GameObject}
   */
  copy() {
    return new GameObject(
      this.tag,
      this.name,
      this._color,
      { ...this.size },
      this.isStatic
    )
  }
}
