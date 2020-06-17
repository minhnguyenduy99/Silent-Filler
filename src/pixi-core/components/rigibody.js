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

    /**
     * @private
     * @type {CollisionOut}
     */
    __frameCollision = undefined;

    /**
     * @public
     * @param {CollisionOut} o
     */
    MergeCollision(o) {
        if (o instanceof CollisionOut) {
            if (o.normalX !== undefined) {
                this.OnCollision(o)
            } else {
                if (this.__frameCollision === undefined) {
                    this.__frameCollision = o
                } else if (o.normalY < this.__frameCollision.normalY) {
                    this.__frameCollision = o
                }
            }
        }
    }

    update(delta) {
        super.update(delta)
        this._object.vx += this.ax * delta
        this._object.vy += this.ay * gravitiScale * delta
    }

    lateUpdate(delta) {
        this._object.x += this._object.vx * delta * DEFAULT_PIXEL_TO_CENTIMET
        this._object.y += this._object.vy * delta * DEFAULT_PIXEL_TO_CENTIMET
    }

    /**
     * @param {CollisionOut} out
     */
    OnCollision(out = undefined) {
        if (!out) {
            if (!this.__frameCollision) {
                return
            }
            out = this.__frameCollision
            this.__frameCollision = undefined
        }
        if (out.normalX !== undefined) {
            this._object.x += this._object.vx * out.normalX * DEFAULT_PIXEL_TO_CENTIMET
            this._object.vx = 0
        }
        if (out.normalY !== undefined) {
            this._object.y += this._object.vy * out.normalY * DEFAULT_PIXEL_TO_CENTIMET
            this._object.vy = 0
        }
    }

    IsPhysical() {
        return true
    }
}
