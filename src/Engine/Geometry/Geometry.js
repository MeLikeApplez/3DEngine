export default class BufferGeometry {
    /**
     * @param {Number} trianglesPerFace 
     * @param {Boolean} centerToWorldSpace 
     * @param {Array} data 
     */
    constructor(trianglesPerFace, centerToWorldSpace, data=[]) {
        this.vertices = new Float32Array(data)

        this.trianglesPerFace = trianglesPerFace

        this._buffer = null
        this._attribute = null

        if(centerToWorldSpace) this.setVerticesToWorldCenter()
    }

    setVerticesToWorldCenter() {
        let cx = 0
        let cy = 0
        let cz = 0
        
        for(let i = 0; i < this.vertices.length; i+=3) {
            const x = this.vertices[i + 0]
            const y = this.vertices[i + 1]
            const z = this.vertices[i + 2]

            cx += x
            cy += y
            cz += z
        }

        const pointsLength = this.vertices.length / 3

        cx = -cx / pointsLength
        cy = -cy / pointsLength
        cz = -cz / pointsLength

        for(let i = 0; i < this.vertices.length; i+=3) {
            this.vertices[i + 0] += cx
            this.vertices[i + 1] += cy
            this.vertices[i + 2] += cz
        }
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    setBuffer(gl) {
        this.dispose(gl)

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
    load(gl, program) {
        this.setBuffer(gl)

        this._attribute = gl.getAttribLocation(program, 'vertexPosition')
        
        if(this._attribute === -1) throw Error('Failed to get attribute location!')
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this._buffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW)

        gl.vertexAttribPointer(this._attribute, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this._attribute)

    }

}