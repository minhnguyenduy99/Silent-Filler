import Position from './Position'

export default class RectangleArea {
  /**
  * @type {Position}
  */
  topLeft

  /**
   * @type {Position}
   */
  topRight

  /**
   * @type {Position}
   */
  bottomLeft

  /**
   * @type {Position}
   */
  bottomRight

  /**
   *
   * @param {Position} topLeft
   * @param {Position | { width: number, height: number }} bottomRight
   */
  constructor(topLeft, bottomRight) {
    this.topLeft = topLeft
    let br
    if (bottomRight.height) {
      br = new Position(topLeft.x + bottomRight.width - 1, topLeft.y + bottomRight.height - 1)
    } else {
      br = bottomRight
    }
    this.topRight = new Position(br.x, topLeft.y)
    this.bottomLeft = new Position(topLeft.x, br.y)
    this.bottomRight = br
  }

  /**
   * Check if the point is in the rectangle area
   * @param {Position} point
   * @returns {Boolean}
   */
  isPointIn(point) {
    let { x, y } = point
    return x >= this.topLeft.x && x <= this.topRight.x && y >= this.topLeft.y && y <= this.bottomLeft.y
  }

  getPointsAsArray() {
    return [this.topLeft, this.topRight, this.bottomLeft, this.bottomRight]
  }

  /**
   *
   * @param {Position} tl
   * @param {Position} tr
   * @param {Position} bl
   * @param {Position} br
   */
  __validateArea(tl, tr, bl, br) {
    let startX = tl.x
    let endX = tr.x
    let startY = tl.y
    let endY = bl.y
    return startX < endX && startY < endY
  }

  /**
   * Check if two rectangles are overlap each other
   * @param {RectangleArea} rectA
   * @param {RectangleArea} rectB
   */
  static async isOverlap(rectA, rectB) {
    if (RectangleArea.isAInB(rectA, rectB) || RectangleArea.isAInB(rectB, rectA)) {
      return true
    }
    let pointsA = rectA.getPointsAsArray()
    let pointsB = rectB.getPointsAsArray()
    let isOverlap = await Promise.all([
      pointsA.filter(point => rectB.isPointIn(point)).length > 0,
      pointsB.filter(point => rectA.isPointIn(point)).length > 0])
    return isOverlap.some(result => result === true)
  }

  /**
   * Check if the rectangle A is in rectangle B
   * @param {RectangleArea} rectA
   * @param {RectangleArea} rectB
   */
  static isAInB(rectA, rectB) {
    let { x: startXOfA, y: startYOfA } = rectA.topLeft
    let { x: endXOfA, y: endYOfA } = rectA.bottomRight
    let { x: startXOfB, y: startYOfB } = rectB.topLeft
    let { x: endXOfB, y: endYOfB } = rectB.bottomRight
    let isXIn = startXOfA >= startXOfB && endXOfA <= endXOfB
    let isYIn = startYOfA >= startYOfB && endYOfA <= endYOfB
    return isXIn && isYIn
  }
}
