import Matrix4 from "./Matrix4"
import Quaternion from "./Quaternion"

export default class Euler {
    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    constructor(x=0, y=0, z=0) {
        this.x = x
        this.y = y
        this.z = z
        this.order = 'XYZ'
    }

    /**
     * 
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     * @param {string | *} order 
     */
    set(x, y, z, order) {
        this.x = x
        this.y = y
        this.z = z
        this.order = order || 'XYZ'

        return this
    }

    /**
     * @param {Quaternion} quaternion 
     */
    // https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
    setFromQuaternion(quaternion) {
        const ry = 2 * ((quaternion.w * quaternion.x) + (quaternion.y * quaternion.z))
        const rx = 1 - (2 * ((quaternion.x * quaternion.x) + (quaternion.y * quaternion.y)))

        this.x = Math.atan2(ry, rx)

        const p =  (2 * ((quaternion.w * quaternion.y) - (quaternion.x * quaternion.z)))
        const py = Math.sqrt(1 + p)
        const px = Math.sqrt(1 - p)

        this.y = 2 * Math.atan2(py, px) - (Math.PI / 2)

        const yy = 2 * ((quaternion.w * quaternion.z) + (quaternion.x * quaternion.y))
        const yx = 1 - 2 * ((quaternion.y * quaternion.y) + (quaternion.z * quaternion.z))
    
        this.z = Math.atan2(yy, yx)

        return this
    }

    getEulerByOrder() {
        const a = this.order[0] === 'X' ? this.x : (this.order[0] === 'Y' ? this.y : (this.order[0] === 'Z' ? this.z : 0))
        const b = this.order[1] === 'X' ? this.x : (this.order[1] === 'Y' ? this.y : (this.order[1] === 'Z' ? this.z : 0))
        const c = this.order[2] === 'X' ? this.x : (this.order[2] === 'Y' ? this.y : (this.order[2] === 'Z' ? this.z : 0))

        return { a, b, c }
    }

    getEulerByOrderTrig() {
        const { a, b, c } = this.getEulerByOrder()
        const s1 = Math.sin(a)
        const s2 = Math.sin(b)
        const s3 = Math.sin(c)
        
        const c1 = Math.cos(a)
        const c2 = Math.cos(b)
        const c3 = Math.cos(c)
        
        return { s1, s2, s3, c1, c2, c3 }
    }

    /**
     * 
     * @param {Matrix4} matrix4 
     */
    setFromRotationMatrix(matrix4) {
        this.x = Math.atan2(matrix4.elements[9], matrix4.elements[10])
        this.y = Math.atan2(-matrix4.elements[8], Math.sqrt(matrix4.elements[9] * matrix4.elements[9] + matrix4.elements[10] * matrix4.elements[10]))
        this.z = Math.atan2(matrix4.elements[4], matrix4.elements[0])

        return this
    }

    /**
     * 
     * @param {string} order 
     */
    reorder(order) {
        this.order = order

        return this
    }

    clone() {
        return new Euler(this.x, this.y, this.z)
    }

    /**
     * 
     * @param {Euler} euler 
     */
    copy(euler) {
        return new Euler(euler.x, euler.y, euler.z)
    }
}