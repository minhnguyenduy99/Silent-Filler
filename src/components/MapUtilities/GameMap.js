import GameObject from './GameObject'
import PlayableObject from './PlayableObject'
import Position from './Position'
import RectangleArea from './RectangleArea'

export default class GameMap {
  /**
   * @type {{[key: string]: PlayableObject}}
   */
  _maps = {}

  _concatKeyMapCharacter = 'x'

  /**
   * @param {[key string]: PlayableObject} objMap
   */
  constructor(objMap = null) {
    this._maps = objMap ?? {}
  }

  /**
   * Add a game object to map
   * @param {Position} position The position of object in the map
   * @param {PlayableObject} gameObj
   */
  async add(position, gameObj) {
    if (!gameObj) {
      throw new Error('`gameObj` cannot be null')
    }
    let isOverlap = await this.isOverlap(position, gameObj)
    if (isOverlap) {
      return false
    }
    let key = this.__generateMapKey(position)
    this._maps[key] = gameObj
    return true
  }

  /**
   * Remove an object out of map
   * @param {Position} position
   * @returns {GameObject} The removed object
   */
  remove(position) {
    let posKey = this.__generateMapKey(position)
    let obj = this._maps[posKey]
    if (!obj) {
      return null
    }
    this._maps[posKey] = undefined
    delete this._maps[posKey]
    return obj
  }

  /**
   * Check if `gameObj` overlaps any objects in map
   * @param {Position} position The position of `gameObj`
   * @param {GameObject} gameObj
   */
  async isOverlap(position, gameObj) {
    let { width, height } = gameObj.size
    let bottomRight = new Position(position.x + width - 1, position.y + height - 1)
    let listCheckObjs = this.getAllNotOverlapableObjectsInRange(new Position(0, 0), bottomRight)
    for (const posStr in listCheckObjs) {
      let currentPos = this.__degenerateMapKey(posStr)
      let currentObj = listCheckObjs[posStr]
      let isOverlap = await this.__isTwoObjectsOverlap(currentPos, position, currentObj, gameObj)
      if (isOverlap) {
        return true
      }
    }
    return false
  }

  isObjectInMap(objId) {
    let objs = Object.values(this._maps)
    let obj = objs.find(obj => obj.id === objId)
    return obj !== undefined
  }

  isEmpty() {
    return Object.keys(this._maps).length === 0
  }

  /**
   * Check if any drawn objects in range
   * @param {Position} topLeft
   * @param {Position} bottomRight
   */
  isAnyObjectsInRange(topLeft, bottomRight) {
    let checkArea = new RectangleArea(topLeft, bottomRight)
    for (const posStr in this._maps) {
      let obj = this._maps[posStr]
      let objTopLeft = this.__degenerateMapKey(posStr)
      if (checkArea.isOverlap(new RectangleArea(objTopLeft, obj.size))) {
        return true
      }
    }
    return false
  }

  /**
   * Get all objects in a specific range from `topLeft` to `bottomRIght`
   * @param {Position} topLeft
   * @param {Position} bottomRight
   * @returns {{[key: string]: GameObject}}
   */
  getAllNotOverlapableObjectsInRange(topLeft, bottomRight) {
    let checkArea = new RectangleArea(topLeft, bottomRight)
    let checkObjs = {}
    for (const posStr in this._maps) {
      if (this._maps[posStr].isOverlapable) {
        continue
      }
      let position = this.__degenerateMapKey(posStr)
      if (checkArea.isPointIn(position)) {
        checkObjs[posStr] = this._maps[posStr]
      }
    }
    return checkObjs
  }

  copy() {
    let cloneMap = new GameMap()
    let _map = {}
    Object.keys(this._maps).forEach(function(key) {
      _map[key] = this._maps[key].copy()
    }.bind(this))
    cloneMap._maps = _map
    cloneMap._concatKeyMapCharacter = this._concatKeyMapCharacter
    return cloneMap
  }

  getDistinctObjects() {
    let ids = []
    return Object.values(this._maps).filter(function(obj) {
      if (ids.includes(obj.id)) {
        return false
      }
      ids.push(obj.id)
      return true
    })
  }

  getMapObject() {
    let rawMap = {}
    for (let key in this._maps) {
      rawMap[key] = this._maps[key].id
    }
    return rawMap
  }

  /**
   *
   * @param {Position} position
   * @param {GameObject} gameObj
   * @returns {RectangleArea}
   */
  __getObjectArea(position, gameObj) {
    let { width, height } = gameObj.size
    return new RectangleArea(
      position,
      new Position(position.x + width - 1, position.y + height - 1)
    )
  }

  /**
   * @param {Position} posA
   * @param {Position} posB
   * @param {GameObject} objA
   * @param {GameObject} objB
   */
  async __isTwoObjectsOverlap(posA, posB, objA, objB) {
    let rectA = new RectangleArea(posA, objA.size)
    let rectB = new RectangleArea(posB, objB.size)
    return RectangleArea.isOverlap(rectA, rectB)
  }

  /**
   * Generate map key from position
   * @param {Position} position
   */
  __generateMapKey(position) {
    return `${position.x}${this._concatKeyMapCharacter}${position.y}`
  }

  /**
   * Degenerate map key to position
   * @param {String} key
   * @returns {Position}
   */
  __degenerateMapKey(key) {
    let [x, y] = key.split(this._concatKeyMapCharacter)
    return new Position(Number.parseInt(x), Number.parseInt(y))
  }
}
