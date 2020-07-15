import GameObject from './game-object'
import { Rigidbody } from '../components'
import { TILE_SIZE } from './constant'

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
    let box1 = Box.create(a)
    let box2 = Box.create(b)

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
 * @param {GameObject|Box|GameObject[]|Box[]} b push-ed object
 * @param {number} TimeStep frame-by-frame time
 * @param {boolean} collisionCall is collision method had been call or not
 */
export function sweptAABB(a, b, TimeStep, collisionCall = true) {
    let box1 = Box.create(a)
    /**
     * @type {Box[]}
     */
    let box2 = []
    if (b instanceof Array) {
        for (let i = 0; i < b.length; i++) {
            box2.push(Box.create(b[i]))
        }
    } else {
        box2 = [Box.create(b)]
    }

    for (let i = 0; i < box2.length; i++) {
        if (hit(box1, box2[i], collisionCall)) {
            return true
        }
    }

    box1.vx -= box2[0].vx
    box1.vy -= box2[0].vy
    box2[0].vx = 0
    box2[0].vy = 0

    let collisionList = []
    let xInvEntry, yInvEntry, xInvExit, yInvExit, xEntry, yEntry, xExit, yExit
    let normalX = Number.POSITIVE_INFINITY
    let normalY = Number.POSITIVE_INFINITY

    for (let i = 0; i < box2.length; i++) {
        if (box1.vx > 0 || (box1.vx === 0 && box1.x < box2[i].x)) {
            xInvEntry = box2[i].left - box1.right
            xInvExit = box2[i].right - box1.left
        } else {
            xInvEntry = box2[i].right - box1.left
            xInvExit = box2[i].left - box1.right
        }
        if (box1.vy > 0 || (box1.vy === 0 && box1.y < box2[i].y)) {
            yInvEntry = box2[i].bottom - box1.top
            yInvExit = box2[i].top - box1.bottom
        } else {
            yInvEntry = box2[i].top - box1.bottom
            yInvExit = box2[i].bottom - box1.top
        }

        if (box1.vx === 0) {
            if (Math.abs(box1.x - box2[i].x) < (box1.width + box2[i].width) / 2) {
                xEntry = -0.01
                xExit = Number.POSITIVE_INFINITY
            } else {
                xEntry = Number.POSITIVE_INFINITY
                xExit = Number.POSITIVE_INFINITY
            }
        } else {
            xEntry = xInvEntry / box1.vx
            xExit = xInvExit / box1.vx
        }
        if (box1.vy === 0) {
            if (Math.abs(box1.y - box2[i].y) < (box1.height + box2[i].height) / 2) {
                yEntry = -0.01
                yExit = Number.POSITIVE_INFINITY
            } else {
                yEntry = Number.POSITIVE_INFINITY
                yExit = Number.POSITIVE_INFINITY
            }
        } else {
            yEntry = yInvEntry / box1.vy
            yExit = yInvExit / box1.vy
        }

        let Entry = Math.max(xEntry, yEntry)
        let Exit = Math.min(xExit, yExit)

        if (Entry > Exit || (xEntry < 0 && yEntry < 0) || xEntry > TimeStep || yEntry > TimeStep) {
            continue
        }

        if (xEntry > yEntry) {
            normalX = Math.min(normalX, xEntry)
            box1.vx = 0
        } else {
            normalY = Math.min(normalY, yEntry)
            box1.vy = 0
        }

        collisionList.push(box2[i])
    }

    if (normalX === Number.POSITIVE_INFINITY) {
        normalX = undefined
    }
    if (normalY === Number.POSITIVE_INFINITY) {
        normalY = undefined
    }

    let isCollide = collisionList.length > 0
    if (isCollide) {
        if (collisionCall) {
            collisionList.forEach(e => CollisionCall(box1, new CollisionOut(e.gameObject, false, normalX, normalY)))
            if (box2.length === 1) {
                CollisionCall(box2[0], new CollisionOut(box1.gameObject, false, normalX, normalY))
            }
        } else {
            box1.gameObject.collisionOut = new CollisionOut(collisionList[0].gameObject, false, normalX, normalY)
        }
    }
    return isCollide
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
    constructor(thatObject, isCollide = true, normalX = undefined, normalY = undefined) {
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
        this.right = p.x + halfWidth
        this.top = p.y + halfHeight
        this.bottom = p.y - halfHeight
        this.width = o.width
        this.height = o.height
        if (o.vx) {
            this.vx = o.vx * TILE_SIZE
        } else {
            this.vx = 0
        }
        if (o.vy) {
            this.vy = o.vy * TILE_SIZE
        } else {
            this.vy = 0
        }
    }

    /**
     * @public
     * @returns {Box}
     * @param {GameObject|Rigidbody|Box} obj
     */
    static create(obj) {
        if (obj instanceof Box) {
            return obj
        } else {
            return new Box(obj)
        }
    }

    /**
     * @public
     * @returns {Number}
     * @param {Box} obj
     */
    distance(obj) {
        let x = this.x - obj.x
        let y = this.y - obj.y
        return Math.sqrt(x * x + y * y)
    }

    userdata

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
