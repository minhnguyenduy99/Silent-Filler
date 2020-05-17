import uniqid from 'uniqid'

export default class GameObject {
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
  color

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
  isOverlapable

  /**
   *
   * @param {number} tag
   * @param {String} name
   * @param {Stringg} color
   * @param {{ width: number, height: number }} size
   * @param {Boolean} isOverlapable Specify if this object can be overlap another object
   */
  constructor(tag, name, color, size, isOverlapable = true) {
    this.id = uniqid()
    this.tag = tag
    this.name = name
    this.color = color
    this.size = size
    this.isOverlapable = isOverlapable
  }

  /**
   * @returns {GameObject}
   */
  copy() {
    return new GameObject(
      this.tag,
      this.name,
      this.color,
      { ...this.size },
      this.isOverlapable
    )
  }
}
