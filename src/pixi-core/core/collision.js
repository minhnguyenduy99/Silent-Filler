import { DEFAULT_PIXEL_TO_CENTIMET } from './physical'
import GameObject from './game-object'
import { Rigidbody } from '../components'

/**
 * @param {Box} box
 * @param {CollisionOut} out
 */
function CollisionCall(box, out) {
    if (box.rigi) {
        box.rigi.OnCollision(out)
    }
    if (box.gameObject.OnCollision) {
        box.gameObject.OnCollision(out)
    }
}

/**
 * @returns {boolean}
 * @param {GameObject | Box} a
 * @param {GameObject | Box} b push object
 */
export function hit(a, b, collisionCall = false) {
    let box1, box2
    if (a instanceof Box) {
        box1 = a
    } else {
        box1 = new Box(a)
    }
    if (b instanceof Box) {
        box2 = b
    } else {
        box2 = new Box(b)
    }
    let ret = !(box1.left >= box2.right || box1.right <= box2.left || box1.top <= box2.bottom || box1.bottom >= box2.top)
    if (ret && collisionCall) {
        CollisionCall(box1, new CollisionOut(box2.gameObject))
        CollisionCall(box2, new CollisionOut(box1.gameObject))
    }
    return ret
}

/**
 * @returns {boolean} is collision
 * @param {GameObject|Box} a moving object
 * @param {GameObject|Box} b push-ed object
 * @param {number} TimeStep frame-by-frame time
 * @param {boolean} collisionCall is collision method had been call or not
 */
export function sweptAABB(a, b, TimeStep, collisionCall = true) {
    let box1, box2
    if (a instanceof Box) {
        box1 = a
    } else {
        box1 = new Box(a)
    }
    if (b instanceof Box) {
        box2 = b
    } else {
        box2 = new Box(b)
    }

    if (hit(box1, box2, collisionCall)) {
        return true
    }

    box1.vx -= box2.vx
    box1.vy -= box2.vy
    box2.vx = 0
    box2.vy = 0

    let xInvEntry, yInvEntry, xInvExit, yInvExit, xEntry, yEntry, xExit, yExit
    if (box1.vx > 0 || (box1.vx === 0 && box1.x < box2.x)) {
        xInvEntry = box2.left - box1.right
        xInvExit = box2.right - box1.left
    } else {
        xInvEntry = box2.right - box1.left
        xInvExit = box2.left - box1.right
    }
    if (box1.vy > 0 || (box1.vy === 0 && box1.y < box2.y)) {
        yInvEntry = box2.bottom - box1.top
        yInvExit = box2.top - box1.bottom
    } else {
        yInvEntry = box2.top - box1.bottom
        yInvExit = box2.bottom - box1.top
    }

    if (box1.vx === 0) {
        if (box1.width + box2.width <= Math.abs(xInvExit)) {
            xEntry = Number.POSITIVE_INFINITY
            xExit = Number.NEGATIVE_INFINITY
        } else {
            xEntry = Number.NEGATIVE_INFINITY
            xExit = Number.POSITIVE_INFINITY
        }
    } else {
        xEntry = xInvEntry / box1.vx
        xExit = xInvExit / box1.vx
    }
    if (box1.vy === 0) {
        if (box1.height + box2.height <= Math.abs(yInvExit)) {
            yEntry = Number.POSITIVE_INFINITY
            yExit = Number.NEGATIVE_INFINITY
        } else {
            yEntry = Number.NEGATIVE_INFINITY
            yExit = Number.POSITIVE_INFINITY
        }
    } else {
        yEntry = yInvEntry / box1.vy
        yExit = yInvExit / box1.vy
    }

    let Entry = Math.max(xEntry, yEntry)
    let Exit = Math.min(xExit, yExit)

    if (Entry > Exit || (xEntry < 0 && yEntry < 0) || xEntry > TimeStep || yEntry > TimeStep) {
        return false
    }

    let normalX, normalY
    if (xEntry > yEntry) {
        if (xInvEntry < 0) {
            normalX = Entry
            normalY = Number.NEGATIVE_INFINITY
        } else {
            normalX = -Entry
            normalY = Number.NEGATIVE_INFINITY
        }
    } else {
        if (yInvEntry < 0) {
            normalX = Number.NEGATIVE_INFINITY
            normalY = Entry
        } else {
            normalX = Number.NEGATIVE_INFINITY
            normalY = -Entry
        }
    }

    if (collisionCall) {
        CollisionCall(box1, new CollisionOut(box2.gameObject, false, normalX, normalY))
        CollisionCall(box2, new CollisionOut(box1.gameObject, false, -normalX, -normalY))
    }

    return true
}

export default class CollisionOut {
    /**
     * time to collision in x-axis
     * @type {number}
     */
    normalX

    /**
     * time to collision in y-axis
     * @type {number}
     */
    normalY

    /**
     * @type {GameObject}
     */
    gameObject

    /**
     * @type {boolean}
     */
    isCollide

    /**
     * @param {GameObject} thatObject
     */
    constructor(thatObject, isCollide = true, normalX = 0, normalY = 0) {
        this.gameObject = thatObject
        this.isCollide = isCollide
        this.normalX = normalX
        this.normalY = normalY
    }
}

export class Box {
    /**
     * @param {GameObject|Rigidbody} obj
     */
    constructor(obj) {
        if (obj instanceof Rigidbody) {
            this.rigi = obj
            this.gameObject = obj._object
        } else {
            this.gameObject = obj
        }
        let o = this.gameObject
        let p = o.GlobalPosition
        this.x = p.x
        this.y = p.y
        let halfWidth = o.width / 2
        let halfHeight = o.height / 2
        this.left = p.x - halfWidth
        this.right = p.x + halfHeight
        this.top = p.y + halfHeight
        this.bottom = p.y - halfHeight
        this.width = o.width
        this.height = o.height
        if (o.vx) {
            this.vx = o.vx * DEFAULT_PIXEL_TO_CENTIMET
        } else {
            this.vx = 0
        }
        if (o.vy) {
            this.vy = o.vy * DEFAULT_PIXEL_TO_CENTIMET
        } else {
            this.vy = 0
        }
    }

    /**
     * velocity x
     * @type {number}
     */
    vx

    /**
     * velocity y
     * @type {number}
     */
    vy

    /**
     * x position
     * @type {number}
     */
    x

    /**
     * y position
     * @type {number}
     */
    y

    /**
     * @type {number}
     */
    width

    /**
     * @type {number}
     */
    height

    /**
     * @type {number}
     */
    left

    /**
     * @type {number}
     */
    right

    /**
     * @type {number}
     */
    top

    /**
     * @type {number}
     */
    bottom

    /**
     * @type {GameObject}
     */
    gameObject

    /**
     * @type {Rigidbody}
     */
    rigi
}
