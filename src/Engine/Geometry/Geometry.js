export default class BufferGeometry {
    /**
     * @param {Number} trianglesPerFace 
     * @param {Array} data 
     */
    constructor(trianglesPerFace, data=[]) {
        this.trianglesPerFace = trianglesPerFace
        this.vertices = new Float32Array(data)

        this._buffer = null
        this._attribute = null
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    setBuffer(gl) {
        const buffer = gl.createBuffer()

        if(!buffer) throw Error('Failed to create static buffer!')

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        this._buffer = buffer

        return buffer
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    dispose(gl) {
        if(this._buffer === null) return false

        gl.deleteBuffer(this._buffer)
        this._buffer = null

        return true
    }

    /**
     * @param {Array} data 
     */
    set(data) {
        this.vertices = new Float32Array(data)

        return this.vertices
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     */
    translate(x=0, y=0) {
        for(let i = 0; i < this.vertices.length; i+=2) {
            this.vertices[i] += x
            this.vertices[i + 1] += y
        }

        return this.vertices
    }

    clone() {
        const newBuffer = new Float32Array(this.vertices.length)

        for(let i = 0; i < this.vertices.length; i++) {
            newBuffer[i] = this.vertices[i]
        }

        return newBuffer
    }

    /**
     * @param {BufferGeometry} geometry 
     */
    copy(geometry) {
        for(let i = 0; i < this.vertices.length; i++) {
            this.vertices[i] = geometry.buffer[i]
        }

        return this.vertices
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    initialize(gl, program) {
        this.setBuffer(gl)

        this._attribute = gl.getAttribLocation(program, 'vertexPosition')
        
        if(this._attribute === -1) throw Error('Failed to get attribute location!')
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW)

        gl.vertexAttribPointer(this._attribute, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this._attribute)

    }

}