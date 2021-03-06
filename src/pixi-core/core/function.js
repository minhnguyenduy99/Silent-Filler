import pixi, { Point } from 'pixi.js'

/**
 * @returns {number}
 * @param {number} low
 * @param {number} hight
 * @param {number} value
 */
Math.clamp = function (low, hight, value) {
    if (low > hight) {
        let tmp = low
        low = hight
        hight = tmp
    }
    if (value < low) {
        return low
    }
    if (value > hight) {
        return hight
    }
    return value
}

/**
 * @returns {number} Linearly interpolates between a and b by damping
 * @param {number} a
 * @param {number} b
 * @param {number} damping value between [0,1] where 0 is oldValue 1 is newValue
 */
Math.lerp = function (a, b, damping) {
    if (a > b) {
        return b + (a - b) * (1 - damping)
    } else {
        return a + (b - a) * damping
    }
}

var mathP = {}

/**
 * @return {number}
 * @param {Point} a
 * @param {Point} b
 */
mathP.distance = function (a, b) {
    let x = a.x - b.x
    let y = a.y - b.y
    return Math.sqrt(x * x + y * y)
}

/**
 * @return {number}
 * @param {Point} v
 */
mathP.direction = function (v) {
    return Math.atan2(v.y, v.x)
}

/**
 * @return {number}
 * @param {Point} v
 */
mathP.magnitude = function (v) {
    return Math.sqrt(v.x * v.x + v.y * v.y)
}

/**
 * @return {{x:number, y:number}}
 * @param {number} magnitude
 * @param {number} direction
 */
mathP.makeVector = function (magnitude, direction) {
    return {
        x: Math.cos(direction) * magnitude,
        y: Math.sin(direction) * magnitude
    }
}

export const MathP = mathP

export default class PointBounding {
    /**
     * @type {pixi.Container[]}
     */
    points = []

    top
    bottom
    left
    right

    /**
     * @type {pixi.Point}
     */
    central = new Point()

    /**
     * @param {pixi.Container} p
     */
    push(p) {
        this.points.push(p)
    }

    update() {
        if (this.points.length === 0) {
            return
        }

        this.left = this.right = this.points[0].x
        this.top = this.bottom = this.points[0].y

        for (let i = 1; i < this.points.length; i++) {
            if (this.points[i].x < this.left) {
                this.left = this.points[i].x
            }
            if (this.points[i].x > this.right) {
                this.right = this.points[i].x
            }
            if (this.points[i].y < this.top) {
                this.top = this.points[i].y
            }
            if (this.points[i].y > this.bottom) {
                this.bottom = this.points[i].y
            }
        }

        if (this.points.length > 0) {
            this.central.x = (this.left + this.right) / 2
            this.central.y = (this.top + this.bottom) / 2
        }
    }
}
