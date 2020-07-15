import { Rigidbody, TileMap } from './../components'
import { sweptAABB, Box } from './collision'
import { TILE_SIZE } from './constant'

class Physical {
    /**
     * List Rigidbody object will check collision
     * @private
     * @type {Rigidbody[]}
     */
    RigidbodyList

    /**
     * Current tile map
     * @type {TileMap}
     */
    tilemap

    constructor() {
        this.RigidbodyList = []
    }

    update(delta) {
        if (this._isActive) {
            this.RigidbodyList.forEach(e => { if (e.IsActive) { e.update(delta) } })
        }
    }

    lateUpdate(delta) {
        if (this._isActive) {
            this.RigidbodyList.forEach(e => { if (e.IsActive) { e.lateUpdate(delta) } })
        }
    }

    _isActive = true
    get IsActive() {
        return this._isActive
    }

    set IsActive(value) {
        this._isActive = value
    }

    CollisionCall(delta) {
        if (!this._isActive) {
            return
        }
        // Collision to tilemap
        if (this.tilemap) {
            for (let i = 0; i < this.RigidbodyList.length; i++) {
                let collisionList = []
                let box = new Box(this.RigidbodyList[i])
                let top = Math.floor((box.top + (TILE_SIZE >> 1)) / TILE_SIZE)
                let bot = Math.floor((box.bottom - (TILE_SIZE >> 1)) / TILE_SIZE)
                let left = Math.floor((box.left - (TILE_SIZE >> 1)) / TILE_SIZE)
                let right = Math.floor((box.right + (TILE_SIZE >> 1)) / TILE_SIZE)
                for (let i = bot; i <= top; i++) {
                    for (let j = left; j <= right; j++) {
                        if (this.tilemap.__getPoint(i, j) > 0) {
                            collisionList.push(new Box(this.tilemap.__map[i][j]))
                        }
                    }
                }
                if (collisionList.length > 0) {
                    for (let i = 0; i < collisionList.length; i++) {
                        collisionList[i].userdata = box.distance(collisionList[i])
                    }
                    collisionList.sort((a, b) => {
                        if (a.userdata === b.userdata) {
                            return 0
                        } else if (a.userdata < b.userdata) {
                            return -1
                        } else {
                            return 1
                        }
                    })
                    sweptAABB(box, collisionList, delta, true)
                }
            }
        }

        // Collision to other object
        for (let i = 0; i < this.RigidbodyList.length - 1; i++) {
            for (let j = i + 1; j < this.RigidbodyList.length; j++) {
                if (sweptAABB(this.RigidbodyList[i], this.RigidbodyList[j], delta, true)) {
                    // console.log('2 object collision')
                }
            }
        }
        for (let i = this.RigidbodyList.length - 1; i >= 0; i--) {
            for (let j = i - 1; j >= 0; j--) {
                if (sweptAABB(this.RigidbodyList[i], this.RigidbodyList[j], delta, true)) {
                    // console.log('2 object collision')
                }
            }
        }
    }
}

const PhysicalInstance = new Physical()

export default PhysicalInstance
