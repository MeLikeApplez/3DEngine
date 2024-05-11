import Matrix4 from '../../Math/Matrix4'
import Vector3 from '../../Math/Vector3'
import Vector4 from '../../Math/Vector4'
import Color from '../../Utils/Color'

import Mesh from '../Mesh'
import InstancedBuffer from './InstancedBuffer'

// stride => (4 bytes per float)
// first row => (9 floats) => (9 floats * 4 bytes) => 36 stride
const STRIDE_FLOAT_BYTES = 4

export default class InstancedMesh extends Mesh {
    /**
     * @param {BufferGeometry} geometry 
     * @param {BufferMeshMaterial} material 
     * @param {Number} count 
     */
    constructor(geometry, material, count) {
        super(geometry, material)

        this.isMesh = false
        this.isInstancedMesh = true

        this.count = count
        /**
         * @type {ArrayBuffer[3]}
         */
        this.instanceColor = Array(count)
        /**
         * @type {Matrix4[]}
         */
        this.instanceMatrices = Array(count)

        this._transformBuffer = null
    
        this.initialize()
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    dispose(gl) {
        if(!gl) return false
        
        super.dispose(gl)

        gl.deleteBuffer(this._transformBuffer)
        this._transformBuffer = null

        return true
    }

    /**
     * @param {Number} index 
     * @param {Color} color 
     */
    getColorAt(index, color) {

    }

    /**
     * @param {Number} index 
     * @param {Matrix4} matrix 
     */
    getMatrixAt(index, matrix) {

    }

    /**
     * @param {Number} index 
     * @param {Color} color 
     */
    setColorAt(index, color) {

    }

    /**
     * @param {Number} index 
     * @param {Matrix4} matrix 
     */
    setMatrixAt(index, color) {

    }

    initialize() {
        this.instanceColor = Array(this.count)
        this.instanceMatrices = Array(this.count)

        for(let i = 0; i < this.count; i++) {
            const identityMatrix = new Matrix4()
            const defaultColor = new Float32Array(3)

            this.instanceMatrices[i] = identityMatrix
            this.instanceColor[i] = defaultColor
        }
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    update(gl, program) {
        if(!this.geometry || !this.material) throw Error('Cannot initialize mesh! Geometry or Material is missing!')   

        // VAO's only work on vertex buffers / color vertex buffers, NOT TEXTURES
        this._vertexArray = gl.createVertexArray()
        gl.bindVertexArray(this._vertexArray)

        this.geometry.load(gl, program)
        this.material.load(gl, program, this.geometry)

        // matrix + color
        const rowSize = 16 + 3
        const stride = rowSize * STRIDE_FLOAT_BYTES

        gl.deleteBuffer(this._transformBuffer)

        this._transformBuffer = gl.createBuffer()
        const transformData = new Float32Array(rowSize * this.count)

        for(let i = 0; i < this.count; i++) {
            const transformDataIndex = rowSize * i
            const matrix = this.instanceMatrices[i]

            transformData.set(matrix.elements, transformDataIndex)
            transformData.set(this.instanceColor[i], transformDataIndex + matrix.elements.length)
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this._transformBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, transformData, gl.STATIC_DRAW)

        const vertexMatrixLocation = gl.getAttribLocation(program, 'meshMatrix')

        gl.vertexAttribPointer(vertexMatrixLocation, 4, gl.FLOAT, false, stride, 0)
        gl.vertexAttribPointer(vertexMatrixLocation + 1, 4, gl.FLOAT, false, stride, 16)
        gl.vertexAttribPointer(vertexMatrixLocation + 2, 4, gl.FLOAT, false, stride, 32)
        gl.vertexAttribPointer(vertexMatrixLocation + 3, 4, gl.FLOAT, false, stride, 48)

        gl.enableVertexAttribArray(vertexMatrixLocation)
        gl.enableVertexAttribArray(vertexMatrixLocation + 1)
        gl.enableVertexAttribArray(vertexMatrixLocation + 2)
        gl.enableVertexAttribArray(vertexMatrixLocation + 3)

        const colorAttribute = gl.getAttribLocation(program, 'vertexColorOffset')

        gl.enableVertexAttribArray(colorAttribute)
        gl.vertexAttribPointer(colorAttribute, 3, gl.FLOAT, true, stride, 16 * STRIDE_FLOAT_BYTES)

        gl.vertexAttribDivisor(vertexMatrixLocation, 1)
        gl.vertexAttribDivisor(vertexMatrixLocation + 1, 1)
        gl.vertexAttribDivisor(vertexMatrixLocation + 2, 1)
        gl.vertexAttribDivisor(vertexMatrixLocation + 3, 1)
        gl.vertexAttribDivisor(colorAttribute, 1)
        
        gl.bindVertexArray(null)
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    render(gl, program) {        
        gl.bindVertexArray(this._vertexArray)
        
        if(this.matrixAutoUpdate) {
            this.updateMatrix()
        }

        this.material.renderTexture(gl, program, this.geometry)

        gl.drawArraysInstanced(gl.TRIANGLES, 0, this.geometry.vertices.length, this.count)
        gl.bindVertexArray(null)
    }
}