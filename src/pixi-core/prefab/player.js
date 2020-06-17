import { GameObject, TileSprite, CollisionOut, ControlComponent, Sprite } from '../core'
import { Rigidbody } from '../components'

export default class Player extends GameObject {
	/**
	 * @type {TileSprite | TileSprite[] | TileSprite[][]}
	 */
	__renderer

	/**
	 * @type {ControlComponent}
	 */
	__controler

	/**
	 * @type {GameObject}
	 */
	__container

	constructor(width = 1, height = 1) {
		super()
		this.addComponent(new Rigidbody())
		this.__MakeInput()
		this.__MakeRenderer(width, height)
	}

	__MakeInput() {
		this.__controler = new ControlComponent()
		this.addComponent(this.__controler)
	}

	width = 0
	height = 0

	__defaultPoint = 0

	/**
	 * @type {Sprite}
	 */
	arrow

	__MakeRenderer(width = 1, height = 1) {
		this.width = 32 * width
		this.height = 32 * height

		this.arrow = new Sprite('SelectArrow')
		this.__defaultPoint = (this.height >> 1) + 16
		this.addChild(this.arrow)

		if (width === 1 && height === 1) {
			this.__renderer = new TileSprite('player', 32, 32)
			this.addChild(this.__renderer)
			this.__renderer.setTileByIndex(0)
			return
		}
		if (width === 1) {
			this.__renderer = new Array(height)
			this.__renderer[0] = new TileSprite('player', 32, 32)
			this.__renderer[0].setTileByIndex(12)
			for (let i = 1; i < height - 1; i++) {
				this.__renderer[i] = new TileSprite('player', 32, 32)
				this.__renderer[i].position.set(0, i << 5)
				this.__renderer[i].setTileByIndex(8)
			}
			this.__renderer[height - 1] = new TileSprite('player', 32, 32)
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
			this.__renderer[0] = new TileSprite('player', 32, 32)
			this.__renderer[0].setTileByIndex(1)
			for (let i = 1; i < width - 1; i++) {
				this.__renderer[i] = new TileSprite('player', 32, 32)
				this.__renderer[i].position.set(i << 5, 0)
				this.__renderer[i].setTileByIndex(2)
			}
			this.__renderer[width - 1] = new TileSprite('player', 32, 32)
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
				this.__renderer[i][j] = new TileSprite('player', 32, 32)
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

	update(delta) {
		super.update(delta)
		if (this.__controler.isKeyDown('ArrowLeft', 'KeyA') && (this.__controler.isKeyDown('ArrowRight', 'KeyD'))) {
			this.vx = 0
		} else if (this.__controler.isKeyDown('ArrowLeft', 'KeyA')) {
			this.vx = -2
		} else if (this.__controler.isKeyDown('ArrowRight', 'KeyD')) {
			this.vx = 2
		} else {
			this.vx = 0
		}

		if (this.__controler.isKeyPressed('KeyW', 'ArrowUp')) {
			this.vy = 10
		}

		this.__totalTime += delta
		this.arrow.y = this.__defaultPoint + Math.sin(this.__totalTime * 6) * 4
	}

	__totalTime = 0

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

	/**
     * @param {CollisionOut} out
     */
	OnCollision(out) {
		out.gameObject.setFilter(0xff00ff)
	}
}
