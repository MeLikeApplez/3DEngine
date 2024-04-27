export default class Color {
    constructor(r, g, b) {
        this.value = new Uint8Array(3)

        this.setRgb(r, g, b)
    }

    /**
     * 
     * @param {Number} r 
     * @param {Number} g 
     * @param {Number} b 
     */
    setRgb(r=0, g=0, b=0) {
        this.value[0] = r
        this.value[1] = g
        this.value[2] = b
    
        return this
    }

    /**
     * 
     * @param {Number} hex 
     */
    setHex(hex=0) {
        this.value[2] = hex & 0xFF
        this.value[1] = (hex & 0x00FF00) >> 8
        this.value[0] = (hex & 0xFF0000) >> 16

        return this
    }
}