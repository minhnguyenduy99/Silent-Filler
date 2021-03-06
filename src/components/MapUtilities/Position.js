
export default class Position {
  /**
   * @type {number}
   */
  x

  /**
   * @type {Number}
   */
  y

  /**
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    if (x < 0 || y < 0) {
      throw new Error('Position cannot be negative')
    }
    this.x = Math.floor(x)
    this.y = Math.floor(y)
  }

  /**
   * Check if the same position
   * @param {Position} position
   */
  equals(position) {
    return position !== null && position.x === this.x && position.y === this.y
  }
}
