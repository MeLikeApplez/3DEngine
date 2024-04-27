import Euler from "./Euler"
import Vector3 from "./Vector3"

export default class Quaternion {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {Number} w 
     */
    constructor(x=0, y=0, z=0, w=1) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {Number} w 
     */
    set(x, y, z, w) {
        this.x = x
        this.y = y
        this.z = z
        this.w = w

        return this
    }

    /**
     * @param {Euler} euler 
     */
    // https://stackoverflow.com/a/50012073/13159492
    setFromEuler(euler) {
        const { a, b, c } = euler.getEulerByOrder()

        const s1 = Math.sin(a / 2)
        const s2 = Math.sin(b / 2)
        const s3 = Math.sin(c / 2)
        
        const c1 = Math.cos(a / 2)
        const c2 = Math.cos(b / 2)
        const c3 = Math.cos(c / 2)
    
        this.x = c1 * c2 * c3 + s1 * s2 * s3
        this.y = s1 * c2 * c3 - c1 * s2 * s3
        this.z = c1 * s2 * c3 + s1 * c2 * s3
        this.w = c1 * c2 * s3 - s1 * s2 * c3
    
        return this
    }

    /**
     * @param {Vector3} axis 
     * @param {Number} angle 
     */
    setFromAxisAngle(axis, angle) {
        const halfAngle = angle * 0.5
        const s = Math.sin(halfAngle)
        
        return new Quaternion(
            axis.x * s,
            axis.y * s,
            axis.z * s,
            Math.cos(halfAngle)
        )
    }

    identity() {
        this.set(0, 0, 0, 1)

        return this
    }

    normalize() {
        const magnitude = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z) + (this.w * this.w))

        if(magnitude === 0) {
            this.x = 0
            this.y = 0
            this.z = 0
            this.w = 0
        } else {
            this.x /= magnitude
            this.y /= magnitude
            this.z /= magnitude
            this.w /= magnitude
        }

        return this
    }

    clone() {
        return new Quaternion(this.x, this.y, this.z, this.w)
    }

    /**
     * 
     * @param {Quaternion} quaternion 
     */
    copy(quaternion) {
        return new Quaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w)
    }
}