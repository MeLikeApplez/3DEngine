export default class InstancedBuffer {
    /**
     * @param {ArrayBuffer} buffer 
     * @param {Number} count 
     */
    constructor(buffer, count) {
        this.buffer = buffer
        this.count = count
    }
}