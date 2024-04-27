import BufferGeometry from '../Geometry/Geometry'

import * as uuid from 'uuid'
import Color from '../Utils/Color'
import Vector3 from '../Math/Vector3'
import Euler from '../Math/Euler'
import TextureLoader from '../Texture/TextureLoader'

export default class Mesh {
    /**
     * @param {BufferGeometry} geometry 
     * @param {BufferMeshMaterial} material 
     */
    constructor(geometry, material) {
        this.geometry = geometry
        this.material = material

        this.position = new Vector3(0, 0, 0)
        this.scale = new Vector3(1, 1, 1)
        this.rotation = new Euler(0, 0, 0)
        this.centerOffset = new Vector3(0, 0, 0)

        this.ready = false

        this.isMesh = true
        this.isInstancedMesh = false

        this.uuid = uuid.v4()
        this._vertexArray = null

        this.updateCenterOffset()
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    dispose(gl) {
        if(this._vertexArray === null || !gl) return false

        gl.deleteVertexArray(this._vertexArray)
        this._vertexArray = null

        if(this.geometry) this.geometry.dispose(gl)
        if(this.material) this.material.dispose(gl)

        return true
    }

    updateCenterOffset() {
        let cx = 0
        let cy = 0
        let cz = 0
        
        for(let i = 0; i < this.geometry.vertices.length; i+=3) {
            const x = this.scale.x * this.geometry.vertices[i + 0]
            const y = this.scale.y * this.geometry.vertices[i + 1]
            const z = this.scale.z * this.geometry.vertices[i + 2]

            cx += x
            cy += y
            cz += z
        }

        const pointsLength = this.geometry.vertices.length / 3
        this.centerOffset.set(cx / pointsLength, cy / pointsLength, cz / pointsLength)

        return this
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
        this.material.initialize(gl, program, this.geometry)

        gl.bindVertexArray(null)
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    render(gl, program) {
        gl.bindVertexArray(this._vertexArray)
        this.material.renderTexture(gl, program, this.geometry)
        
        gl.drawArrays(gl.TRIANGLES, 0, this.geometry.vertices.length)
        
        gl.bindVertexArray(null)
    }
}

export class BufferMeshMaterial {
    /**
     * @param {{
     *  color: Color | Color[],
     * texture: TextureLoader
     * }} param0 
     */
    constructor({ color, texture }={}) {
        this.color = color
        this.texture = texture

        this.colorVertices = new Float32Array(0)
        this.textureVertices = new Float32Array(0)

        this._colorBuffer = null
        this._colorAttribute = null

        this._textureBuffer = null
        this._textureBufferImg = null
        this._textureAttribute = null
    }

    /**
     * @param {BufferGeometry} geometry 
     */
    setColorVertices(geometry) {
        this.colorVertices = new Uint8Array(geometry.vertices.length)

        if(Array.isArray(this.color)) {
            // colors * per triangle vertex
            const faceLength = this.color.length * geometry.trianglesPerFace

            let faceCount = 0
            let colorIndex = 0
            for(let i = 0; i < geometry.vertices.length; i+=3) {
                if(faceCount >= faceLength) {
                    this.colorVertices[i] = 0
                    this.colorVertices[i + 1] = 0
                    this.colorVertices[i + 2] = 0

                    continue
                }

                this.colorVertices[i] = this.color[colorIndex].value[0]
                this.colorVertices[i + 1] = this.color[colorIndex].value[1]
                this.colorVertices[i + 2] = this.color[colorIndex].value[2]

                faceCount++

                if(faceCount % geometry.trianglesPerFace === 0) {
                    colorIndex++
                }

            }

            return
        } else if(this.color) {
            for(let i = 0; i < geometry.vertices.length; i+=3) {
                this.colorVertices[i] = this.color.value[0]
                this.colorVertices[i + 1] = this.color.value[1]
                this.colorVertices[i + 2] = this.color.value[2]
            }
        }
    }
    
    /**
     * @param {BufferGeometry} geometry 
     */
    setTextureVertices(geometry) {
        const geometryBufferLength = (geometry.vertices.length / 3) * 2

        this.textureVertices = new Float32Array(geometryBufferLength)

        if(!this.texture) return

        if(Array.isArray(this.texture)) {
            const message = `
                Array textures are not allowed! Use texture atlases!
                https://webgl2fundamentals.org/webgl/lessons/webgl-3d-textures.html
                https://youtu.be/w3im_9qbM18?si=yj6QZMbBoaO6pRg3
            `
            throw Error(message)
        }

        const iterations = geometryBufferLength / this.texture.uv.length

        for(let i = 0; i < iterations; i++) {
            for(let j = 0; j < this.texture.uv.length; j++) {
                this.textureVertices[(i * this.texture.uv.length) + j] = this.texture.uv[j]
            }
        }
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    setColorBuffer(gl) {
        const buffer = gl.createBuffer()

        if(!buffer) throw Error('Failed to create static buffer!')

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.colorVertices, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        this._colorBuffer = buffer

        return buffer
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    setTextureBuffer(gl) {
        const buffer = gl.createBuffer()

        if(!buffer) throw Error('Failed to create static buffer!')

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.textureVertices, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        this._textureBuffer = buffer

        return buffer
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    dispose(gl) {
        gl.deleteBuffer(this._colorBuffer)
        this._colorBuffer = null

        gl.deleteBuffer(this._textureBuffer)
        this._textureBuffer = null

        return true
    }

    clone() {
        const newBufferMeshMaterial = new BufferMeshMaterial({
            color: this.color,
            texture: this.texture
        })

        newBufferMeshMaterial.colorVertices.set(this.colorVertices)

        return newBufferMeshMaterial
    }

    /**
     * @param {BufferMeshMaterial} bufferMaterial 
     */
    copy(bufferMaterial) {
        bufferMaterial.color = this.color
        bufferMaterial.texture = this.texture
        
        bufferMaterial.colorVertices.set(this.colorVertices)

        return newBufferMeshMaterial
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     * @param {BufferGeometry} geometry 
     */
    initialize(gl, program, geometry) {
        if(this.colorVertices.length <= 0) {
            this.setColorVertices(geometry)
        }

        if(!this._buffer) {
            this.setColorBuffer(gl)
        }

        this._colorAttribute = gl.getAttribLocation(program, 'vertexColor')
        if(this._colorAttribute === -1) throw Error('Failed to get attribute location!')

        //  color
        gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.colorVertices, gl.STATIC_DRAW)

        gl.vertexAttribPointer(this._colorAttribute, 3, gl.UNSIGNED_BYTE, true, 0, 0)
        gl.enableVertexAttribArray(this._colorAttribute)

        if(!this._textureBufferImg) {
            this._textureBufferImg = gl.createTexture()
        }
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     * @param {BufferGeometry} geometry 
     */
    renderTexture(gl, program, geometry) {
        if(this.textureVertices.length <= 0) {
            this.setTextureVertices(geometry)
        }

        if(!this._textureBuffer) {
            this.setTextureBuffer(gl)
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this._textureBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.textureVertices, gl.STATIC_DRAW)

        this._textureAttribute = gl.getAttribLocation(program, 'aTexCoord')

        if(this._textureAttribute === -1) throw Error('Failed to get attribute location!')
        
        gl.vertexAttribPointer(this._textureAttribute, 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this._textureAttribute)
        
        if(this.texture) {
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    
            gl.bindTexture(gl.TEXTURE_2D, this._textureBufferImg)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.texture.img)
    
            gl.generateMipmap(gl.TEXTURE_2D)            
        } else {
            // create an empty color texture
            gl.bindTexture(gl.TEXTURE_2D, this._textureBufferImg)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(3))
        }
       
    }
}
