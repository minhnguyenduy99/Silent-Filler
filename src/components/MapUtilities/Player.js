import { PlayableObject, Position } from '.'

export default class Player extends PlayableObject {
  /**
   * @type {Position}
   */
  _startPosition

  /**
   * @type {Position}
   */
  _endPosition

  /**
   *
   * @param {String} tag
   * @param {String} name
   * @param {String} color The color of the player formatted as HEX
   * @param {{width: number, height: number }} size
   * @param {String} id The id of player. If the player is first-time created, this argument is unset
   * @param {Position} startPosition
   * @param {Position} endPosition
   */
  constructor(tag, name, color, size, id = null, startPosition = null, endPosition = null) {
    super(tag, name, color, size, id)
    this._startPosition = startPosition
    this._endPosition = endPosition
  }

  get isBothPositionsSet() {
    return this._startPosition !== null && this._endPosition !== null
  }

  get isStartPositionSet() {
    return this._startPosition !== null
  }

  get isEndPositionSet() {
    return this._endPosition !== null
  }

  isStartPoint(x, y) {
    return (this._startPosition && this._startPosition.x === x && this._startPosition.y === y)
  }

  isEndPoint(x, y) {
    return (this._endPosition && this._endPosition.x === x && this._endPosition.y === y)
  }

  /**
   *
   * @param {Position} position
   */
  setStartPosition(position) {
    this._startPosition = position
  }

  /**
   *
   * @param {Position} position
   */
  setEndPosition(position) {
    this._endPosition = position
  }

  static create() {
    return new Player('PP', 'Player', '#000000', { width: 1, height: 1 })
  }
}
