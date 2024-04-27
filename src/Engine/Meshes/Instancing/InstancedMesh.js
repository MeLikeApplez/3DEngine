import Matrix4 from '../../Math/Matrix4'
import Color from '../../Utils/Color'

import Mesh from '../Mesh'
import InstancedBuffer from './InstancedBuffer'

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
        this.instanceColor = new InstancedBuffer(geometry.vertices, count)
        this.instanceMatrix = new InstancedBuffer(material.colorVertices, count)

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

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    update(gl, program) {
        if(!this.geometry || !this.material) throw Error('Cannot initialize mesh! Geometry or Material is missing!')   

        // VAO's only work on vertex buffers / color vertex buffers, NOT TEXTURES
        this._vertexArray = gl.createVertexArray()
        gl.bindVertexArray(this._vertexArray)


        this.geometry.initialize(gl, program)

        // stride => (4 bytes per float)
        // first row => (9 floats) => (9 float * 4 bytes) => 36 stride
        const stride = 9 * 4

        const transformBuffer = gl.createBuffer()
        const transformData = new Float32Array([
            // position     scale    color
               0, 0, -2,        1, 1, 1,    255, 0, 0, 
               0, 0, -4,        1, 1, 1,    0, 0, 255, 
        ])

        const colorAttribute = gl.getAttribLocation(program, 'vertexColor')

        gl.bindBuffer(gl.ARRAY_BUFFER, transformBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, transformData, gl.STATIC_DRAW)

        gl.enableVertexAttribArray(colorAttribute)
        gl.vertexAttribPointer(colorAttribute, 3, gl.FLOAT, true, stride, 24)

        const offsetAttribute = gl.getAttribLocation(program, 'vertexOffset')

        gl.enableVertexAttribArray(offsetAttribute)
        gl.vertexAttribPointer(offsetAttribute, 3, gl.FLOAT, false, stride, 0)

        gl.vertexAttribDivisor(colorAttribute, 1)
        gl.vertexAttribDivisor(offsetAttribute, 1)
        

        gl.bindVertexArray(null)
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    render(gl, program) {        
        gl.bindVertexArray(this._vertexArray)
        
        gl.drawArraysInstanced(gl.TRIANGLES, 0, this.geometry.vertices.length, 2)
        gl.bindVertexArray(null)
    }
}