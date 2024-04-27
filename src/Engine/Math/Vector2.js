export default class Vector2 {
    constructor(x=0, y=0) {
        this.x = x
        this.y = y
    }

    set(x, y) {
        this.x = x
        this.y = y

        return this
    }

    /** @param {Vector2} vector  */
    add(vector) {
        this.x += vector.x
        this.y += vector.y
    
        return this
    }

    /** @param {Vector2} vector  */
    subtract(vector) {
        this.x -= vector.x
        this.y -= vector.y
    
        return this
    }

    /** @param {Vector2} vector  */
    multiply(vector) {
        this.x *= vector.x
        this.y *= vector.y
    
        return this
    }

    /** @param {Vector2} vector  */
    divide(vector) {
        this.x /= vector.x
        this.y /= vector.y
    
        return this
    }

    /**
     * @param {Number} factor 
     */
    addScalar(factor) {
        this.x += factor
        this.y += factor

        return this
    }

    /**
     * @param {Number} factor 
     */
    subtractScalar(factor) {
        this.x -= factor
        this.y -= factor

        return this
    }

    /**
     * @param {Number} factor 
     */
    multiplyScalar(factor) {
        this.x *= factor
        this.y *= factor

        return this
    }

    /**
     * @param {Number} factor 
     */
    divideScalar(factor) {
        this.x /= factor
        this.y /= factor

        return this
    }

    /** @param {Vector2} vector  */
    distanceTo(vector) {
        const u = vector.x - this.x
        const v = vector.y - this.y
        const distance = Math.sqrt((u * u) + (v * v))

        return distance
    }

    /** @param {Vector2} vector  */
    distanceToSquared(vector) {
        const u = vector.x - this.x
        const v = vector.y - this.y
        const distance = (u * u) + (v * v)

        return distance
    }

    floor() {
        this.x = Math.floor(this.x)
        this.y = Math.floor(this.y)

        return this
    }

    ceil() {
        this.x = Math.ceil(this.x)
        this.y = Math.ceil(this.y)

        return this
    }

    round() {
        this.x = Math.round(this.x)
        this.y = Math.round(this.y)

        return this
    }

    /**
     * 
     * @param {Vector2} min 
     * @param {Vector2} max 
     */
    clamp(min, max) {
        this.x = Math.max(min.x, Math.min(this.x, max.x))
        this.y = Math.max(min.y, Math.min(this.y, max.y))

        return this
    }

    normalize() {
        const magnitude = Math.sqrt((this.x * this.x) + (this.y * this.y))

        if(magnitude === 0) {
            this.x = 0
            this.y
        } else {
            this.x /= magnitude
            this.y /= magnitude
        }

        return this
    }

    /**
     * 
     * @param {Vector2} vector 
     */
    dot(vector) {
        return (this.x * vector.x) + (this.y * vector.y)
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    clone() {
        return new Vector2(this.x, this.y)
    }

    /**
     * 
     * @param {Vector2} vector 
     */
    copy(vector) {
        this.x = vector.x
        this.y = vector.y

        return this
    }
}