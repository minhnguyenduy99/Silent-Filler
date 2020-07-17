import { Component, GameObject, TileSprite, GameManager } from '../core'
import { TILE_SIZE } from '../core/constant'

const test = [
	[1, -1, -1, -1, -1, -1, -1, 1],
	[1, -1, -1, -1, -1, -1, -1, 1],
	[1, -1, -1, -1, -1, -1, 1, 1],
	[1, -1, -1, -1, -1, -1, -1, 1],
	[1, -1, -1, -1, -1, -1, -1, 1],
	[1, -1, -1, -1, -1, -1, -1, 1],
	[1, -1, -1, -1, -1, -1, -1, 1],
	[1, 2, 1, 1, 1, 1, 2, 1]
	// [1, 1, 1, 1, 1, 1],
	// [1, 1, 1, 1, 1]
]

export default class TileMap extends Component {
	/**
	 * @private
	 * @type {TileSprite[][]}
	 */
	__map

	/**
	* @public
	* @type {number[][]}
	*/
	tile

	/**
	 * @protected
	 * @type {GameObject}
	 */
	_containerObj

	_deadlineY = Number.POSITIVE_INFINITY

	/**
	 * @param {GameObject} attachObj
	 * @param {Number[][]} tile
	 */
	constructor(attachObj, tile) {
		super()
		this.tile = test.reverse()
		this._containerObj = new GameObject()

		this.__map = new Array(this.tile.length)
		for (let i = 0; i < this.tile.length; i++) {
			this.__map[i] = new Array(this.tile[i].length)
			for (let j = 0; j < this.tile[i].length; j++) {
				if (this.__getPoint(i, j)) {
					if (this.tile[i][j] === 2) {
						this.__map[i][j] = new TileSprite('lava', TILE_SIZE, TILE_SIZE)
						this.__map[i][j].cantSetFilter = true
						this.__map[i][j].setTileByIndex(0)
						this.__map[i][j].OnCollision = this.Die.bind(this.__map[i][j])
					} else {
						this.__map[i][j] = new TileSprite('tilemap', TILE_SIZE, TILE_SIZE)
						this.__map[i][j].setTileByIndex(this.__getTileIndex(i, j))
					}
					this._containerObj.addChild(this.__map[i][j])
					let y = i * TILE_SIZE + (TILE_SIZE >> 1)
					this.__map[i][j].position.set(j * TILE_SIZE + (TILE_SIZE >> 1), y)

					this._deadlineY = Math.min(this._deadlineY, y - (TILE_SIZE << 2))
				}
			}
		}

		attachObj.addChild(this._containerObj)
		this.setFilter(0xffffff)
	}

	// #region suport function
	/**
	 * @returns {number} index number in tilemap sprite depending on special location
	 * @param {number} i row
	 * @param {number} j column
	 */
	__getTileIndex(i, j) {
		let ret = this.__getPoint(i, j + 1) | (this.__getPoint(i + 1, j) << 1) | (this.__getPoint(i, j - 1) << 2) | (this.__getPoint(i - 1, j) << 3)
		let flag = 0
		switch (ret) {
			case 3:
				return this.__getPoint(i + 1, j + 1) ? 3 : 16
			case 6:
				return this.__getPoint(i + 1, j - 1) ? 6 : 17
			case 7:
				if (!this.__getPoint(i + 1, j - 1)) { flag += 1 }
				if (!this.__getPoint(i + 1, j + 1)) { flag += 2 }
				return flag > 0 ? 21 - flag : 7
			case 9:
				return this.__getPoint(i - 1, j + 1) ? 9 : 21
			case 11:
				if (!this.__getPoint(i + 1, j + 1)) { flag += 1 }
				if (!this.__getPoint(i - 1, j + 1)) { flag += 2 }
				return flag > 0 ? 25 - flag : 11
			case 12:
				return this.__getPoint(i - 1, j - 1) ? 12 : 25
			case 13:
				if (!this.__getPoint(i - 1, j + 1)) { flag += 1 }
				if (!this.__getPoint(i - 1, j - 1)) { flag += 2 }
				return flag > 0 ? 29 - flag : 13
			case 14:
				if (!this.__getPoint(i - 1, j - 1)) { flag += 1 }
				if (!this.__getPoint(i + 1, j - 1)) { flag += 2 }
				return flag > 0 ? 32 - flag : 14
			case 15:
				flag = this.__getPoint(i + 1, j + 1) + (this.__getPoint(i + 1, j - 1) << 1) + (this.__getPoint(i - 1, j - 1) << 2) + (this.__getPoint(i - 1, j + 1) << 3)
				return flag === 15 ? 15 : 32 + flag
		}
		return ret
	}

	/**
	 * @private
	 * @returns {boolean} number check if map[i][j] is exist and have flatform
	 * @param {number} i
	 * @param {number} j
	 */
	__getPoint(i, j) {
		if (this.tile[i] && this.tile[i][j]) {
			return this.tile[i][j] >= 0
		} else {
			return false
		}
	}

	// #endregion

	/**
	 *
	 * @param {number} colorCode
	 */
	setFilter(colorCode) {
		this.__map.forEach(tileArr => {
			tileArr.forEach(tile => {
				if (!tile.cantSetFilter) {
					tile.setFilter(colorCode)
				}
			})
		})
	}

	Die(out) {
		console.log('die by larva')
		GameManager._sceneManager.currentScene.gameOver('Don\'t touch the larva')
		this.OnCollision = undefined
	}
}
