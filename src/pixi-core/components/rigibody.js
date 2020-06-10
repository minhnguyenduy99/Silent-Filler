import { Component, CollisionOut, DEFAULT_PIXEL_TO_CENTIMET } from '../core'

const gravitiScale = 1

export default class Rigidbody extends Component {
    /**
     * Acceleration on x-axis
     * @public
     * @type {number}
     */
    ax;

    /**
     * Acceleration on y-axis
     * @public
     * @type {number}
     */
    ay;

    /**
     * @param {number} ax Acceleration on x-axis
     * @param {number} ay Acceleration on y-axis
     */
    constructor(ax = 0, ay = -9.8) {
        super()
        this.ax = ax
        this.ay = ay
    }

    update(delta) {
        super.update(delta)
        this._object.vx += this.ax * delta
        this._object.vy += this.ay * gravitiScale * delta
    }

    /**
     * @param {CollisionOut} out
     */
	OnCollision(out) {
        if (out.normalX >= 0) {
            this._object.x += this._object.vx * out.normalX * DEFAULT_PIXEL_TO_CENTIMET
            this._object.vx = 0
        }
        if (out.normalY >= 0) {
            this._object.y += this._object.vy * out.normalY * DEFAULT_PIXEL_TO_CENTIMET
            this._object.vy = 0
        }
    }

    IsPhysical() {
        return true
    }
}
