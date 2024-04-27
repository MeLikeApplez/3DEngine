import Euler from "./Euler"
import Quaternion from "./Quaternion"

export default class Vector3 {
    constructor(x=0, y=0, z=0) {
        this.x = x
        this.y = y
        this.z = z
    }

    set(x, y, z) {
        this.x = x
        this.y = y
        this.z = z

        return this
    }

    /** @param {Vector3} vector  */
    add(vector) {
        this.x += vector.x
        this.y += vector.y
        this.z += vector.z
    
        return this
    }

    /** @param {Vector3} vector  */
    subtract(vector) {
        this.x -= vector.x
        this.y -= vector.y
        this.z -= vector.z
    
        return this
    }

    /** @param {Vector3} vector  */
    multiply(vector) {
        this.x *= vector.x
        this.y *= vector.y
        this.z *= vector.z
    
        return this
    }

    /** @param {Vector3} vector  */
    divide(vector) {
        this.x /= vector.x
        this.y /= vector.y
        this.z /= vector.z
    
        return this
    }

    /**
     * @param {Number} factor 
     */
    addScalar(factor) {
        this.x += factor
        this.y += factor
        this.z += factor

        return this
    }

    /**
     * @param {Number} factor 
     */
    subtractScalar(factor) {
        this.x -= factor
        this.y -= factor
        this.z -= factor

        return this
    }

    /**
     * @param {Number} factor 
     */
    multiplyScalar(factor) {
        this.x *= factor
        this.y *= factor
        this.z *= factor

        return this
    }

    /**
     * @param {Number} factor 
     */
    divideScalar(factor) {
        this.x /= factor
        this.y /= factor
        this.z /= factor

        return this
    }

    /** @param {Vector3} vector  */
    distanceTo(vector) {
        const a = vector.x - this.x
        const b = vector.y - this.y
        const c = vector.z - this.z
        const distance = Math.sqrt((a * a) + (b * b) + (c * c))

        return distance
    }

    /** @param {Vector3} vector  */
    distanceToSquared(vector) {
        const a = vector.x - this.x
        const b = vector.y - this.y
        const c = vector.z - this.z
        const distance = (a * a) + (b * b) + (c * c)

        return distance
    }

    floor() {
        this.x = Math.floor(this.x)
        this.y = Math.floor(this.y)
        this.z = Math.floor(this.z)

        return this
    }

    ceil() {
        this.x = Math.ceil(this.x)
        this.y = Math.ceil(this.y)
        this.z = Math.ceil(this.z)

        return this
    }

    round() {
        this.x = Math.round(this.x)
        this.y = Math.round(this.y)
        this.z = Math.round(this.z)

        return this
    }

    /**
     * 
     * @param {Vector3} min 
     * @param {Vector3} max 
     */
    clamp(min, max) {
        this.x = Math.max(min.x, Math.min(this.x, max.x))
        this.y = Math.max(min.y, Math.min(this.y, max.y))
        this.z = Math.max(min.z, Math.min(this.z, max.z))

        return this
    }

    normalize() {
        const magnitude = Math.sqrt((this.x * this.x) + (this.y * this.y) + (this.z * this.z))

        if(magnitude === 0) {
            this.x = 0
            this.y = 0
            this.z = 0
        } else {
            this.x /= magnitude
            this.y /= magnitude
            this.z /= magnitude
        }

        return this
    }

    /**
     * 
     * @param {Matrix3} matrix 
     */
    applyFromMatrix3(matrix) {
        this.x = (matrix.elements[0] * this.x) + (matrix.elements[1] * this.y) + (matrix.elements[2] * this.z)
        this.y = (matrix.elements[3] * this.x) + (matrix.elements[4] * this.y) + (matrix.elements[5] * this.z)
        this.z = (matrix.elements[6] * this.x) + (matrix.elements[7] * this.y) + (matrix.elements[8] * this.z)

        return this
    }

    /**
     * @param {Quaternion} quaternion 
     */
    applyQuaternion(quaternion) {
        const newX = 2 * (quaternion.x * this.y - quaternion.w * this.x + quaternion.y * this.z)
        const newY = 2 * (quaternion.y * this.x - quaternion.w * this.y + quaternion.x * this.z)
        const newZ = 2 * (quaternion.z * this.x - quaternion.w * this.z - quaternion.x * this.y)

        this.x = newX
        this.y = newY
        this.z = newZ

        return this
    }

    /**
     * @param {Euler} euler 
     */
    applyEuler(euler) {
        const quaternion = new Quaternion().setFromEuler(euler)

        

        return this.applyQuaternion(quaternion)
    }

    /**
     * @param {Vector3} vector 
     */
    dot(vector) {
        return (this.x * vector.x) + (this.y * vector.y) + (this.z * vector.z)
    }

    /**
     * @param {Vector3} vector 
     */
    cross(vector) {
        return new Vector3(
            this.y * vector.z - this.z * vector.y,
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x
        )    
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    clone() {
        return new Vector3(this.x, this.y, this.z)
    }

    /**
     * 
     * @param {Vector3} vector 
     */
    copy(vector) {
        this.x = vector.x
        this.y = vector.y
        this.z = vector.z

        return this
    }
}