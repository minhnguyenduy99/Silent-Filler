import { Component } from '../core'

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
     * @param {number} x Acceleration on x-axis
     * @param {number} y Acceleration on y-axis
     */
    constructor(x = 0, y = -9.8) {
        super()
        this.ax = x
        this.ay = y
    }

    update(delta) {
        super.update(delta)
        this._object.vx += this.ax * delta
        this._object.vy += this.ay * gravitiScale * delta
    }

    IsPhysical() {
        return true
    }
}
