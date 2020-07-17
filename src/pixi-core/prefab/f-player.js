import { GameObject, TileSprite, MathP, PhysicalInstance } from '../core'
import { TILE_SIZE } from '../core/constant'
import GameManagerInstance from '../core/game-manager'

export default class FPlayer extends GameObject {
	/**
	 * @type {TileSprite | TileSprite[] | TileSprite[][]}
	 */
	__renderer

	/**
	 * @type {GameObject}
	 */
	__container

	width = 0
	height = 0

	/**
	 * @param {number} width
	 * @param {number} height
	 */
	constructor(width = 1, height = 1) {
		super()
		this.__MakeRenderer(width, height)
	}

	__MakeRenderer(width = 1, height = 1) {
		this.width = TILE_SIZE * width
		this.height = TILE_SIZE * height

		if (width === 1 && height === 1) {
			this.__renderer = new TileSprite('fplayer', TILE_SIZE, TILE_SIZE)
			this.addChild(this.__renderer)
			this.__renderer.setTileByIndex(0)
			return
		}
		if (width === 1) {
			this.__renderer = new Array(height)
			this.__renderer[0] = new TileSprite('fplayer', TILE_SIZE, TILE_SIZE)
			this.__renderer[0].setTileByIndex(12)
			for (let i = 1; i < height - 1; i++) {
				this.__renderer[i] = new TileSprite('fplayer', TILE_SIZE, TILE_SIZE)
				this.__renderer[i].position.set(0, i << 5)
				this.__renderer[i].setTileByIndex(8)
			}
			this.__renderer[height - 1] = new TileSprite('fplayer', TILE_SIZE, TILE_SIZE)
			this.__renderer[height - 1].position.set(0, (height - 1) << 5)
			this.__renderer[height - 1].setTileByIndex(4)

			this.__container = new GameObject()
			this.__renderer.forEach(e => this.__container.addChild(e))
			this.__container.position.set(0, 16 - (height << 4))
			this.addChild(this.__container)
			return
		}
		if (height === 1) {
			this.__renderer = new Array(width)
			this.__renderer[0] = new TileSprite('fplayer', TILE_SIZE, TILE_SIZE)
			this.__renderer[0].setTileByIndex(1)
			for (let i = 1; i < width - 1; i++) {
				this.__renderer[i] = new TileSprite('fplayer', TILE_SIZE, TILE_SIZE)
				this.__renderer[i].position.set(i << 5, 0)
				this.__renderer[i].setTileByIndex(2)
			}
			this.__renderer[width - 1] = new TileSprite('fplayer', TILE_SIZE, TILE_SIZE)
			this.__renderer[width - 1].position.set((width - 1) << 5, 0)
			this.__renderer[width - 1].setTileByIndex(3)

			this.__container = new GameObject()
			this.__renderer.forEach(e => this.__container.addChild(e))
			this.__container.position.set(16 - (width << 4), 0)
			this.addChild(this.__container)
			return
		}

		this.__container = new GameObject()

		this.__renderer = new Array(height)
		for (let i = 0; i < height; i++) {
			this.__renderer[i] = new Array(width)
			for (let j = 0; j < width; j++) {
				this.__renderer[i][j] = new TileSprite('fplayer', TILE_SIZE, TILE_SIZE)
				this.__renderer[i][j].setTileByIndex(10)
				this.__renderer[i][j].position.set(j << 5, i << 5)
				this.__container.addChild(this.__renderer[i][j])
			}
		}
		this.__renderer[0][0].setTileByIndex(13)
		this.__renderer[0][width - 1].setTileByIndex(15)
		this.__renderer[height - 1][0].setTileByIndex(5)
		this.__renderer[height - 1][width - 1].setTileByIndex(7)
		this.__container.position.set(16 - (width << 4), 16 - (height << 4))
		for (let i = 1; i < width - 1; i++) {
			this.__renderer[height - 1][i].setTileByIndex(6)
			this.__renderer[0][i].setTileByIndex(14)
		}
		for (let j = 1; j < height - 1; j++) {
			this.__renderer[j][0].setTileByIndex(9)
			this.__renderer[j][width - 1].setTileByIndex(11)
		}
		this.addChild(this.__container)
	}

	lateUpdate(delta) {
		let distance = MathP.distance(this.position, this.player.position)
		if (distance < this.addForceDistance) {
			let direction = MathP.direction({
				x: this.position.x - this.player.x,
				y: this.position.y - this.player.y
			})
			let force = MathP.makeVector(this.force, direction)
			let scale = (1 - distance / this.addForceDistance) / 2
			force.x *= scale
			force.y *= scale
			if ((force.x < 0.01) && (direction.x < 0.1)) {
				this.player.x = this.x
			} else {
				this.player.vx += force.x
			}
			if (Math.abs(this.player.vy) < Math.abs(force.y)) {
				this.player.vy = force.y
			}

			if (distance < this.force * scale) {
				this.player.position.set(this.position.x, this.position.y)
				GameManagerInstance._sceneManager._currentScene.FinishPlayer()
				this.lateUpdate = undefined
			}
		}
	}

	/**
	 * set filter color
	 * @param {number} colorCode
	 */
	setFilter(colorCode) {
		if (this.__renderer instanceof Array) {
			this.__renderer.forEach(e => {
				if (e instanceof Array) { e.forEach(e1 => e1.setFilter(colorCode)) } else e.setFilter(colorCode)
			})
		} else this.__renderer.setFilter(colorCode)
	}
}
