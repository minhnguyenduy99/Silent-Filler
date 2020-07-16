import { Component, CollisionOut } from '../core'
import { ACCELERATION_GRAVITY, TILE_SIZE } from '../core/constant'

export default class Rigidbody extends Component {
    /**
     * Acceleration on x-axis
     * @type {number}
     */
    ax

    /**
     * Acceleration on y-axis
     * @type {number}
     */
    ay

    OnTheFloor = false

    /**
     * @param {number} ax Acceleration on x-axis
     * @param {number} ay Acceleration on y-axis
     */
    constructor(ax = 0, ay = ACCELERATION_GRAVITY) {
        super()
        this.ax = ax
        this.ay = ay
    }

    update(delta) {
        super.update(delta)
        this._object.vx += this.ax * delta
        this._object.vy += this.ay * delta
        this.OnTheFloor = false
        this._object.collisionOut = undefined
    }

    lateUpdate(delta) {
        this.OnCollision(this._object.collisionOut)
        this._object.x += this._object.vx * delta * TILE_SIZE
        this._object.y += this._object.vy * delta * TILE_SIZE
    }

    /**
     * @param {CollisionOut} out
     */
    OnCollision(out = undefined) {
        if (!out) {
            return
        }
        if (out.normalX !== undefined) {
            this._object.x += this._object.vx * out.normalX * TILE_SIZE
            this._object.vx = 0
        }
        if (out.normalY !== undefined) {
            if (this._object.vy < 0) {
                this.OnTheFloor = true
            }
            this._object.y += this._object.vy * out.normalY * TILE_SIZE
            this._object.vy = 0
        }
    }

    IsPhysical() {
        return true
    }
}
